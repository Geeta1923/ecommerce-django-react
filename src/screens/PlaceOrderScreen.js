import React, { useEffect } from 'react'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import axios from 'axios'



const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PlaceOrderScreen() {
  const dispatch = useDispatch()          
  const navigate = useNavigate()     
      
  const cart = useSelector((state) => state.cart)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin



  const payNowHandler = async () => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  const { data } = await axios.post(
    "/api/payment/razorpay/create/",
    { amount: totalPrice },
    {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
  );

  const options = {
    key: data.key,
    amount: data.amount,
    currency: data.currency,
    name: "My Ecommerce App",
    description: "Order Payment",
    order_id: data.order_id,
    handler: function (response) {
      alert("Payment Successful!");
      console.log(response);

      // next we will verify and mark order paid
    },
    theme: {
      color: "#3399cc",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};


  // Prices
  const itemsPrice = Number(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  ).toFixed(2)

  const shippingPrice = Number(itemsPrice) > 100 ? 0 : 10
  const taxPrice = (0.18 * Number(itemsPrice)).toFixed(2)
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate || {})
  const { success, order } = orderCreate

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    )
  }

 useEffect(() => {
  if (success && order) {
    localStorage.removeItem('cartItems')
    navigate(`/order-success/${order.orderId}`)
  }
}, [success, order, navigate])





  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <Card className="mb-3 p-3">
            <h5>Shipping Address</h5>
            <p>
              {cart.shippingAddress.address},{' '}
              {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.postalCode},{' '}
              {cart.shippingAddress.country}
            </p>
          </Card>

          <Card className="mb-3 p-3">
            <h5>Payment Method</h5>
            <p>{cart.paymentMethod}</p>
          </Card>

          <Card className="mb-3 p-3">
            <h5>Order Items</h5>
            <ListGroup variant="flush">
              {cart.cartItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={6}>{item.name}</Col>
                    <Col md={4}>
                      {item.qty} × ₹{item.price} = ₹
                      {(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row> 
                  

                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="p-3">
            <h5>Order Summary</h5>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Items: <span className="float-end">₹{itemsPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Shipping:{' '}
                <span className="float-end">₹{shippingPrice.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Tax: <span className="float-end">₹{taxPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>
                  Total:{' '}
                  <span className="float-end">₹{totalPrice}</span>
                </strong>
                {cart.paymentMethod === "UPI" && (
                        <Button className="w-100 mt-3" onClick={payNowHandler}>
                          Pay Now
                         </Button>
                              )}
              </ListGroup.Item>
            </ListGroup>

            <Button
              className="amazon-btn w-100 mt-3"
              onClick={placeOrderHandler}
            >
              Place your order
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
