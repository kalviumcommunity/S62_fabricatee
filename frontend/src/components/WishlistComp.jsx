import React from 'react'
import ProductCard from './ProductCard'

function WishlistComp({wishlist}) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6">Wishlist</h3>
      <div className="space-y-4 flex flex-wrap justify-center">
        {wishlist.map((item) => (
          <ProductCard
            key={item._id}
            title={item.title}
            sp={item.fabric.meterprice.sp}
            mrp={item.fabric.meterprice.mrp}
            url={item.images[0].url}
            rating={parseInt((item.fabric.rating+item.design.rating)/2)}
            reviews={(item.fabric.reviews+item.design.reviews)}
            design={item.design.name}
            fabric={item.fabric.name}
            btnTxt="Move to Cart"
          />
        ))}
      </div>
    </div>
  )
}

export default WishlistComp
