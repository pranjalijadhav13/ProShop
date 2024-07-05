import React from 'react'
import { useState } from 'react'
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'
const ShippingScreen = () => {

  const cart=useSelector((state)=>state.cart);
  const {shippingAddress} = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '')
  const [city, setCity] = useState(shippingAddress?.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
  const [country, setCountry]= useState(shippingAddress?.country || '')

  const dispatch=useDispatch();
  const navigate=useNavigate();

  

  const submitHandler = (e) =>{
    e.preventDefault();
    dispatch(saveShippingAddress({address, city, postalCode, country}))
    navigate('/payment')
  }

  /*For, checkout steps component, notice that since I'm on shipping, Payment and Place order linkes are grayed out, right?

Because I haven't got to those yet, so I can't link to them because in my shipping screen I only passed

in step one and two */
  return (
    <FormContainer>
        <CheckoutSteps step1 step2/>
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
            <FormGroup controlId='address' className='my-2'>
                <FormLabel>Address</FormLabel>
                <FormControl
                    type='text'
                    placeholder='Enter address'
                    value={address}
                    onChange={(e)=>setAddress(e.target.value)}
                ></FormControl>
            </FormGroup>
            <FormGroup controlId='city' className='my-2'>
                <FormLabel>City</FormLabel>
                <FormControl
                    type='text'
                    placeholder='Enter city'
                    value={city}
                    onChange={(e)=>setCity(e.target.value)}
                ></FormControl>
            </FormGroup>
            <FormGroup controlId='postalCode' className='my-2'>
                <FormLabel>Postal Code</FormLabel>
                <FormControl
                    type='text'
                    placeholder='Enter postal code'
                    value={postalCode}
                    onChange={(e)=>setPostalCode(e.target.value)}
                ></FormControl>
            </FormGroup>
            <FormGroup controlId='country' className='my-2'>
                <FormLabel>Country</FormLabel>
                <FormControl
                    type='text'
                    placeholder='Enter country'
                    value={country}
                    onChange={(e)=>setCountry(e.target.value)}
                ></FormControl>
            </FormGroup>

            <Button type='submit' variant='primary' className='my-2'>Continue</Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreen
