from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import jwt
from django.conf import settings

from datetime import datetime, timedelta

class GenerateTokenView(APIView):
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        user_id = request.data.get('id')
        
        
        expiration_time = datetime.utcnow() + timedelta(hours=1)
        
        token_payload = {
            'email': email,
            'name': name,
            'id': user_id, 
            'exp': expiration_time.timestamp() 
        }
        
        jwt_token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'token': jwt_token, 'exp': expiration_time.timestamp()}, status=status.HTTP_200_OK)
