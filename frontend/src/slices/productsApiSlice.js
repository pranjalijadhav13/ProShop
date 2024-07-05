import { PRODUCTS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice = apiSlice.injectEndpoints({endpoints : (builder) => ({
    getProducts:builder.query({
        query: ({keyword, pageNumber})=>({
            url:PRODUCTS_URL,
            params:{
                keyword,
                pageNumber
            }
        }),
        /*So this right here, get products I'm going to add.

        Provide tags and set that to products as it gets rid pf cached products.

        Otherwise we may have to refresh the page. */
        providesTags:['Products'],
        keepUnusedDataFor:5
    }),

    getProductDetails:builder.query({
        query: (productId)=>({
            url:`${PRODUCTS_URL}/${productId}`
        }),
        keepUnusedDataFor:5
    }),

    createProduct:builder.mutation({
        query: ()=>({
            url:PRODUCTS_URL,
            method:'POST'
        }),
       /*And I'm also going to add invalidate tags and set that to product.

        Because what this will do is it will stop it from being cached so that we have fresh data.

        Okay.

        So that we don't have to like re re if we don't put this, we'll have to reload the page after we click

        create new product. */
        invalidatesTags : ['Products'],
    }),

    updateProduct:builder.mutation({
        query: (data)=>({
            url:`${PRODUCTS_URL}/${data.productId}`,
            method:'PUT',
            body:data
        }),
       /*And I'm also going to add invalidate tags and set that to product.

        Because what this will do is it will stop it from being cached so that we have fresh data.*/
        invalidatesTags : ['Products'],
    }),

    uploadProductImage: builder.mutation({
        query: (data) => ({
          url: `/api/upload`,
          method: 'POST',
          body: data,
        }),
    }),

    deleteProduct:builder.mutation({
        query: (productId)=>({
            url:`${PRODUCTS_URL}/${productId}`,
            method:'DELETE'
        }),
    }),

    createReview:builder.mutation({
        query: (data)=>({
            url:`${PRODUCTS_URL}/${data.productId}/reviews`,
            method:'POST',
            body:data
        }),
        invalidatesTags:['Products']
    }),

    getTopProducts:builder.query({
        query: ()=>({
            url:`${PRODUCTS_URL}/top`
        }),
        keepUnusedDataFor:5
    }),
})})

export const {useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation,
    useUploadProductImageMutation, useDeleteProductMutation, useCreateReviewMutation, useGetTopProductsQuery 
} = productsApiSlice