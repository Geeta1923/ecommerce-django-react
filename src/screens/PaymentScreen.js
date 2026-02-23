import React, { useState } from 'react'
import { Form, Button, Card, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

function PaymentScreen() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery')

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch({
      type: 'CART_SAVE_PAYMENT_METHOD',
      payload: paymentMethod,
      
    })
    navigate('/placeorder')
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 />

      <Col md={8} className="mx-auto">
        <Card className="payment-card p-4">
          <h3 className="mb-3">Select a payment method</h3>

          <Form onSubmit={submitHandler}>
            <Form.Check
  type="radio"
  label="Cash on Delivery"
  id="CashOnDelivery"
  name="paymentMethod"
  value="CashOnDelivery"
  checked={paymentMethod === 'CashOnDelivery'}
  className="payment-option"
  onChange={(e) => setPaymentMethod(e.target.value)}
/>

<Form.Check
  type="radio"
  label="UPI / Card"
  id="UPI"
  name="paymentMethod"
  value="UPI"
  checked={paymentMethod === 'UPI'}
  className="payment-option"
  onChange={(e) => setPaymentMethod(e.target.value)}
/>



            <Button type="submit" className="amazon-btn w-100 mt-4">
              Continue
            </Button>
          </Form>
        </Card>
      </Col>
    </>
  )
}

export default PaymentScreen
