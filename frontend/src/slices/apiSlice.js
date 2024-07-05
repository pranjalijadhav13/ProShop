//before this. refer to Redux notes.txt file. So right now I just want to get that base API slice setup

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
// fetch fetch base query is the function that will allow us to make requests to our back end API

import { BASE_URL } from '../constants.js'

const baseQuery=fetchBaseQuery({baseUrl:BASE_URL})
//And tag types are used to define the types of data that will be fetching from our API.
export const apiSlice=createApi({
    baseQuery,
    tagTypes:['Product', 'Order', 'User'],
    endpoints : (builder) => ({})
})

/*we could put endpoints directly in here if we want, but we can also inject them from a separate file, */
/*which is what we're going to do because we have different types of endpoints.We have products orders, users.
So there's actually a method called inject endpoint. */