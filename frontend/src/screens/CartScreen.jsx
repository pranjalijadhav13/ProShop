import React from "react";
import { Link , useNavigate} from "react-router-dom";
import {Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem} from 'react-bootstrap'
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
const CartScreen = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*We have our items in our in local storage and we have it in the Redux state.

So in order to get those cart items, we're going to use our use selector. */
  const cart = useSelector((state) => state.cart);
  const {cartItems} = cart;

  const addToCartHandler = async(product, qty) => {
    dispatch(addToCart({...product, qty}))
  }

  const removeFromCartHandler = async(id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  }
  return (
    <>
        <Row>
            <Col md={8}>
                <h1 style={{marginBottom:"20px"}}>Shopping Cart</h1>
                {cartItems.length===0 ? (
                    <Message>
                        Your cart is empty <Link to='/'>Go Back</Link> 
                    </Message>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map((item) => (
                            <ListGroupItem key = {item._id}>
                                <Row>
                                    <Col md={2}>
                                        <Image src = {item.image} alt={item.name} fluid rounded></Image>
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={2}>
                                            <Form.Control
                                                as='select'
                                                value={item.qty}
                                                /*So what I want to happen is when I select a quantity from here on te Cart screen itself, 
                                                I want it to actually call add to cart and then change the quantity to whatever I choose.*/
                                                onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                            >
                                                {[...Array(item.countInStock).keys()].map(
                                                (x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                    </option>
                                                )
                                                )}
                                            </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        
                                        <Button type="button" variant='light' 
                                            /*Now it's important you don't just put removeFromCartHandler right in here.

                                            It needs to be a function that then calls that.

                                            Otherwise it's going to be called right away and it's just going to delete all your items. */
                                            onClick={()=>removeFromCartHandler(item._id)}
                                        >
                                            <FaTrash/>
                                        </Button>
                                    </Col>
                                </Row>

                            </ListGroupItem>
                        ) )}

                    </ListGroup>

                )}
            </Col>
            <Col>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h2>
                                Subtotal ({cartItems.reduce((acc, item)=> acc+item.qty,0)}) items
                            </h2>
                            ${cartItems.reduce((acc, item) => acc + item.price*item.qty,0).toFixed(2)}
                        </ListGroupItem>

                        <ListGroupItem>
                            <Button type="button" className="btn-block" disabled={cartItems.length===0}
                            
                            onClick={checkoutHandler}>Proceed to Checkout</Button>

                        </ListGroupItem>

                    </ListGroup>
                </Card>
            
            </Col>

        </Row>
    
    
    
    </>
  )
}

export default CartScreen
