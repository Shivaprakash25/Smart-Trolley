import qrcode

def generate_upi_qr(amount):
    upi_id = "7010388656@ptsbi"
    name = "Shivaprakash"
    currency = "INR"
    note = "Smart Trolley Checkout"

    url = f"upi://pay?pa={upi_id}&pn={name}&am={amount:.2f}&cu={currency}&tn={note}"
    img = qrcode.make(url)
    img.save("upi_qr.png")
    print("✅ UPI QR code generated for ₹", amount)
