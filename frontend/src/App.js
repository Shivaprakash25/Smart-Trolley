import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import OrdinaryShopping from "./pages/OrdinaryShopping";
import SmartShopping from "./pages/SmartShopping";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";   // ✅ Import Login
import Signup from "./pages/Signup"; // ✅ Import Signup
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen">
      {/* ===== Navbar ===== */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl text-indigo-600">
            SmartTrolley
          </Link>
          <div className="flex gap-4">
            <Link to="/ordinary" className="text-gray-700 hover:text-indigo-600">
              Ordinary Shopping
            </Link>
            <Link to="/smart" className="text-gray-700 hover:text-indigo-600">
              Smart Shopping
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
              Cart
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-indigo-600">
              Signup
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== Main Pages ===== */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ordinary" element={<OrdinaryShopping />} />
          <Route path="/smart" element={<SmartShopping />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />     {/* ✅ Login route */}
          <Route path="/signup" element={<Signup />} />   {/* ✅ Signup route */}
        </Routes>
      </main>
    </div>
  );
}
