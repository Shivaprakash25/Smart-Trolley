import React, { useEffect, useRef, useState } from "react";
import { detectImage, addToCartByBarcode } from "../services/api";
import "./SmartShopping.css";

export default function SmartShopping() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current) return;

    try {
      const res = await detectImage(); // call backend to detect barcode
      if (res && res.data && res.data.barcode) {
        setBarcode(res.data.barcode);
        await addToCartByBarcode(res.data.barcode);
        setMessage(`Item with barcode ${res.data.barcode} added to cart!`);
      } else {
        setMessage("No barcode detected, try again!");
      }
    } catch (err) {
      console.error("Error scanning barcode:", err);
      setMessage("Error scanning barcode.");
    }
  };

  return (
    <div className="smartshopping-container">
      <h2 className="smartshopping-title">📷 Smart Shopping</h2>
      <video ref={videoRef} autoPlay className="smartshopping-video"></video>
      <button onClick={handleScan} className="smartshopping-btn">
        Scan Barcode
      </button>
      {barcode && <p className="smartshopping-barcode">Scanned: {barcode}</p>}
      {message && <p className="smartshopping-msg">{message}</p>}
    </div>
  );
}
