/*So now we're going to start to implement the shopping cart.

And since we're using Redux toolkit, we'll create a new slice for the cart and that will hold any state

that has to do with the shopping cart. */

/*reducers object will have any functions that have to do with the cart. So when we add to cart, remove, etcetera.

So for the initial state, our items are going to be stored in local storage so that when we leave the site, we come back, 
our items are still in the cart. So we want to check that local storage item first of all. */

/*And if there is something there, what we're going to do is then parse whatever is in there because it gets stored as a string.

Local storage can only hold strings, but it will be in the format of, you know, of an object.

So we're going to parse it as a JavaScript object else then we want initial state to just be an object that has cart items.

Which will be just an empty array. */

/*So let's go down to our cart slice and this reducers object.

And what we're going to do is add a new function called Add to Cart.

So we'll set that to an arrow function. So in add to Cart, since this is a reducer function, 
it's going to take in two things a state and an action.So the state is just whatever the current state is of the cart. 
And then an action will include any data inside of a payload. So basically in this case, we're going to be sending 
an item to add to the cart which we can access with action.payload */


import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils'; 
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress:{}, paymentMethod:'PayPal'};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      
      const {...item } = action.payload;

      /*This line checks if the item being added (item) already exists in the cart (state.cartItems). 
      It uses the find method to look for an item in the cart with the same _id as the item being added. */
      const existItem = state.cartItems.find((x) => x._id === item._id);

      /*Condition: If existItem is found (i.e., the item already exists in the cart).
        Action: Update the existing item in the cart:
        Use the map function to create a new array.
        For each item x in state.cartItems, check if x._id matches existItem._id.
        If it matches, replace x with the new item (this will effectively update the quantity and other properties of the existing item).
        If it doesn't match, keep the item x unchanged. */

        /*Condition: If existItem is not found (i.e., the item does not exist in the cart).
        Action: Add the new item to the cart:
        Create a new array that includes all existing items in state.cartItems and the new item. */
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }


      /*Example:
        Let's say your cart currently has the following items:

        state.cartItems = [
        { _id: 1, name: 'Product 1', qty: 1, price: 100 },
        { _id: 2, name: 'Product 2', qty: 2, price: 50 }
        ];
        Adding an Existing Item:
        If you add { _id: 1, name: 'Product 1', qty: 3, price: 100 }:

        The code will find that _id: 1 already exists.
        It will update the item with _id: 1 to have qty: 3.
        Result:

        state.cartItems = [
        { _id: 1, name: 'Product 1', qty: 3, price: 100 },
        { _id: 2, name: 'Product 2', qty: 2, price: 50 }
        ];
        Adding a New Item:
        If you add { _id: 3, name: 'Product 3', qty: 1, price: 30 }:

        The code will not find _id: 3 in the existing cart.
        It will add the new item to the cart.
        Result:
        state.cartItems = [
        { _id: 1, name: 'Product 1', qty: 3, price: 100 },
        { _id: 2, name: 'Product 2', qty: 2, price: 50 },
        { _id: 3, name: 'Product 3', qty: 1, price: 30 }
        ]; */

        return updateCart(state);
    },

    removeFromCart :(state,action) => {
        /*So basically we're returning all the cart items that don't equal the one we want to delete. */
        state.cartItems=state.cartItems.filter((x)=>x._id!==action.payload);

        /*So once we do that, we need to update local storage and we already have this update cart in the utils

        file which will update local storage. */

        return updateCart(state);
    },

    saveShippingAddress :(state, action)=>{
      state.shippingAddress=action.payload;
      return updateCart(state);
    },

    savePaymentMethod :(state, action)=>{
      state.paymentMethod=action.payload;
      return updateCart(state);
    },

    clearCartItems :(state, action)=>{
      state.cartItems=[];
      return updateCart(state);
    }

  },
});

/*Now, in order to use this add to cart, which we're going to be using from our component, we need

to export it as an action.

So even though we already exported the reducer to put that in the store JS file, any function we create

here we need to export as an action. */
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems
} = cartSlice.actions;

export default cartSlice.reducer;
