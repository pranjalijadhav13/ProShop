import { Error } from "mongoose"
/*basically this will be called if no other middleware has handled the request and it will create a new error object 
and set the code to 404, which is a not found error.
And then we set the status to 404 and we call the next piece of middleware passing in that error variable. */
const notFound = (req,res,next) =>{
    const error=new Error(`Not found : ${req.originalUrl}`);
    res.status(404);
    next(error);
}

/*Now to overwrite the default express handler error handler, we're going to create a function called

error handler by passing err as the first argument */

const errorHandler =(err, req,res, next) =>{
    let statusCode=res.statusCode==200?500:res.statusCode
    let message=err.message

    //check for mongoose bad object ID or cast error
    /* If we get a single product and we pass in an ID that doesn't exist, it gives us this HTML page with a 500 status.*/
    if(err.name==='CastError' && err.kind==='ObjectId'){
        message='Resource not found';
        statusCode=404

    }

    res.status(statusCode).json({
        message,
        stack:process.env.NODE_ENV==='production'? 'None' : err.stack
    })
}

export {notFound, errorHandler}