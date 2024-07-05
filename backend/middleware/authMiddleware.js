//And in here we're going to import JWT because we need to verify the token.
import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

/*In this file we're going to have protect, which is going to allow us to protect routes for users that

are registered.

And then we'll also have an admin middleware function for users that are admins. */

//Protect routes
/*And you just need to make sure that at the end of your middleware function you call next because that

will just say, okay, we're done here, move on to the next middleware. */
const protect = asyncHandler(async(req, res,next)=>{
    let token;

    //Read jwt from cookie
    token=req.cookies.jwt;

    if(token){
        /*And in the try, we're going to decode the token to get the user ID because remember when we created

        the token, we passed in the user ID as the payload.

        So we want to extract that from it.

        So let's say const decoded.

        And the way we decode it is with JWT dot verify and verify takes in the token and then also takes in

        the secret which we have in our dot env file. */
        try{
            
            const decoded=jwt.verify(token, process.env.JWT_SECRET);

            //Now we want to get the user from the database that matches that that user ID.
            /*Now, I don't want the password because this will return all the fields.

            I don't want the password.

            Even though it's hashed, there's no reason to get that.

            So we can actually add on to that dot select and then just pass in minus password. */
            //add that user to the request object.
            req.user= await User.findById(decoded.userId).select('-password')

            /*And then this, this user object will be on the request object in all of our routes.

            So for instance, if we're looking in or if we're working in the profile route, we'll be able to take

            get the user from this request object and do what we want with it and it will be the user that's logged

            in. */

            next();
        }catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not authorized. Token failed');
        }

    }else{
        res.status(401);
        throw new Error('Not authorized. No token');
    }
})


//admin middleware
const admin = asyncHandler(async(req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
        res.status(401);
        throw new Error('Not authorized as admin');
    }
})

export {admin, protect};