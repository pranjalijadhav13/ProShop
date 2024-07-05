/*So basically from the login screen we want to do or we want to we're going to do a few things.

But the two main things we want to do is, first, call this login and this mutation, right?

Because that will actually send the request to the back end and set the cookie.

Now, once we get the user data back, we then want to call from the auth slice set credentials. 
Okay, send that in the payload and then the user gets put in local storage, not the token. */

/*we're also going to use a package called React to Testify that

will show a message if like we get the wrong email address or something like that. */

/*And to use that, there's a couple steps we have to take.

We're going to go into our main app component, so our app JS */

import React from 'react'
/*useEffect is needed because what I want to do is when you come to the page, it should check

to see if there's any user info in local storage.

And if there is, that means you're logged in.

So we'll then want to redirect from this page. */
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
/*In order to interact with the state, we want

to bring in use dispatch and use selector from React Redux. */
/*Use dispatch is used to dispatch actions such as the login in that slice and the set credentials and

use selector is to get stuff from the state such as the user. */
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify';

import { Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'

const RegisterScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [register, {isLoading}] = useRegisterMutation();

    /*And then we also want the user info, which is part of our state. */
    /*So you selector takes in a function pass in the state and we want the auth part of our state because

    that's where our user info is. */
    const {userInfo } = useSelector((state)=>state.auth)

    /*Now, we also want to make it so that - remember how we're on the shipping screen, if we go to our

    cart here and then proceed to checkout, you see how we have this login and then we have this redirect.

    (http://localhost:3000/login?redirect=/shipping)

    So we want to check to see if that redirect is there.

    Because if it is, we then want to redirect to the page which is written after redirect= if we are logged in.

    So to do that we use the search property from the use location hook which we brought in up here. */

    const {search} = useLocation();
    const sp=new URLSearchParams(search);
    /*And we want to see if there's this redirect ((http://localhost:3000/login?redirect=/shipping)) */
    const redirect = sp.get('redirect') || '/'
 
    /*Now let's use the use effect.

    Because this is what we're going to use to to check to see if we're logged in.

    Because if we are logged in, then we want to get redirected to either the home page or if there's something

    in that redirect. */


    /*So basically, if there's user info in local storage, then we're going to navigate to whatever that
    redirect is. And then as far as dependencies, we need to pass in user info because we're using it in the useeffect
    as well as redirect, as well as navigate. */
    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    }, [userInfo,redirect, navigate]);

    const submitHandler= async(e)=>{
        e.preventDefault()

        if(password!==confirmpassword){
            toast.error('Passwords do not match');
            return;
        }
        else{
            try{
                /* log in again.
    
                Is coming from our users API slice.
    
                We're getting it right here from the mutation that's in that file.
    
                So log in and then that's going to get passed in an object with the email and password, which is in
    
                our component state coming from the form. */
    
                /*Now, this does return a promise.
    
                So we're going to add on to this dot unwrap which will basically extract or unwrap that the resolved
    
                value from the promise. */
                const res=await register({name, email,password}).unwrap()
    
                /*Now, once we get the response, we then want to dispatch the set credentials function which is in auth
    
                slice. */
                dispatch(setCredentials({...res}));
                navigate(redirect)
            }catch(error){
                toast.error(error?.data?.message || error.error)
            }
        }
    }

  return (
    <FormContainer>
        <h1>Sign Up</h1>

        <Form onSubmit={submitHandler}>
            <FormGroup controlId='name' className='my-3'>
                <FormLabel>Name</FormLabel>
                <FormControl
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                
                ></FormControl>
            </FormGroup>
            <FormGroup controlId='email' className='my-3'>
                <FormLabel>Email address</FormLabel>
                <FormControl
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                
                ></FormControl>
            </FormGroup>
            <FormGroup controlId='password' className='my-3'>
                <FormLabel>Password</FormLabel>
                <FormControl
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                
                ></FormControl>
            </FormGroup>
            <FormGroup controlId='confirmPassword' className='my-3'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmpassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                
                ></FormControl>
            </FormGroup>

            <Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>Register</Button>

            {isLoading && <Loader/>}
        </Form>
        <br></br>
        <Row className='py-3'>
            <Col>
                Already have an account? {'  '}<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen

/*So we're going to go to our index.js in our front end and we're going to bring in the login screen. */