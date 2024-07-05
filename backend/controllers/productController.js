import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
//@desc Fetch all products
//@route GET /api/products
const getProducts = asyncHandler(async(req, res) =>{
    const pageSize=8;
    /*So to get a value, a query query parameter from the URL, we use request dot query, and then whatever

    we call it in this case page number, and then we're just casting it to a number.

    Now if that's not there, then it's obviously it'll be page one. */
    const page = Number(req.query.pageNumber) || 1
    /*We'll go right under page here and let's say const.

    Keyword.

    And we're going to set that equal to request dot query, dot keyword.

    And if that's there, then we're going to have an object.

    So basically we're going to just use a regular expression here to match, to match that keyword and

    it can match it anywhere in the title or the name of the product.

    And the reason we're using a regular expression and not just matching it directly is because let's say

    it says iPhone ten, but we just send in a keyword of phone.

    We want that to match. */
    /*And we want it to be case insensitive.

    So after regex here, we'll put a comma and let's put in options.

    And set that to a string of lowercase I that will make it a case insensitive. */
    const keyword = req.query.keyword ? {name : {$regex: req.query.keyword, $options:'i'}} : {}

    /*And we want it to be case insensitive.

    So after regex here, we'll put a comma and let's put in options.

    And set that to a string of lowercase I that will make it a case insensitive. */
    const count= await Product.countDocuments({...keyword});

    const products= await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1))

    /*And then we also want to specify Skip, because if we're on like the second page, then obviously we

want to skip the products that are on the first page.

If we're on the third page, we want to skip the products that are on the first and second page. */



    /*we pass empty array {} because we want all products */
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch a particular product by Id
//@route GET /api/products/:id
const getProductById = asyncHandler(async(req, res) =>{
    const product= await Product.findById(req.params.id)

    if(product){
        return res.json(product);
    }
    else{
        res.status(404);
        throw new Error('Product not found')
    }
});

//@desc Create new product
//@route POST /api/products
//@access Private/Admin
const createProduct = asyncHandler(async(req, res) =>{
    const product = new Product({
        name:'Sample name',
        price:0,
        user:req.user._id,
        image:'/images/sample.jpg',
        brand:'Sample Brand',
        category:'Sample Category',
        countInStock:0,
        numReviews:0,
        description:'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct)
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } =
      req.body;
  
    const product = await Product.findById(req.params.id);
  
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
  
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  });

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  

  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({_id:product._id})
    res.status(200).json({message:'Produt Deleted'})
    
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

//@desc Create a new review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  
  const {rating, comment} = req.body;
  const product = await Product.findById(req.params.id);

  /*Then we're going to check for the product and if there is one, we want to check to see if it's already

reviewed because we don't want the same person to be able to review the product twice. */
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    
    if(alreadyReviewed){
      res.status(400);
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review)

    /*And we want to also set the Num reviews to whatever the length of the reviews because remember, products

    have a num reviews field and then to get the rating, we're going to factor in the new rating by using

    reduce and adding them all together.

    So all the ratings together and then dividing it by the length of reviews.

    So that will give us the overall rating. */
    product.numReviews=product.reviews.length;

    product.rating =product.reviews.reduce((acc, review)=> acc+ review.rating,0)/product.reviews.length

    await product.save();
    res.status(200).json({message:'Review added'})
    
  }else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

//@desc Get top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});


export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts}