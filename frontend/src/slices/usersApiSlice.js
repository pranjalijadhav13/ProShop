import { USERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

/* we're not just fetching data here, we're also authenticating, we're making a post request.

So instead of a query, this is actually going to be a mutation. */
export const usersApiSlice = apiSlice.injectEndpoints({endpoints : (builder) => ({
    login:builder.mutation({
        query: (data)=>({
            url:`${USERS_URL}/auth`,
            method:'POST',
            body:data
        }),
    }),

    register:builder.mutation({
        query: (data)=>({
            url:`${USERS_URL}`,
            method:'POST',
            body:data
        }),
    }),

/*So there's two things that need to happen when we log out.

One is we need to have a log out endpoint in the users API slice to hit the user's URL slash log out

because that's how we destroy the cookie in the on the server in the back end.

Then we also want a log out in our auth slice that will take care of the local stuff.

So basically just removing it from local storage.  */
    logout:builder.mutation({
        query: ()=>({
            url:`${USERS_URL}/logout`,
            method:'POST',
        }),
    }),

    updateProfile:builder.mutation({
        query: (data)=>({
            url:`${USERS_URL}/profile`,
            method:'PUT',
            body : {...data}
        }),
    }),

    getUsers:builder.query({
        query: ()=>({
            url:USERS_URL,
            method:'GET',
        }),
        providesTags:['Users'],
        keepUnusedDataFor:5
    }),

    deleteUser:builder.mutation({
        query: (userId)=>({
            url:`${USERS_URL}/${userId}`,
            method:'DELETE'
        }),
    }),

    getUserDetails:builder.query({
        query: (userId)=>({
            url:`${USERS_URL}/${userId}`,
            method:'GET',
        }),
        keepUnusedDataFor:5
    }),

    updateUser:builder.mutation({
        query: (data)=>({
            url:`${USERS_URL}/${data.userId}`,
            method:'PUT',
            body:data
        }),
        invalidatesTags:['Users']
    }),

    

})})


export const {useLoginMutation, useRegisterMutation, useLogoutMutation, useUpdateProfileMutation, 
    useGetUsersQuery, useDeleteUserMutation, useGetUserDetailsQuery, useUpdateUserMutation} = usersApiSlice