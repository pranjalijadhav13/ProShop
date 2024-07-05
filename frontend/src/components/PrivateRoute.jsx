/* we're going to create our private route component so that we can't come to shipping page

if we're not logged in.

Because right now you'll see if I log out and then I go to I'll manually go to /shipping.

I'm allowed to come here and I shouldn't be. */

/*So outlet is basically what we want to return if we're logged in, if there's a user because it just 
will put out whatever page or screen we're trying to load.

If we're not logged in, then we're going to use the navigate component to basically just redirect us.

Now the other thing I want to bring in is use selector, because that's how we can get the state to

find out if there's user, if there's a user info piece of the state. */
import { Outlet,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from 'react'

const PrivateRoute = () => {

  const {userInfo} = useSelector((state)=> state.auth)
  return (
        userInfo ? <Outlet /> : <Navigate to='/login' replace></Navigate>
  )
}

export default PrivateRoute
