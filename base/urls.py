from django.urls import path
from . import views

urlpatterns =[
    path('', views.home, name='home'),
    path('api/generate-link-qr', views.generate_link_qr, name='generate_link_qr'),
    path('api/generate-email-qr', views.generate_email_qr, name='generate_email_qr'),
    path('api/generate-call-qr', views.generate_call_qr, name='generate_call_qr'),
    path('api/generate-whatsapp-qr', views.generate_whatsapp_qr, name='generate_whatsapp_qr'),
]