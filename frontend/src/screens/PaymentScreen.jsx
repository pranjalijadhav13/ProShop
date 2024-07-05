import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Form, Button, Col, FormGroup, FormLabel, FormCheck} from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import { useSelector, useDispatch } from 'react-redux'
import { savePaymentMethod } from '../slices/cartSlice'
const PaymentScreen = () => {

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  /*If the user comes to this page and there's no shipping address in the state in local storage, then

I want them to be redirected to shipping. */
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const cart=useSelector((state)=>state.cart);
  const {shippingAddress} = cart;

  useEffect(()=>{
    if(!shippingAddress){
        navigate('/shipping')
    }

  }, [shippingAddress, navigate])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder')
  }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <FormGroup>
                <FormLabel as='legend'>Select Method</FormLabel>
                <Col>
                    <FormCheck
                        type='radio'
                        className='my-2'
                        label='PayPal or Credit Card'
                        id='PayPal'
                        name='paymentMethod'
                        value='Paypal'
                        checked
                        onChange={(e)=>setPaymentMethod(e.target.value)}
                    >

                    </FormCheck>
                </Col>
            </FormGroup>

            <Button type='submit' variant='primary'>Continue</Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen
