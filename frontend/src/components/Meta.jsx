import React from 'react'
import { Helmet } from 'react-helmet-async'
const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}></meta>
        <meta name='keywords' content={keywords}></meta>
    </Helmet>
  )
}

Meta.defaultProps={
    title:"Welcome to Pro Shop",
    description:"We sell the best products at resonable prices",
    keywords: "electronics, cheap electronics, buy electronics"
}
export default Meta
