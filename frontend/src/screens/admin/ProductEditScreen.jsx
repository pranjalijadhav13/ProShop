import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice'

const ProductEditScreen = () => {

  const {id:productId} = useParams();

  const [name, setName] =useState('');
  const [price, setPrice] =useState(0);
  const [brand, setBrand] =useState('');
  const [description, setDescription] =useState('');
  const [category, setCategory] =useState('');
  const [image, setImage] =useState('');
  const [countInStock, setCountInStock] =useState(0);

  const {data:product, isLoading, error} = useGetProductDetailsQuery(productId);

  const [updateProduct, {isLoading:loadingUpdate}] = useUpdateProductMutation();

  const [uploadProductImage, {isLoading:loadingUpload}] = useUploadProductImageMutation(); 

  const navigate=useNavigate();

  useEffect(()=>{
    if(product){
        setName(product.name);
        setPrice(product.price);
        setBrand(product.brand);
        setDescription(product.description);
        setCategory(product.category);
        setImage(product.image);
        setCountInStock(product.countInStock)
    }
  }, [product])

  const submitHandler = async(e) =>{
    e.preventDefault();
    /*So we're creating this object here, setting the ID to the product ID from the URL.

    And the reason we're doing that is because we're using the update product from the slice, 
    from the mutation. And it gets passed in the data.

    And in the mutation we are passing the ID into the URL. */
    const updatedProduct ={
        productId,
        name,
        price,
        brand,
        category,
        description,
        image,
        countInStock
    };

    const res=await updateProduct(updatedProduct);
    if(res.error){
        toast.error(res.error)
    }else{
        toast.success('Product updated')
        navigate('/admin/productlist')
    }
  }

  const uploadFileHandler = async(e) =>{
    /* this takes in an event object e.

    And on that event object we have target dot files, which is an array.

    But since we're only uploading a single file, we're just going to choose the first item in that array. */
    const formData= new FormData();
    formData.append('image', e.target.files[0]);

    try{
        const res=await uploadProductImage(formData).unwrap();
        toast.success(res.message)
        setImage(res.image)
    }catch(error){
        toast.error(error?.data?.message || error.message)
    }
  }

  return (
    <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate  && <Loader/>}

            {isLoading ? (<Loader/>) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <FormGroup controlId='name' className='my-2'>
                        <FormLabel>Name</FormLabel>
                        <FormControl
                            type='text'
                            value={name}
                            placeholder='Enter name'
                            onChange={(e)=>setName(e.target.value)}
                        ></FormControl>
                    </FormGroup>
                    <FormGroup controlId='price' className='my-2'>
                        <FormLabel>Price</FormLabel>
                        <FormControl
                            type='number'
                            value={price}
                            placeholder='Enter price'
                            onChange={(e)=>setPrice(e.target.value)}
                        ></FormControl>
                    </FormGroup>
                    <FormGroup controlId='image' className='my-2'>
                        <FormLabel>Image</FormLabel>
                        <FormControl 
                            type='text'
                            placeholder='Enter image url'
                            value={image}
                            onChange={(e)=>setImage(e.target.value)}
                        ></FormControl>
                        <FormControl
                            type='file'
                            label='Choose file'
                            onChange={uploadFileHandler}
                        ></FormControl>
                    </FormGroup>
                    {loadingUpload && <Loader/>}
                    <FormGroup controlId='brand' className='my-2'>
                        <FormLabel>Brand</FormLabel>
                        <FormControl
                            type='text'
                            value={brand}
                            placeholder='Enter brand'
                            onChange={(e)=>setBrand(e.target.value)}
                        ></FormControl>
                    </FormGroup>
                    <FormGroup controlId='countInStock' className='my-2'>
                        <FormLabel>Count In Stock</FormLabel>
                        <FormControl
                            type='number'
                            value={countInStock}
                            placeholder='Enter count in stock'
                            onChange={(e)=>setCountInStock(e.target.value)}
                        ></FormControl>
                    </FormGroup>
                    <FormGroup controlId='category' className='my-2'>
                        <FormLabel>Category</FormLabel>
                        <FormControl
                            type='text'
                            value={category}
                            placeholder='Enter category'
                            onChange={(e)=>setCategory(e.target.value)}
                        ></FormControl>
                    </FormGroup>
                    <FormGroup controlId='description' className='my-2'>
                        <FormLabel>Description</FormLabel>
                        <FormControl
                            type='text'
                            value={description}
                            placeholder='Enter description'
                            onChange={(e)=>setDescription(e.target.value)}
                        ></FormControl>
                    </FormGroup>

                    <Button className='my-2' type='submit' variant='primary'>Update</Button>
                </Form>

            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen
