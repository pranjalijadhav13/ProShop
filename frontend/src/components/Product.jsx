import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
/*each product to be wrapped in a Card*/
//my-3 is marginal Y-axis. if we want Card Title as a div element we can use the 'as' property
const Product = ({product}) => {
  return (
    <Card className='my-3 py-3 rounded'>
        <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant="top"></Card.Img>
        </Link>
        <Card.Body>
        <Link to={`/product/${product._id}`}>
            <Card.Title as="div" className='product-title'>
                <strong>{product.name}</strong>
            </Card.Title>
        </Link>
        <Card.Text as="div">
            <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
        </Card.Text>
        <Card.Text as= "h3">
            ${product.price}
        </Card.Text>
        </Card.Body>
        
    </Card>
  )
}

export default Product
