/*we can have all the logic in routes but it's good practice to use controller for each route and use that controller */
import express from 'express'
//import products from '../data/products.js'
/*we don't need below two files anymore as we have used controller */
//import asyncHandler from '../middleware/asyncHandler.js';
//import Product from '../models/productModel.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import {protect, admin} from '../middleware/authMiddleware.js'
const router=express.Router();
//mongoose models are asynchronous. So we need to use async await syntax. and we need to wrap it in an asyncHandler(which we created in asyncHanlder.js file)
/*router.get("/", asyncHandler(async(req, res)=>{
    const products= await Product.find({})
    //we pass empty array {} because we want all products 
    res.json(products);
}));

router.get('/:id', asyncHandler(async(req, res)=>{
    //const product=products.find((p)=>p._id===req.params.id); //we don't need tis anymore because now we aren't getting
    //products from the products.js file but from our database
    const product= await Product.findById(req.params.id)

    if(product){
        return res.json(product);
    }
    else{
        res.status(404);
        throw new Error('Product not found')
    }
    
}));*/

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.get('/top', getTopProducts);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createProductReview)

export default router;