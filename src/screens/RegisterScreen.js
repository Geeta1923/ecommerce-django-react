import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Messege from '../components/Messege'
import Loaded from '../components/Loaded'
import FormContainer from '../components/FormContainer'
import { register} from '../actions/usersActions'

function RegisterScreen(){
    const [name, setName]= useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword]= useState('')
    const [messege, setMessege]=useState('')
    
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const redirect = location.search ? location.search.split('=')[1] : '/'
    
    const userRegister = useSelector((state) => state.userRegister)
    const { loading, error, userInfo } = userRegister
    
      useEffect(() => {
        if (userInfo) {
          navigate(redirect)
        }
      }, [navigate, userInfo, redirect])
    
    
      const submitHandler = (e) => {
        e.preventDefault()
        if(password!= confirmPassword){
            setMessege(' Password do not match')
        }else{
        dispatch(register(name,email, password ))
        }
      }
      return (
        <FormContainer>
            <h1>Sign Up</h1>
            {messege && <Messege variant='danger'> {messege} </Messege>}
            {loading && <Loaded/>}
            <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='name'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    
                   <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                    
                            <Form.Group controlId='password' className='mt-3'>
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              ></Form.Control>
                            </Form.Group>



            
                    <Form.Group controlId='passwordConfirm' className='mt-3'>
                      <Form.Label> Confirm Password</Form.Label>
                      <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>


                     <Button type='submit' variant='primary' className='mt-4'>
                              Register
                            </Button>
                          </Form>

                      <Row className='py-3'>
                              <Col>
                                Have an Account?{' '}
                                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                                  Sign In
                                </Link>
                              </Col>
                            </Row>    
                    



        </FormContainer>

      )
}
export default RegisterScreen