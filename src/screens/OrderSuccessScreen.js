import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircleFill } from 'react-bootstrap-icons'

function OrderSuccessScreen() {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <Card className="p-4 text-center">
      <CheckCircleFill size={60} color="green" className="mb-3" />

      <h2>Thank you for your order!</h2>

      <p className="mt-3">
        Your order has been placed successfully.
      </p>

      <p>
        <strong>Order ID:</strong> {id}
      </p>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="primary" onClick={() => navigate(`/order/${id}`)}>
          View Order
        </Button>

        <Button variant="secondary" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </div>
    </Card>
  )
}

export default OrderSuccessScreen
