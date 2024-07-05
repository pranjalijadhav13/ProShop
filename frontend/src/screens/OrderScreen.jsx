import React from 'react'
/*use params is going to be used to fetch to get this ID from the URL */
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, ListGroupItem, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery } from '../slices/ordersApiSlice'
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDeliverOrderMutation } from '../slices/ordersApiSlice'
const OrderScreen = () => {     
  const {id:orderId} = useParams(); 

  const {data:order, isLoading, error, refetch} = useGetOrderDetailsQuery(orderId)

  /*Now we're going to create a use effect because we need to basically load the PayPal script */
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, {isLoading : loadingDeliver}] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);


  /*So let's do the on approve first and what we're going to do, what this is going to take in.

So this is a handler for the PayPal buttons right here.

Okay.

So this will get called when basically when we click the PayPal buttons and everything goes as planned. */
  function onApprove(data, actions){
    /*So order capture, and then that returns a promise.

    So we add a dot, then.

    So actions, dot order, dot capture, and then a promise with the function, with the details passed

    in. And these details come from PayPal.

    So we're going to call our pay order inside here, which is returns a promise.

    So we want to make sure that this function is asynchronous. */
    return actions.order.capture().then(async function (details) {
        try{
            await payOrder({orderId, details});
            /*And then I'm just going to Refetch so we can basically, once it's marked as paid, I want it to refetch

            so that this will then say paid instead of not paid. */
            refetch();
            toast.success('Payment successful');
        }catch(error){
            toast.error(error?.data?.message || error.error)
        }
    })
        
  }

  function createOrder(data, actions){
        /*So this object has a bunch of methods on it that have to do with our order.

        So here we're creating it. */
        /*It gets passed in purchase units, which is an array that has a single object with the amount, and

        that amount object has a value and that's going to be whatever we're paying, which of course is going

        to be the orders total price.

        Now this returns a promise.

        So we actually want to go down here and add a dot then.

        And that's going to take in a function.

        And we're going to get the order ID here.

        And then we just want to simply return the order ID. */
        return actions.order
        .create({
            purchase_units: [
            {
                amount: { value: order.totalPrice },
            },
            ],
        })
        .then((orderID) => {
            return orderID;
        });
  }

  function onError(error){
    toast.error(error.message)
  }

  async function onApproveTest(){
        
    await payOrder({orderId, details:{payer:{}}});
    refetch();
    toast.success('Payment successful');
        
  }

  /*So we're awaiting on deliver order, which is from our slice, which communicates with our back end,

our mutation and pass in the order ID then we're going to just re fetch because we want that read to

change to green and then a success.

And if there's an error, then we'll show the message. */
  const deliverOrderHandler = async() => {
    try{
        await deliverOrder(orderId);
        refetch();
        toast.success('Order Delivered')
    }catch(error){
        toast.error(error?.data?.message || error.message)
    }
    
  }

  return (
    isLoading ? (<Loader/>) : error ? (<Message variant='danger'></Message>) : 
    (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroupItem>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address:</strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, 
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered at {order.deliveredAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:</strong>{order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid at {order.paidAt}</Message>
                            ) : (
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroupItem>
                        <ListGroupItem>
                            <h2>Order Items</h2>
                            {order.orderItems.map((item, index)=> (
                                <ListGroupItem key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded></Image>
                                        </Col>
                                        <Col>
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>
                                        </Col>
                                        <Col md={4}>
                                            { item.qty} x {item.price} = ${item.qty * item.price}
                                        </Col>
                                    </Row>

                                </ListGroupItem>

                            ))}
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
                                <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                <Col>Shipping:</Col>
                                <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroupItem>

                            <ListGroupItem>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroupItem>

                            <ListGroupItem>
                                <Row>
                                <Col>Total:</Col>
                                <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroupItem>
                            
                            <ListGroupItem>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroupItem>
                            {!order.isPaid && (
                            <ListGroupItem>
                                {loadingPay && <Loader/>}

                                {/*And all this test button is going to do is set the is page to true so we don't have to go through PayPal. */
                                isPending ? <Loader/> : (
                                    <div>
                                        <Button onClick={onApproveTest} style={{marginBottom:'10px'}}>Test pay order
                                        </Button>
                                        <div>
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            ></PayPalButtons>
                                        </div>
                                    </div>
                                )}
                            </ListGroupItem>
                        )}
                        {loadingDeliver && <Loader/>}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroupItem>
                                <Button type='button' className='btn btn-block' onClick={deliverOrderHandler}>
                                    Mark as Delivered
                                </Button>
                            </ListGroupItem>
                        )} 
                        </ListGroup>
                    </Card>
                </Col>

            </Row>
        </>
    )
  )
}

export default OrderScreen
