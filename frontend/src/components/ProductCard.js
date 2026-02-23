import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card bg-white rounded-xl p-4 flex flex-col gap-3">
      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-lg font-bold">₹{product.price}</div>
          <div className="text-xs text-gray-400">Stock: {product.stock}</div>
        </div>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          onClick={() => onAdd(product.barcode)}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? "Add" : "Out"}
        </button>
      </div>
    </div>
  );
}
