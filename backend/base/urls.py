from django.urls import path
from . import views
from .views import MyTokenObtainPairView




urlpatterns = [
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='register'),  # new endpoint for user registration
    path('users/profile/', views.getUserProfile, name='user-profile'),  # new endpoint for user profile
    path('users/', views.getUsers, name='users'),  # new endpoint for all users
    
    path('products/', views.getProducts, name='products'),
    path('products/<str:pk>/', views.getProduct, name='product'),
    path('orders/myorders/', views.getUserOrders, name='user-orders'),
    path('users/profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/<str:pk>/', views.getOrderById, name='order'),
    path('orders/myorders/', views.getUserOrders, name='my-orders'),
    path('orders/<str:pk>/cancel/', views.cancelOrder, name='cancel-order'),
    path('orders/<int:pk>/deliver/', views.updateOrderToDelivered),
    path('orders/', views.getOrders),
    path('products/update/<int:pk>/', views.updateProduct),
    path('admin/stats/', views.getAdminStats),
    path('products/<str:pk>/reviews/', views.createProductReview),

path('reviews/<str:pk>/update/', views.updateReview),
path('reviews/<str:pk>/delete/', views.deleteReview),
path('reviews/<str:pk>/helpful/', views.markHelpful),
path('reviews/<str:pk>/report/', views.reportReview),

path('admin/reviews/<str:pk>/', views.toggleReviewApproval),
path('payment/mock/', views.mockPayment),
path('payment/razorpay/create/', views.createRazorpayOrder),







    
        
    
]
