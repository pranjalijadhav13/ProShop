const asyncHandler = fn =>(req, res,next) =>{
    Promise.resolve(fn(req, res, next)).catch(next);


}

/* we just have a function that takes in req, res, next. It resolves a promise. and if it resolves, it's gonna call next which 
calls the next piece of middleware. we dont have to have try catch blocks*/
export default asyncHandler