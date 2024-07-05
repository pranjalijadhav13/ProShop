import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from  '../components/Product'
import Loader from '../components/Loader.jsx'
import Message from '../components/Message.jsx'
import Paginate from '../components/Paginate.jsx'
import { Link } from 'react-router-dom'
/*we will have a row, we will take our products/data, map through them, loop through each product and output a product component inside of a column*/
/*Col is responsive. on small screens, it will take up all 12 columns, on medium screen it will 2 columns(each column will have 6 items)
large screens will take up 4(3 items each) and extra large will have 3 columns*/
//We need to pass a key to Col which will be product ID here


//not needed anymore as we don't want to use axios to fetch data from backend.
//instead we want to use Redux and apiSlice to fetch all products
//import { useEffect, useState } from 'react'
//import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productsApiSlice.js'
import ProductCarousel from '../components/ProductCarousel.jsx'
const HomeScreen = () => {

//not needed anymore as we don't want to use axios to fetch data from backend.
//instead we want to use Redux and apiSlice to fetch all products
  //const [products, setProducts] = useState([]);

  /*[] which is passed to useEffect() is like a dependency of arrays. when we put some value in that array and when it changes, useEffect runs */
  /*useEffect(()=>{
    const fetchProducts = async () =>{
      const {data} = await axios.get('/api/products');
      setProducts(data);
    }

    fetchProducts()
  }, []);*/
  const {pageNumber, keyword} = useParams();
  const {data, isLoading, error } = useGetProductsQuery({keyword,pageNumber});

  return (
    <>
    {!keyword ? (<ProductCarousel/>) : (<Link to='/' className='btn btn-light mb-4'>Go Back</Link>)}
    {
      
      isLoading ? 
      (
        <Loader/>
      ) : error ? (<Message variant='danger'>{error.data.message || error.error}</Message>) : 
      (<>
      <h1>Latest Products</h1>
      <Row>
          {
              data.products.map((product)=>(
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product}/>
                  </Col>
              ))

          }   

      </Row>
      <Paginate pages={data.pages} page={data.page} keyword = {keyword ? keyword : ''} />
      </>
      )
    }
    
    </>
  );
}

export default HomeScreen

