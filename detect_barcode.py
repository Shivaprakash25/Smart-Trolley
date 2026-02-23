import cv2 as cvv  
from pyzbar.pyzbar import decode
import json

cart = []
added_barcodes = set()

def load_products():
    with open("products.json", "r") as f:
        data = json.load(f)
    return {item["barcode"]: item for item in data}

def generate_video():
    cap = cvv.VideoCapture(0)
    products = load_products()

    while True:
        success, frame = cap.read()
        if not success:
            break

        
        for barcode in decode(frame):
            data = barcode.data.decode('utf-8')
            if data not in added_barcodes and data in products:
                added_barcodes.add(data)
                product = products[data]
                cart.append(product)
                print(f"[+] Added to cart: {product['name']} - ₹{product['price']}")

            (x, y, w, h) = barcode.rect
            cvv.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cvv.putText(frame, data, (x, y-10), cvv.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

        ret, jpeg = cvv.imencode('.jpg', frame)
        frame_bytes = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()
