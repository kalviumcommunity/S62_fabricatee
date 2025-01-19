import React from 'react';
import { Pencil, Trash2, ShoppingCart, Star } from 'lucide-react';

function ProductCard({
  title,
  sp,
  mrp,
  url,
  rating,
  reviews,
  design,
  fabric,
  discount,
  onAddToCart,
  btnTxt,
  onUpdate,
  onDelete,
  priceType, // 'per_meter' or 'stitching'
  productType // 'design', 'fabric', or 'combined'
}) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating) ? 'fill-yellow-300 text-yellow-300' : 'text-gray-300'}`}
      />
    ));
  };

  const discountPercentage = mrp && sp ? Math.round(((mrp - sp) / mrp) * 100) : 0;

  const getPriceLabel = () => {
    if (priceType === 'fabric') return '/meter';
    if (priceType === 'design') return ' for stitching';
    return '';
  };

  return (
    <div className="relative m-5 shadow-sm flex w-full max-w-xs flex-col overflow-hidden justify-between rounded-lg border border-gray-100 bg-white">
      <div className="relative">
        {url && (
          <div className="relative mx-3 mt-3 flex h-auto overflow-hidden rounded-xl">
            <img className="object-cover w-full" src={url} alt={`${design || ''} ${fabric || ''}`} />
            {discount && discountPercentage > 0 && (
              <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        )}
        
        {(onUpdate || onDelete) && (
          <div className="absolute top-5 right-5 flex gap-2">
            {onUpdate && (
              <button
                onClick={onUpdate}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                title="Update product"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                title="Delete product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 px-5 pb-5">
        {title && <h5 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h5>}

        {/* Product Type Badge */}
        {productType && (
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              {productType.charAt(0).toUpperCase() + productType.slice(1)}
            </span>
          </div>
        )}

        {(design || fabric) && (
          <div className="mt-2 space-y-1">
            {design && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600">Design:</span>
                <span className="ml-2 text-sm font-medium">{design}</span>
              </div>
            )}
            {fabric && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600">Fabric:</span>
                <span className="ml-2 text-sm font-medium">{fabric}</span>
              </div>
            )}
          </div>
        )}

        {rating !== undefined && (
          <div className="mt-3 flex items-center">
            {renderStars(rating)}
            {reviews !== undefined && (
              <span className="ml-2 text-sm text-gray-600">
                ({reviews} reviews)
              </span>
            )}
          </div>
        )}

        {(sp || mrp) && (
          <div className="mt-4 flex items-center justify-between">
            <div>
              {mrp > sp && (
                <span className="ml-2 text-sm text-slate-900 line-through">Rs. {mrp}</span>
              )}{' '}
              {sp !== undefined && (
                <span className="text-xl font-semibold text-slate-900">
                  Rs. {sp}
                  <span className="text-sm font-normal text-gray-600">{getPriceLabel()}</span>
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onAddToCart}
          className="mt-4 flex w-full items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {btnTxt || "Add to cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;