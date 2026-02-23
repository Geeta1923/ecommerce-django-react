from django.db import models

# Create your models here.
from django.contrib.auth.models import User # Import User model for user-related fields

#create models
class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Link to User model# cascde means if deteteur then delete all products related to that user
    name = models.CharField(max_length=200, null=True, blank=True)# False means mandatory fill
    image = models.ImageField(null=True, blank=True, default='/placeholder.png')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)# take autometic time when created
    _id=models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name or 'Unnamed Product'
    
class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    name = models.CharField(max_length=200, blank=True)
    rating = models.IntegerField(default=0)
    comment = models.TextField(null=True, blank=True)


    isApproved = models.BooleanField(default=False)
    helpfulVotes = models.IntegerField(default=0)
    isReported = models.BooleanField(default=False)

    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return f"{self.rating} - {self.product.name}"
  
      
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id=models.AutoField(primary_key=True, editable=False)
    isCancelled = models.BooleanField(default=False)
    cancelledAt = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return str(self._id)
    
    # Order has many order items and shipping address (one to one) relationship with order model 
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    _id=models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)    
    
# Shipping address has one to one relationship with order model 
class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True) # cascade means if order deleted then delete shipping address also 
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    _id=models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.address)    
    