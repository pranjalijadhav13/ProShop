import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

//@desc Create a new order
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async(req, res) =>{
    
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if(orderItems && orderItems.length===0){
        res.status(400);
        throw new Error('No order items')
    }
    else{
        /*But order items, we don't want to just put that directly in because if we look at our model, our order

        model, we have in order items, this stuff(name, price, qty, image) is going to come through right through the front end.

        But this isn't - the product, which is just the ID of the item for each item.

        So we have to add this onto order item. */

        /*We want to map through this our order items.

        And let's say for each order, we'll call it X and we want to return an object from this.

        So we're going to use parentheses and then our curly braces and we're going to spread across whatever

        that is in that order, which will be this stuff right here, these four fields.

        We need to add this product.

        So let's say product.

        And all that's going to be is the object ID, which we can get from X dot underscore ID.

        And then we're going to set the ID field, underscore ID to undefined because we don't need that in

        here. */

        const order=new Order({
            orderItems:orderItems.map((x)=>({
                ...x,
                product:x._id,
                _id:undefined
            })),
            user:req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice

        })

        const createdOrder= await order.save();

        res.status(201).json(createdOrder)
    }
});

//@desc Get logged in usere's order
//@route GET /api/orders/myOrders
//@access Private
const getMyOrders = asyncHandler(async(req, res) =>{
    
    const orders=await Order.find({user:req.user._id});
    res.status(200).json(orders)
});

//@desc Get order by Id
//@route GET /api/orders/:id
//@access Private
const getOrderById = asyncHandler(async(req, res) =>{
    /*So we'll say const order and we want to await on order find by ID pass in the id which is in the URL.

    So this here we can get with that.

    And then I also want to add the user, the user name and email to the order and that's not stored in

    the order collection.

    So what we can do is we can say dot populate and we're going to say we want to populate from the user

    collection and we want to populate the name and email fields. */
    const order=await Order.findById(req.params.id).populate('user','name email')

    if(order){
        res.status(201).json(order);
    }
    else{
        res.status(404);
        throw new Error('Order not found')
    }
});

//@desc Update order to paid
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async(req, res) =>{
    
    const order=await Order.findById(req.params.id);

    if(order){
        order.isPaid =true,
        order.paidAt = Date.now()
        order.paymentResult = {
            id:req.body.id,
            status:req.body.status,
            updateTime:req.body.updateTime,
            email_address: req.body.payer.email_address
        }

        const updatedOrder= await order.save();

        res.status(201).json(updatedOrder)
    }
    else{
        res.status(404);
        throw new Error('Order not found')
    }
});

//@desc Update order to delivered
//@route PUT /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) =>{
    const order=await Order.findById(req.params.id);

    if(order){
        order.isDelivered =true,
        order.deliveredAt = Date.now()
        const updatedOrder= await order.save();

        res.status(201).json(updatedOrder)
    }
    else{
        res.status(404);
        throw new Error('Order not found')
    }
    
});

//@desc Get all orders
//@route GET /api/orders
//@access Private/Admin
const getOrders = asyncHandler(async(req, res) =>{
    
    const orders =await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
    getOrders

};