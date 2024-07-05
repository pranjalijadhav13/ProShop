/*Now in this particular slice, we're not dealing with any, any endpoints, any API stuff that's going

to go in another slice called user's API slice.

This is simply to set the user credentials to local storage and remove them. */

import {createSlice} from '@reduxjs/toolkit'

const initialState={
    userInfo:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            /*And we're going to set the user info state to the payload.
            Because once we you know, we hit our back end through the user API slice, we get our user info, we're

            going to send it here as the payload in the action.

            So then we set the user info state to that payload and then we just want to store that in local

            storage as well. */
            state.userInfo=action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },

        logout:(state,action)=>{
            /*Along with destroying the cookie on server after logout(which we did in usersApiSlice.js), 
            we also want to remove it from local storage */
            /*And then what we're doing is setting the user info part of the state to null.

            So our redux state and then we're removing it from local storage. */
            state.userInfo=null;
            localStorage.removeItem('userInfo')
        }
    }
})

export const {setCredentials, logout}=authSlice.actions;
export default authSlice.reducer;

/*Now, we do have to add this to the store.

We don't add like products and users API to the store because that's basically a child of the API slice.

But this is not so let's go into store.js */