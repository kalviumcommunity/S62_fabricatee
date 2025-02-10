import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, X } from 'lucide-react';

function CartProductCard({
  id,
  name,
  fabric,
  total,
  imgurl,
  quantity,
  selectedItems,
  toggleItemSelection,
  removeItem,
  updateQuantity
}) {
  return (
    <Card className="mb-4 shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {selectedItems && (
            <div className="flex items-start">
              <Checkbox
                checked={selectedItems.has(id)}
                onCheckedChange={() => toggleItemSelection(id)}
              />
            </div>
          )}
          
          <img
            src={imgurl}
            alt={name}
            className="h-24 w-24 rounded-lg object-cover"
          />
          
          <div className="flex-grow">
            <div className="flex justify-between">
              <h3 className="font-medium">{name}</h3>
              {removeItem && (
                <button
                  onClick={() => removeItem(id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="text-sm text-gray-500 mt-1">
              Fabric: {fabric}
            </div>

            {!updateQuantity && (
              <span className="text-sm text-gray-500 mt-1">
                Qty: {quantity}
              </span>
            )}

            <div className="text-sm font-medium mt-1">
              ₹{total.toFixed(2)}
            </div>

            {updateQuantity && (
              <div className="flex items-center mt-2">
                <button
                  onClick={() => updateQuantity(id, -1)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-3">{quantity}</span>
                <button
                  onClick={() => updateQuantity(id, 1)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartProductCard;