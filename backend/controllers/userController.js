import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
//import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
//@desc Auth user and get token
//@route GET /api/users/login
const authUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const user=await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id)

        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        });
    }else{
        res.status(401)
        throw new Error('Invalid email or password');
    }
});

//@desc register user
//@route POST /api/users
const registerUser = asyncHandler(async(req, res) =>{
    /*So first thing we're going to do is get from the request body. We need the name, email and password.

That's what's going to be sent. */
    const {email, name, password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const user=await User.create({
        name,
        email,
        password
    })

    if(user){

        generateToken(res, user._id)

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }else{
        res.status(400);
        throw new Error('Invalid user password');
    }
    /*Now we have to obviously we have to hash the password because right now the way we have it, it's going

    to take the plain text password from the body and it's going to add that to the database.

    So there's a few ways we could handle it.

    We could do it here, but again, I like to keep the controller methods or controller functions as slim

    as possible.

    So we're going to do the encryption in the userModel */

    //coming back from userModel.js
    /*And what we want to do once that user is registered is we want to authenticate, basically, we want

    to create our Json web token and we want to create our Http only cookie just like we did for auth user */

    /*Instead of just putting the same code because I would do the same exact thing

    Let's create a separate file for this or a separate function for this. */
});


//@desc logout user and clear the cookie
//@route POST /api/users/logout 
//@access PRIVATE
const logoutUser = asyncHandler(async(req, res) =>{
    /*And what log out means in this case is getting rid of the JWT cookie. */

    /*To clear this, we just want to set it to an empty string and we want to set it to

    expire.

    Now the cookie name is what we're going to put in here first, which is JWT, right?

    And then we're going to set the value to nothing.

    And then we'll pass in an object with some options.

    So we'll set Http only to True.

    We're going to set expires.So expires is now going to be set to, we'll say, new date and just pass in zero.

    So we want this to expire.

    So this is how we can just clear the cookie */
    res.cookie('jwt', '', {
        httpOnly:'true',
        expires:new Date(0)
    })

    res.status(200).json({message:'Logged out successfully'})
});

//@desc get the user profile
//@route GET /api/users/profile
//@access PRIVATE
const getUserProfile = asyncHandler(async(req, res) =>{

    const user=await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }
    else{
        res.status(404);
        throw new Error('User not found');
    }
});

//@desc update the user profile
//@route PUT /api/users/profile
//@access PRIVATE
const updateUserProfile = asyncHandler(async(req, res) =>{
    const user=await User.findById(req.user._id);

    if(user){
        /*Okay, so we're going to get the user, then we're going to check.

        For the user. And I only want to update fields that.

        That, you know, if we send it in the body.

        So I want to be able to send just the name and have just the name update.

        I don't want to have to send every field.

        So what we can do here is we'll say the user dot name.

        So the user we got from the database that matches the request, basically the one we're logged in as

        we're going to set that equal to the request dot body name.

        Or if that's not there, we're just going to keep whatever is already in the database and then we'll

        do the same with the email.

        I want to just check to see if there's anything in the body for the password.

        So we're going to say if request body dot password, then we'll set user dot password.

        And the reason I'm doing it, doing it like this and not just putting password up here is because the

        password is hashed right.

        The password that's in the database is hashed, so we only want to mess with it if it's being updated. */
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password=req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin
        })
    }else{
        res.status(404);
        throw new Error('User not found')
    }

});

//@desc get users
//@route GET /api/users
//@access PRIVATE/Admin
const getUsers = asyncHandler(async(req, res) =>{
    const users=await User.find({})
    res.status(200).json(users)
});

//@desc get user by Id
//@route GET /api/users/:id
//@access PRIVATE/Admin
const getUserById = asyncHandler(async(req, res) =>{
    const user=await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user)
    }else{
        res.status(404);
        throw new Error('User not found')
    }
});

//@desc delete users
//@route DELETE /api/users/:id
//@access PRIVATE/Admin
const deleteUser = asyncHandler(async(req, res) =>{
    const user=await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400)
            throw new Error('Cannot delete admin user')
        }

        await User.deleteOne({_id:user._id})
        res.status(200).json({message:'User deleted successfully'})
    }else{
        res.status(404);
        throw new Error('User not found')
    }
});

//@desc update users
//@route PUT /api/users/:id
//@access PRIVATE/Admin
const updateUser = asyncHandler(async(req, res) =>{
    const user=await User.findById(req.params.id);

    if(user){
        user.name= req.body.name || user.name;
        user.email= req.body.email || user.email;
        user.isAdmin=Boolean(req.body.isAdmin) ;

        const updatedUser=await user.save();
        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin : updatedUser.isAdmin
        })
    }else{
        res.status(404);
        throw new Error('User not found')
    }
});

export {authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers, deleteUser, updateUser, getUserById}