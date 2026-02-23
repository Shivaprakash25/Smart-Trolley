import json

def get_product_details(barcode):
    with open("products.json", "r") as f:
        db = json.load(f)
    return db.get(barcode, {"name": "Unknown", "price": 0})
