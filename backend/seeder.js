import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
    try{
        await Order.deleteMany();
        await User.deleteMany();
        await Product.deleteMany();

        const createdUsers = await User.insertMany(users);
        //only admin can add a new product. So, amongst all users that we added into the database using insertMany and users.js file. 
        //fetch the first one(as first one is admin user)
        const adminUser=createdUsers[0]._id;

        //for each product, we will return the entire product data plus the user ID
        const sampleProducts = products.map((product) =>{
            return {...product, user:adminUser}
        })

        await Product.insertMany(sampleProducts)
        console.log('Data imported!'.green.inverse)
        process.exit()
    }catch(error){
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try{
        await Order.deleteMany();
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Data destroyed!'.green.inverse)
        process.exit()
    }catch(error){
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

//question is how to run the file. At one time, I only want to call one function - either the importData or destroyData
//process.argv - if we run our seeder file in terminal like this - node backend/seeder -d
//what we will see is an array where first two values are paths and third value(at index 2) is the paramater we passed(-d)
//if we run the file as node backend/seeder -hello - the value in array at index 2 will be hello

if(process.argv[2]==='-d'){
    destroyData();
}
else{
    importData();
}