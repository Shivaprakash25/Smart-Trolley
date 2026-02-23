import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-3">Smart Shopping</h1>
        <p className="text-gray-600 mb-4">Use your camera to scan barcodes and add items instantly.</p>
        <Link to="/smart" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow">Start Smart Shopping</Link>
      </div>

      <div className="p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-3">Ordinary Shopping</h1>
        <p className="text-gray-600 mb-4">Browse all products, search and add to cart.</p>
        <Link to="/ordinary" className="inline-block border border-indigo-500 text-indigo-600 px-6 py-2 rounded-lg">Go to Store</Link>
      </div>
    </div>
  );
}
