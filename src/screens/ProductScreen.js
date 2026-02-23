import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Ratings'
import { listProductDetails } from '../actions/productActions'
import Loaded from '../components/Loaded'
import Messege from '../components/Messege'
import axios from 'axios'



function ProductScreen() {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin


  useEffect(() => {
    dispatch(listProductDetails(id))
  }, [dispatch, id])

  const addToCartHandler = () => {
    if (Number(qty) > Number(product.countInStock)) {
      alert('Not enough stock available')
      return
    }
    navigate(`/cart/${id}?qty=${qty}`)
  }

  const submitReviewHandler = async (e) => {
  e.preventDefault()

  try {
    await axios.post(
      `/api/products/${product._id}/reviews/`,
      { rating, comment },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    )
    alert('Review submitted for approval')
    window.location.reload()
  } catch (error) {
    alert(
      error.response && error.response.data.detail
        ? error.response.data.detail
        : 'Error submitting review'
    )
  }
}


const markHelpful = async (id) => {
  await axios.put(
    `/api/reviews/${id}/helpful/`,
    {},
    { headers: { Authorization: `Bearer ${userInfo.token}` } }
  )
  window.location.reload()
}

const reportReview = async (id) => {
  await axios.put(
    `/api/reviews/${id}/report/`,
    {},
    { headers: { Authorization: `Bearer ${userInfo.token}` } }
  )
  alert('Review reported')
}



const deleteReview = async (id) => {
  if (window.confirm('Delete review?')) {
    await axios.delete(
      `/api/reviews/${id}/delete/`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    )
    window.location.reload()
  }
}




  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      {loading ? (
        <Loaded />
      ) : error ? (
        <Messege variant="danger">{error}</Messege>
      ) : (
        <Row>
          {/* PRODUCT IMAGE */}
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>

          {/* PRODUCT DETAILS */}
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
  <Rating
    value={product.rating}
    text={`${product.numReviews} reviews`}
    color="#f8e825"
  />
</ListGroup.Item>

<ListGroup variant="flush">
  {product.reviews &&
    product.reviews.map(
      (review) =>
        review.isApproved && (
          <ListGroup.Item key={review._id}>
            <strong>{review.name}</strong>
            <Rating value={review.rating} />
            <p>
              {review.createdAt &&
                review.createdAt.substring(0, 10)}
            </p>
            <p>{review.comment}</p>

            <Button
              size="sm"
              onClick={() => markHelpful(review._id)}
            >
              👍 Helpful ({review.helpfulVotes})
            </Button>

            <Button
              variant="link"
              size="sm"
              onClick={() => reportReview(review._id)}
            >
              Report abuse
            </Button>

            {userInfo && userInfo._id === review.user && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteReview(review._id)}
              >
                Delete
              </Button>
            )}
          </ListGroup.Item>
        )
    )}
</ListGroup>

<Form onSubmit={submitReviewHandler}>
  <Form.Control
    as="select"
    value={rating}
    onChange={(e) => setRating(e.target.value)}
  >
    <option value="">Rating</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
  </Form.Control>

  <Form.Control
    as="textarea"
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />

  <Button type="submit">Submit</Button>
</Form>

              <ListGroup.Item>
                Price: ₹{product.price}
              </ListGroup.Item>

              <ListGroup.Item>
                Description: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* BUY CARD */}
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>₹{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {Number(product.countInStock) > 0
                        ? 'In Stock'
                        : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* QTY SELECTOR */}
                {Number(product.countInStock) > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col xs="auto">
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) =>
                            setQty(Number(e.target.value))
                          }
                        >
                          {[...Array(Number(product.countInStock)).keys()].map(
                            (x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            )
                          )}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                {/* ADD TO CART */}
                <ListGroup.Item>
                  <Button
                    className="w-100"
                    type="button"
                    disabled={Number(product.countInStock) <= 0}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ProductScreen
