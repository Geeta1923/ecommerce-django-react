import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Messege from '../components/Messege'
import Loaded from '../components/Loaded'
import { getUserDetails, updateUserProfile } from '../actions/usersActions'
import { listMyOrders } from '../actions/orderActions'

function ProfileScreen({ history }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [messege, setMessage] = useState(null)

  const dispatch = useDispatch()

  // User login state
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // User details state
  const userDetails = useSelector((state) => state.userDetails || {})
  const { loading, error, user } = userDetails

  // User orders state
  const orderListMy = useSelector((state) => state.orderListMy || { orders: [] })
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile || {})
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success,
  } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'))
      } else {
        setName(user.name)
        setEmail(user.email)
      }
      dispatch(listMyOrders())
    }
  }, [dispatch, history, userInfo, user])

 const submitHandler = (e) => {
  e.preventDefault()

  if (password !== confirmPassword) {
    setMessage('Passwords do not match')
  } else {
    // Safely get a user id from user or userInfo
    const userId =
      (user && (user._id || user.id)) ||
      (userInfo && (userInfo._id || userInfo.id))

    if (!userId) {
      setMessage('User not loaded yet, please try again.')
      return
    }

    dispatch(updateUserProfile({ id: userId, name, email, password , confirmPassword}))
  }
}


  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {messege && <Messege variant='danger'>{messege}</Messege>}
        {error && <Messege variant='danger'>{error}</Messege>}
        {loading && <Loaded />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email' className='my-2'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password' className='my-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword' className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-2' onClick={submitHandler}  
            disabled={loading || loadingUpdate}   // 👈 avoid double submit during loading
          >
            {loadingUpdate ? 'Updating...' : 'Update'}
           
          </Button>
        </Form>
      </Col>
      
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loaded />
        ) : errorOrders ? (
          <Messege variant='danger'>{errorOrders}</Messege>
        ) : orders.length === 0 ? (
          <Messege>No orders found</Messege>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                  <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
