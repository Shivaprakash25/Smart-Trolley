import React, { useEffect, useState } from "react";
import {
  fetchCart,
  increaseCart,
  decreaseCart,
  removeFromCart,
} from "../services/api";
import { QRCodeCanvas } from "qrcode.react";
import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showQR, setShowQR] = useState(false);

  const load = async () => {
    try {
      const res = await fetchCart();
      setCart(res.data || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const inc = async (b) => {
    await increaseCart(b);
    load();
  };
  const dec = async (b) => {
    await decreaseCart(b);
    load();
  };
  const rem = async (b) => {
    await removeFromCart(b);
    load();
  };

  const total = cart.reduce(
    (s, it) => s + it.price * (it.quantity || 1),
    0
  );

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>
      <div className="cart-list">
        {cart.length === 0 && (
          <div className="empty-cart">Cart is empty</div>
        )}
        {cart.map((item) => (
          <div key={item.barcode} className="cart-item">
            <div className="item-info">
              <img
                src={item.imageUrl}
                className="item-img"
                alt={item.name}
              />
              <div>
                <div className="item-name">{item.name}</div>
                <div className="item-price">₹{item.price}</div>
              </div>
            </div>

            <div className="item-actions">
              <button onClick={() => dec(item.barcode)}>-</button>
              <div>{item.quantity || 1}</div>
              <button onClick={() => inc(item.barcode)}>+</button>
              <button onClick={() => rem(item.barcode)} className="remove-btn">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">Total: ₹{total}</div>
        <button
          onClick={() => setShowQR(true)}
          className="buy-btn"
        >
          Buy Now
        </button>
      </div>

      {showQR && (
        <div className="qr-section">
          <h3>Scan to Pay</h3>
          <QRCodeCanvas
            value={`pay://smarttrolley?amount=${total}`}
            size={220}
          />
          <p className="qr-note">
            This QR encodes a payment link. Replace with real UPI link
            when integrating.
          </p>
        </div>
      )}
    </div>
  );
}
