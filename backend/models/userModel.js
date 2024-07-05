import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
        required:true
    },
},{
    timestamps:true,
});


// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

//pre allows us to do something before it's saved in the database. 
//And there's different actions that you can do before or whatever. And there's different actions that you can do before 
//In this case we want to do before save. So we pass in.Save.
userSchema.pre('save', async function(next){

    /*Okay, So what this is doing here, if this is not modified password, then we're just going to call

    the next piece of middleware because that's what this is, is middleware for Mongoose.

    So if we're just saving some user data, but we're not dealing with the password, then it's just going

    to move on.

    It's just going to next. */
    if(!this.isModified('password')){
        next();
    }

    /*So outside of that, though, if we are modifying the password, then we're first going to generate

    a salt, and then we're going to set this.password, this pertaining

    to the current user that we're saving.

    And instead of setting it to just the plain text, we're going to set it to a hashed password using

    the hash method from the Bcrypt package, which takes in the password and then the salt, and then it

    will create a hash and it'll get saved to the database. */
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt)

})

const User = mongoose.model("User", userSchema)

export default User;