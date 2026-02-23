import React from 'react'
import { Nav } from 'react-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="checkout-steps mb-4">
      <Nav.Item className={step1 ? 'active' : 'disabled'}>
        <Nav.Link>Sign In</Nav.Link>
      </Nav.Item>
      <Nav.Item className={step2 ? 'active' : 'disabled'}>
        <Nav.Link>Shipping</Nav.Link>
      </Nav.Item>
      <Nav.Item className={step3 ? 'disabled' : 'disabled'}>
        <Nav.Link>Payment</Nav.Link>
      </Nav.Item>
      <Nav.Item className={step4 ? 'disabled' : 'disabled'}>
        <Nav.Link>Place Order</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
