import axios from "axios";

const API_BASE = "http://localhost:5000"; // change to your backend

export const fetchProducts = () => axios.get(`${API_BASE}/products`);
export const detectImage = (formData) => axios.post(`${API_BASE}/detect`, formData, { headers: {'Content-Type': 'multipart/form-data'}});
export const addToCartByBarcode = (barcode) => axios.post(`${API_BASE}/api/cart/add/${barcode}`);
export const increaseCart = (barcode) => axios.post(`${API_BASE}/api/cart/increase/${barcode}`);
export const decreaseCart = (barcode) => axios.post(`${API_BASE}/api/cart/decrease/${barcode}`);
export const removeFromCart = (barcode) => axios.delete(`${API_BASE}/api/cart/remove/${barcode}`);
export const fetchCart = () => axios.get(`${API_BASE}/api/cart`);
