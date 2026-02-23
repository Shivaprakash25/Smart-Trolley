import cv2 as cvv  
import json
import qrcode
import mysql.connector
import os
from flask import Flask, render_template, jsonify, request, Response, send_file
from pyzbar.pyzbar import decode
from datetime import datetime
from db_config import config 

app = Flask(__name__)



def load_product_catalog():
    with open('products.json', 'r') as f:
        return {p['barcode']: p for p in json.load(f)}

product_catalog = load_product_catalog()
cart = []

def generate_upi_qr(amount):
    upi_id = "shivashana2525@okhdfcbank"
    url = f"upi://pay?pa={upi_id}&pn=SmartTrolley&am={amount:.2f}&cu=INR"
    qr = qrcode.make(url)
    qr_path = "upi_qr.png"
    qr.save(qr_path)
    return qr_path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cart')
def get_cart():
    return jsonify(cart)

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    barcode = request.json.get('barcode')
    if barcode in product_catalog:
        product = product_catalog[barcode]
        if not any(item['barcode'] == barcode for item in cart):
            cart.append({**product, 'qty': 1})
            return jsonify({'status': 'added', 'cart': cart}), 200
        return jsonify({'status': 'already exists'}), 200
    return jsonify({'status': 'not found'}), 404

@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    barcode = request.json.get('barcode')
    global cart
    cart = [item for item in cart if item['barcode'] != barcode]
    return jsonify({'status': 'removed', 'cart': cart}), 200

@app.route('/update_quantity', methods=['POST'])
def update_quantity():
    barcode = request.json.get('barcode')
    change = request.json.get('change')

    for item in cart:
        if item['barcode'] == barcode:
            item['qty'] += change
            if item['qty'] <= 0:
                cart.remove(item)
            break
    return jsonify({'status': 'updated', 'cart': cart}), 200

@app.route('/generate_upi_qr')
def get_upi_qr():
    amount = request.args.get('amount', type=float)
    if amount and amount > 0:
        qr_path = generate_upi_qr(amount)
        return send_file(qr_path, mimetype='image/png')
    return jsonify({'error': 'Invalid amount'}), 400

@app.route('/store_payment_history', methods=['POST'])
def store_payment_history():
    data = request.get_json()
    timestamp = datetime.now()
    total = data.get("total")
    items = json.dumps(data.get("cart"))

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO payment_history (timestamp, total, items) VALUES (%s, %s, %s)",
            (timestamp, total, items)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "saved to MySQL"}), 200
    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({"error": str(err)}), 500

@app.route('/get_payment_history')
def get_payment_history():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM payment_history ORDER BY timestamp DESC")
        history = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(history)
    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({"error": str(err)}), 500

@app.route('/clear_cart', methods=['POST'])
def clear_cart():
    global cart
    cart.clear()
    return jsonify({'status': 'cart cleared'}), 200

@app.route('/stop_shopping', methods=['POST'])
def stop_shopping():
    global cart
    cart.clear()
    return jsonify({'status': 'shopping stopped, cart cleared'}), 200

@app.route('/video_feed')
def video_feed():
    return Response(generate_video(), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate_video():
    cap = cvv.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break   
        for barcode in decode(frame):
            data = barcode.data.decode('utf-8')
            if data in product_catalog and not any(p['barcode'] == data for p in cart):
                cart.append({**product_catalog[data], 'qty': 1})
                print(f"[✓] Added to cart: {product_catalog[data]['name']}")

        _, jpeg = cvv.imencode('.jpg', frame)
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

    cap.release()

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
