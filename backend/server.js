//ES6 syntax
import express from 'express';
/* since we are using ES modules in backend, we need to use .js while importing our own javascript modules*/
//regular syntax
//const express=require('express');
import path from 'path'
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const port=process.env.PORT || 5000;
connectDB();
const app=express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded());

//Now we need a way to take that cookie and use it and we need to get the user ID from it.
//cookie parser middleware

/*What that will do is allow us to access request dot cookies and since our cookie is called JWT, we'll

be able to access request dot cookies, dot JWT.

Now where we want to do this is in middleware.

So in the middleware folder let's create an auth middleware dot JS file. */
app.use(cookieParser());



const __dirname = path.resolve(); //set __dirname to Current directory
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
/*And the reason for this is because we can't put our client ID in the front end.

You don't want it on the client side because you don't want people getting that.

So we're storing it in our Env file and then we're creating a route so PayPal can then get that client

ID and then use it. */
app.get('/api/config/paypal', (req, res) =>
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

/*Now the upload folder that we created, we want to we want to make that static, right?

We want to be able to just access that. */

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

/*So we're going to set the React build folder, which is in our front end slash build.

Because if you're, if you're building a React app and you do NPM run build, it creates a build folder

with all your static assets.

So we're setting that to be a static folder.

And then we're saying any route that is not for our API is going to be

redirected to index.html.

So app dot get star and then we're just using send file.

So basically we're just saying load the index.html that's in the front end build folder which we just

made static. */
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res)=> 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
}else{
    /*Else so if we're not in production then we'll go ahead and just do this, which is just saying API is

running because if we're not in production then we're using the React dev server. */
    app.get("/", (req, res)=>{
        res.send("API is running...");
    });
}
app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=>console.log(`Server running on port ${port}`))