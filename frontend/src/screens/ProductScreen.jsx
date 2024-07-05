/*earlier code */
/*we will take our products array from products.js file, fetch the product ID and check if this product ID matches the product Id
from the url. If yes, take that product ans store it into a variable */ 
//import axios from 'axios';
//import products from '../products';

//const [product, setProduct] = useState({})
    /*when the product ID changes, we want to useEffect to run. So we will add product id as a dependency*/
    /*useEffect(() => {
        const fetchProduct = async () =>{
            const {data} =  await axios.get(`/api/products/${productId}`);
            setProduct(data);
        };

        fetchProduct()
    }, [productId]);*/


import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Image, ListGroup, Form, ListGroupItem, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify'
import Meta from '../components/Meta';
const ProductScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const [rating, setRating]=useState(0);
    const [comment, setComment] = useState('');


    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

    const [createReview, {isLoading:loadingReview}]=useCreateReviewMutation();

    const {userInfo} = useSelector((state)=>state.auth);



    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    };

    const submitHandler = async(e) =>{
        e.preventDefault();

        try{
            await createReview({
                productId,
                rating,
                comment
            }).unwrap();
    
            refetch();
            toast.success('Review submitted')
            setRating(0)
            setComment('')
        }catch(error){
            toast.error(error?.data?.message || error.message)
        }
        
    }

    return (
        <>
            <Link className='btn btn-light my-3' to="/">
                Go Back
            </Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error.data.message || error.error}</Message>
            ) : (
                <>
                    <Meta title={product.name}/>
                    <Row>
                        <Col md={5}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={4}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
                                <ListGroup.Item>{product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col><strong>{product.price}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col><strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {/* Qty Select */}
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                            <Form.Control
                                                as='select'
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                            >
                                                {[...Array(product.countInStock).keys()].map(
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
                                    <ListGroup.Item>
                                        <Button
                                            className='btn-block'
                                            type='button'
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >
                                            Add To Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row className='review'>
                        <Col md={6}>
                            <h2>Reviews</h2>
                            {product.reviews.length===0 && <Message>No Review</Message>}  
                            <ListGroup variant='flush'>
                                {product.reviews.map(review=> (
                                    <ListGroupItem key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating}/>
                                        <p>
                                            {review.createdAt.substring(0,10)}
                                        </p>
                                        <p>
                                            {review.comment}
                                        </p>
                                    </ListGroupItem>
                                ))}
                                <ListGroupItem>
                                    <h2>Write a customer review</h2>
                                    {loadingReview && <Loader/>}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <FormGroup controlId='rating' className='my-2'>
                                                <FormLabel>Rating</FormLabel>
                                                <FormControl
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e)=>setRating(Number(e.target.value))}
                                                >
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </FormControl>
                                            </FormGroup>
                                            <FormGroup controlId='comment' className='my-2'>
                                                <FormLabel>Comment</FormLabel>
                                                <FormControl
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e)=>setComment(e.target.value)}
                                                ></FormControl>

                                            </FormGroup>
                                            <Button
                                                type='submit'
                                                variant='primary'
                                                disabled={loadingReview}
                                            >Submit</Button>
                                            
                                        </Form>
                                    ) : (
                                        <Message>
                                        Please <Link to='/login'>sign in</Link> to write a review
                                        </Message>
                                    )}
                                </ListGroupItem>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ProductScreen;
