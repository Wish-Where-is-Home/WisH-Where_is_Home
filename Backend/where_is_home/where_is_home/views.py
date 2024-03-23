from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import jwt
from django.conf import settings

class GenerateTokenView(APIView):
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        
        token_payload = {'email': email, 'name': name}
        jwt_token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'token': jwt_token}, status=status.HTTP_200_OK)
