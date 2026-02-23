import React, { useEffect, useState } from "react";
import { fetchProducts, addToCartByBarcode } from "../services/api";
import "./OrdinaryShopping.css";

export default function OrdinaryShopping() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCartByBarcode(product.barcode);
      alert(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="ordinary-container">
      <h2 className="ordinary-title">🛍️ Ordinary Shopping</h2>
      <div className="ordinary-grid">
        {products.map((product) => (
          <div key={product.barcode} className="ordinary-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="ordinary-price">₹{product.price}</p>
            <button onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
