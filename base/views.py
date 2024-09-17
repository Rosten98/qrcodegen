from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
import qrcode
# https://pypi.org/project/qrcode/
from io import BytesIO
import base64
from qrcode.image.pil import PilImage  # Correct import for the PilImage factory


def generate_qr(data):
    # Create a QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    # Add the data to the QR code
    qr.add_data(data)
    qr.make(fit=True)

    # Create an image from the QR code
    img = qr.make_image(fill='black', back_color='white', image_factory=PilImage)

    # Save the image to a BytesIO object
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    # Encode the image to Base64 to embed it in the HTML
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return img_base64


def generate_link_qr(request):
    if request.method == "POST":
        data = json.loads(request.body)
        qr_url = data.get('qr_url')

        qr_img = generate_qr(qr_url)

        return JsonResponse({'qr_image_base64': qr_img})


def generate_email_qr(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('qr_email')
        subject = data.get('qr_subject')
        body = data.get('qr_mail_body')
        # Create the mailto URI
        mailto_uri = f"mailto:{email}?subject={subject}&body={body}"
        
        qr_img = generate_qr(mailto_uri)

        return JsonResponse({'qr_image_base64': qr_img})
    

def generate_call_qr(request):
    if request.method == "POST":
        data = json.loads(request.body)
        phone_number = data.get('qr_phone')  # Phone number to call
        # Create the tel URI
        tel_uri = f"tel:{phone_number}"
        
        qr_img = generate_qr(tel_uri)

        return JsonResponse({'qr_image_base64': qr_img})


def generate_whatsapp_qr(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        phone_number = data.get('qr_whatsapp')  # International format without '+'
        message = data.get('qr_message')
        # Create the WhatsApp URL
        whatsapp_uri = f"https://wa.me/{phone_number}?text={message}"
        
        qr_img = generate_qr(whatsapp_uri)

        return JsonResponse({'qr_image_base64': qr_img})


# Create your views here.
def home(request):
    img_base64 = False
    
    if request.method == "POST":
        qr_url = request.POST.get('qr_url')
        img_base64 = generate_qr(qr_url)
        
    
    context = {
        'qr_code': img_base64
    }
    return render(request, 'home.html', context)