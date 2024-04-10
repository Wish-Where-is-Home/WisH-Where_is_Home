import firebase_admin
from firebase_admin import auth
from django.conf import settings

firebase_admin.initialize_app()

def verify_id_token(id_token):
    decoded_token = auth.verify_id_token(id_token, app=settings.FIREBASE_CONFIG)
    return decoded_token
