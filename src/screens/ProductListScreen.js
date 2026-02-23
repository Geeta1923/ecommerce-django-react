import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { listProductsAdmin } from '../actions/productActions'



function ProductListScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProductsAdmin())
    } else {
      navigate('/login')
    }
  }, [dispatch, userInfo, navigate])

  return (
  <>
    <h1>Products</h1>

    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>PRICE</th>
          <th>STOCK</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>₹{product.price}</td>
            <td>{product.countInStock}</td>
            <td>
              <Button
                variant="light"
                size="sm"
                onClick={() =>
                  navigate(`/admin/product/${product._id}/edit`)
                }
              >
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
)
}
export default ProductListScreen