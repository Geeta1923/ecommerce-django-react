from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
import razorpay
from django.conf import settings
from rest_framework.decorators import authentication_classes

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Sum


from .models import Order, OrderItem, ShippingAddress, Product, Review
import uuid
from rest_framework.decorators import api_view, permission_classes




from .models import Product, Order   # Added Order import
from .serializer import (
    ProductSerializer,
    UserSerializer,
    UserSerializerWithToken,
    OrderSerializer,
    ReviewSerializer,
)






#  Custom Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


#  Custom Token View
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# User Registration
@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],  # using email as username
            email=data['email'],
            password=make_password(data['password']),
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


#  Get Logged-In User Profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


#  Update Logged-In User Profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data.get('name', user.first_name)
    user.email = data.get('email', user.email)
    user.username = data.get('email', user.username)  # keep email consistent

    if data.get('password'):
        user.password = make_password(data['password'])

    user.save()
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


# Get All Users (Admin Only)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


#  Get Orders for Logged-In User
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# Get All Products
@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


#  Get Single Product
@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)




@api_view(['POST'])
@authentication_classes([JWTAuthentication])  # 🔑 CRITICAL FIX
@permission_classes([IsAuthenticated])

def addOrderItems(request):
    print("AUTH HEADER:", request.META.get("HTTP_AUTHORIZATION"))
    print("USER:", request.user)

    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=400)

    order = Order.objects.create(
        user=user,
        paymentMethod=data['paymentMethod'],
        taxPrice=data['taxPrice'],
        shippingPrice=data['shippingPrice'],
        totalPrice=data['totalPrice']
    )

    ShippingAddress.objects.create(
        order=order,
        address=data['shippingAddress']['address'],
        city=data['shippingAddress']['city'],
        postalCode=data['shippingAddress']['postalCode'],
        country=data['shippingAddress']['country'],
    )

    for item in orderItems:
        product = Product.objects.get(_id=item['product'])
        if product.countInStock < item['qty']:
         return Response(
        {'detail': 'Not enough stock'},
        status=status.HTTP_400_BAD_REQUEST
    )


        OrderItem.objects.create(
                  product=product,
                  order=order,
                  name=product.name,
                  qty=item['qty'],
                  price=item['price'],
                  image = product.image.name,   # ✅ ONLY CORRECT OPTION
)


        product.countInStock -= item['qty']
        product.save()

    return Response({'orderId': order._id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)

        # Allow only owner or admin
        if user != order.user and not user.is_staff:
            return Response(
                {'detail': 'Not authorized to view this order'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

    except Order.DoesNotExist:
        return Response(
            {'detail': 'Order does not exist'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancelOrder(request, pk):
    try:
        order = Order.objects.get(_id=pk, user=request.user)

        if order.isDelivered:
            return Response(
                {'detail': 'Delivered orders cannot be cancelled'},
                status=400
            )

        if order.isCancelled:
            return Response(
                {'detail': 'Order already cancelled'},
                status=400
            )

        # Restore stock
        orderItems = order.orderitem_set.all()
        for item in orderItems:
            product = item.product
            product.countInStock += item.qty
            product.save()

        order.isCancelled = True
        order.cancelledAt = timezone.now()
        order.save()

        return Response({'detail': 'Order cancelled successfully'})

    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=404)

from rest_framework.permissions import IsAdminUser
from django.utils import timezone

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = timezone.now()
    order.save()

    return Response({'detail': 'Order marked as delivered'})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = Product.objects.get(_id=pk)
    data = request.data

    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.brand = data.get('brand', product.brand)
    product.countInStock = data.get('countInStock', product.countInStock)
    product.description = data.get('description', product.description)

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAdminStats(request):
    users = User.objects.count()
    products = Product.objects.count()
    orders = Order.objects.count()

    totalSales = Order.objects.filter(isPaid=True).aggregate(
        total=Sum('totalPrice')
    )['total'] or 0

    return Response({
        'users': users,
        'products': products,
        'orders': orders,
        'totalSales': totalSales,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # Prevent duplicate review
    if product.reviews.filter(user=user).exists():
        return Response(
            {'detail': 'Product already reviewed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Order-based review check
    ordered_items = OrderItem.objects.filter(
        order__user=user,
        product=product,
        order__isDelivered=True

    )

    if not ordered_items.exists():
        return Response(
            {'detail': 'Only verified buyers can review this product'},
            status=status.HTTP_403_FORBIDDEN
        )

    rating = data.get('rating')
    if rating == '' or rating is None:
        return Response(
            {'detail': 'Please select a rating'},
            status=status.HTTP_400_BAD_REQUEST
        )

    Review.objects.create(
        user=user,
        product=product,
        name=user.first_name if user.first_name else user.username,
        rating=int(rating),
        comment=data.get('comment', '')
    )

    reviews = product.reviews.filter(isApproved=True)
    product.numReviews = reviews.count()
    product.rating = (
        sum([r.rating for r in reviews]) / reviews.count()
        if reviews.count() > 0 else 0
    )
    product.save()

    return Response({'detail': 'Review submitted for approval'})




@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateReview(request, pk):
    review = Review.objects.get(_id=pk)

    if review.user != request.user:
        return Response({'detail': 'Not authorized'}, status=403)

    review.rating = request.data['rating']
    review.comment = request.data['comment']
    review.save()

    return Response({'detail': 'Review updated'})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteReview(request, pk):
    review = Review.objects.get(_id=pk)

    if review.user != request.user:
        return Response({'detail': 'Not authorized'}, status=403)

    review.delete()
    return Response({'detail': 'Review deleted'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def markHelpful(request, pk):
    review = Review.objects.get(_id=pk)
    review.helpfulVotes += 1
    review.save()
    return Response({'detail': 'Marked helpful'})


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reportReview(request, pk):
    review = Review.objects.get(_id=pk)
    review.isReported = True
    review.save()
    return Response({'detail': 'Reported'})

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def toggleReviewApproval(request, pk):
    review = Review.objects.get(_id=pk)
    review.isApproved = not review.isApproved
    review.save()
    return Response({'detail': 'Review status updated'})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mockPayment(request):
    user = request.user
    data = request.data

    order_id = data.get('orderId')
    success = data.get('success')  # true or false

    try:
        order = Order.objects.get(_id=order_id, user=user)
    except Order.DoesNotExist:
        return Response(
            {'detail': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if success:
        order.isPaid = True
        order.paidAt = timezone.now()
        order.paymentMethod = 'Mock Payment'
        order.paymentResult = {
            'id': str(uuid.uuid4()),
            'status': 'SUCCESS'
        }
        order.save()

        return Response(
            {'detail': 'Payment successful'},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'detail': 'Payment failed'},
            status=status.HTTP_400_BAD_REQUEST
        )



razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createRazorpayOrder(request):
    data = request.data

    print("KEY ID:", settings.RAZORPAY_KEY_ID)
    print("KEY SECRET:", settings.RAZORPAY_KEY_SECRET)

    amount = float(data.get('amount'))

    razorpay_order = razorpay_client.order.create({
    "amount": int(amount * 100),  # convert to paise
    "currency": "INR",
    "payment_capture": 1
})


    return Response({
        "order_id": razorpay_order["id"],
        "amount": razorpay_order["amount"],
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID
    })

    