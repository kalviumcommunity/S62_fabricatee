import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

function WishlistComp({wishlist, handleDelete}) {

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Wishlist</h3>
      <div className="grid grid-cols-1 bg-white sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {wishlist?.map((item, index) => (
          <ProductCard
            key={index}
            title={item.design.name}
            sp={item?.price?.fabric+item?.price?.stitching}
            mrp={item?.fabric?.meterprice?.mrp+item?.design?.stitching?.mrp}
            url={item?.design?.images[0]?.url}
            fabric={item?.fabric?.name}
            btnTxt="Move to Cart"
            onDelete={()=>{handleDelete(item._id)}}
          />
        ))}
      </div>
    </div>
  )
}

export default WishlistComp
