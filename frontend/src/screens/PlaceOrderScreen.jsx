/*Now, the way this system works is we place the order first and then we go to payment.

And then after payment, the Is paid flag is updated to true.

And then if we want to set it to delivered, we can go in as an admin and set it to delivered.

So that's the kind of the workflow of this application.*/

import React from 'react'
/*So we're going to need use effect.

So we're going to bring that in because we need to check to see if there's no shipping address.

If there's no shipping address, we need to redirect the shipping.

If there's no payment method, we need to redirect to the payment and we're going to do that in the

use effect. */

import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Col, ListGroup, Card, Image, ListGroupItem } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'
const PlaceOrderScreen = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  const cart=useSelector((state)=>state.cart);
  const {shippingAddress, paymentMethod} = cart;

  const [createOrder, {isLoading, error}] = useCreateOrderMutation();

  useEffect(()=>{
    if(!shippingAddress.address){
      navigate('/shipping')
    }
    else if(!paymentMethod){
      navigate('/payment')
    }
  }, [navigate, shippingAddress.address, paymentMethod])

/*Okay, Now we want to handle the the place order handler button
Well, it's going to call this handler, but in this handler we want to call Create Order, which is

in our slice ordersApiSlice, create order, which will then make the post request, it'll send

the data and we should get an order created. */
  const placeOrderHandler = async() => {
    try{
      const res=await createOrder({
        orderItems: cart.cartItems,
        shippingAddress:shippingAddress,
        paymentMethod:paymentMethod,
        itemsPrice:cart.itemsPrice,
        shippingPrice:cart.shippingPrice,
        taxPrice:cart.taxPrice,
        totalPrice:cart.totalPrice
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`)
    }catch(error){
      toast.error(error)
    }
  }

  /*So keep in mind if it's, if it's from an API slice, one of these three slices we, we just call it

right, we get the function from the mutation and we call it but if it's a regular action from cart slice,

then we need to dispatch it. */
  
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4/>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>
                  Address:
                </strong>
                {shippingAddress.address} , {shippingAddress.city}, {' '}
                {shippingAddress.postalCode} ,{' '}
                {shippingAddress.country}
              </p>
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment Method</h2>
              <strong>Method:</strong>
              {paymentMethod}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Order items</h2>
              {cart.cartItems.length===0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index)=>(
                      <ListGroupItem key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded></Image>
                          </Col>
                          <Col >
                            <Link to={`/product/${item._id}`}>
                            {item.name}
                            </Link>
                          </Col>
                          
                          <Col md={4}>
                            { item.qty} x {item.price} = ${item.qty * item.price}
                          </Col>
                        </Row>

                      </ListGroupItem>
                    ))}
                </ListGroup>

              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroupItem>
                      <h2>Order Summary</h2>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Items:</Col>
                      <Col>${cart.itemsPrice}</Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Shipping:</Col>
                      <Col>${cart.shippingPrice}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Tax:</Col>
                      <Col>${cart.taxPrice}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    <Row>
                      <Col>Total:</Col>
                      <Col>${cart.totalPrice}</Col>
                    </Row>
                  </ListGroupItem>

                  <ListGroupItem>
                    {error && <Message variant='danger'>{error}</Message>}
                  </ListGroupItem>

                  <ListGroupItem>
                    <Button 
                    
                      type='button' 
                      className='btn-block' 
                      disabled={cart.cartItems.length===0}
                      onClick={placeOrderHandler}
                    >Place Order</Button>
                    {isLoading && <Loader></Loader>}
                  </ListGroupItem>
                </ListGroup>
              </Card>
        </Col>
      </Row>
    
    </>
  )
}

export default PlaceOrderScreen
