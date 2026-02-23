import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card, Button, Alert } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getOrderDetails, cancelOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_CANCEL_RESET } from '../constants/orderConstants'

function OrderScreen() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { loading, error, order } = orderDetails

  const orderCancel = useSelector((state) => state.orderCancel || {})
  const { success: successCancel } = orderCancel

  const orderDeliver = useSelector((state) => state.orderDeliver || {})
  const { success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch(getOrderDetails(id))

    if (successCancel) {
      dispatch({ type: ORDER_CANCEL_RESET })
    }
  }, [dispatch, id, successCancel, successDeliver])

  if (loading) return <h3>Loading...</h3>
  if (error) return <h3>{error}</h3>
  if (!order) return null

  const itemsPrice = order.orderItems
    ? order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    : '0.00'

  return (
    <>
      <h2>Order {order._id}</h2>

      <Row>
        {/* LEFT SIDE */}
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>{order.paymentMethod}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Delivery Status</h4>
              {order.isDelivered ? (
                <Alert variant="success">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Alert>
              ) : (
                <Alert variant="warning">Not Delivered</Alert>
              )}
            </ListGroup.Item>

            {/* ADMIN: MARK AS DELIVERED */}
            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  className="btn btn-success w-100"
                  onClick={() => dispatch(deliverOrder(order._id))}
                >
                  Mark as Delivered
                </Button>
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <h4>Order Items</h4>

              {order.orderItems.map((item, index) => (
                <Row key={index} className="align-items-center mb-2">
                  <Col md={2}>
                    <Image
                      src={
                        item.image.startsWith('/images/')
                          ? item.image
                          : `/images/${item.image}`
                      }
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>

                  <Col md={6}>{item.name}</Col>

                  <Col md={4}>
                    {item.qty} × ₹{item.price} = $
                    {(item.qty * item.price).toFixed(2)}
                  </Col>
                </Row>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>

              <ListGroup.Item>Items: ₹{itemsPrice}</ListGroup.Item>
              <ListGroup.Item>Shipping: ₹{order.shippingPrice}</ListGroup.Item>
              <ListGroup.Item>Tax: ₹{order.taxPrice}</ListGroup.Item>

              <ListGroup.Item>
                <strong>Total: ₹{order.totalPrice}</strong>
              </ListGroup.Item>
            </ListGroup>

            {/* CANCEL ORDER (USER) */}
            {!order.isDelivered && !order.isCancelled && (
              <Button
                variant="danger"
                className="w-100 mt-3"
                onClick={() => dispatch(cancelOrder(order._id))}
              >
                Cancel Order
              </Button>
            )}

            {order.isCancelled && (
              <p className="text-danger text-center mt-2">
                Order Cancelled
              </p>
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
