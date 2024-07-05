//I want to create an admin root component that will only allow admins to see these pages.

/*So outlet is basically what we want to return if we're logged in as admin, if there's a user because it just 
will put out whatever page or screen we're trying to load.

If we're not logged in as admin, then we're going to use the navigate component to basically just redirect us.

Now the other thing I want to bring in is use selector, because that's how we can get the state to

find out if there's user, if there's a user info piece of the state. */
import { Outlet,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from 'react'

const AdminRoute = () => {

  const {userInfo} = useSelector((state)=> state.auth)
  return (
        userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to='/login' replace></Navigate>
  )
}

export default AdminRoute
