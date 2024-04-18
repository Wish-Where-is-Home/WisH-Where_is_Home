from rest_framework.views import APIView, View
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
import jwt
from django.conf import settings
from django.http import HttpResponse
from datetime import datetime, timedelta
from django.db import connection
from django.http import JsonResponse
from .models import User, UserPreference
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

def check_token(request):
    # Verifica se a solicitação possui o cabeçalho de autorização
    if 'Authorization' in request.headers:
        # Extrai o token do cabeçalho de autorização
        auth_header = request.headers['Authorization']
        token = auth_header.split(' ')[1]

        try:
            # Decodifica o token JWT para obter as informações do usuário
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Retorna o ID do usuário extraído do token
            return {'success': decoded_token['id']}
        except jwt.ExpiredSignatureError:
            # Se o token estiver expirado, retorna uma resposta de erro
            return {'error': 'expired'}
        except jwt.InvalidTokenError:
            # Se o token for inválido, retorna uma resposta de erro
            return {'error': 'not valid'}
    else:
        # Se o cabeçalho de autorização estiver ausente, retorna uma resposta de erro
        return {'error': 'Authorization header missing'}


class GenerateTokenView(APIView):
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        user_id = request.data.get('id')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            user = User.objects.create(id=user_id, nome=name, email=email)

        expiration_time = datetime.utcnow() + timedelta(hours=1)

        token_payload = {
            'email': email,
            'name': name,
            'id': user_id, 
            'exp': expiration_time.timestamp() 
        }
        jwt_token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'token': jwt_token, 'exp': expiration_time.timestamp()}, status=status.HTTP_200_OK)

class UpdateUserView(APIView):
    def post(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Obtém o ID do usuário do token
        user_id = token_result['success']
        user = get_object_or_404(User, id=user_id)

        nome = request.POST.get('nome')
        endereco = request.POST.get('endereco')
        telemovel = request.POST.get('telemovel')

        user.nome = nome
        user.endereco = endereco
        user.telemovel = telemovel

        user.save()

        return JsonResponse({'message': 'Info: User updated with success.'})

class GetUserView(APIView):
    def get(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Obtém o ID do usuário do token
        user_id = token_result['success']
        user = get_object_or_404(User, id=user_id)

        return JsonResponse({
            'id': user.id,
            'nome': user.nome,
            'email': user.email,
            'endereco': user.endereco,
            'telemovel': user.telemovel,
            'role': user.role,
        })

class GetUserPreferenceView(APIView):
    def get(self,request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Obtém o ID do usuário do token
        user_id = token_result['success']

        user = get_object_or_404(UserPreference, id=user_id)


        if request.method == 'GET':
            return JsonResponse({
                'id': user.id,
                'sports_center': user.sports_center,
                'commerce': user.commerce,
                'bakery': user.bakery,
                'food_court': user.food_court,
                'nightlife': user.nightlife,
                'camping': user.camping,
                'health_services': user.health_services,
                'hotel': user.hotel,
                'supermarket': user.supermarket,
                'culture': user.culture,
                'school': user.school,
                'library': user.library,
                'parks': user.parks,
                'services': user.services,
                'kindergarten': user.kindergarten,
                'university': user.university,
                'entertainment': user.entertainment,
                'pharmacy': user.pharmacy,
                'swimming_pool': user.swimming_pool,
                'bank': user.bank,
                'post_office': user.post_office,
                'hospital': user.hospital,
                'clinic': user.clinic,
                'veterinary': user.veterinary,
                'beach_river': user.beach_river,
                'industrial_zone': user.industrial_zone,
                'bicycle_path': user.bicycle_path,
                'walking_routes': user.walking_routes,
                'car_park': user.car_park,
                'theme_commerce': user.theme_commerce,
                'theme_social_leisure': user.theme_social_leisure,
                'theme_health': user.theme_health,
                'theme_nature_sports': user.theme_nature_sports,
                'theme_service': user.theme_service,
                'theme_education': user.theme_education
            })
        return JsonResponse({'error': 'Error: Method not allowed.'}, status=405)


class UpdateUserPreferenceView(APIView):
    def post(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Obtém o ID do usuário do token
        user_id = token_result['success']
        if request.method == 'POST':
            # Verifica se o usuário já existe no banco de dados
            user_preference, created = UserPreference.objects.get_or_create(id=user_id)

            # Obtém os dados do corpo da solicitação
            data = request.POST

            # Atualiza os campos com os dados da solicitação
            user_preference.sports_center = data.get('sports_center', user_preference.sports_center)
            user_preference.commerce = data.get('commerce', user_preference.commerce)
            user_preference.bakery = data.get('bakery', user_preference.bakery)
            user_preference.food_court = data.get('food_court', user_preference.food_court)
            user_preference.nightlife = data.get('nightlife', user_preference.nightlife)
            user_preference.camping = data.get('camping', user_preference.camping)
            user_preference.health_services = data.get('health_services', user_preference.health_services)
            user_preference.hotel = data.get('hotel', user_preference.hotel)
            user_preference.supermarket = data.get('supermarket', user_preference.supermarket)
            user_preference.culture = data.get('culture', user_preference.culture)
            user_preference.school = data.get('school', user_preference.school)
            user_preference.library = data.get('library', user_preference.library)
            user_preference.parks = data.get('parks', user_preference.parks)
            user_preference.services = data.get('services', user_preference.services)
            user_preference.kindergarten = data.get('kindergarten', user_preference.kindergarten)
            user_preference.university = data.get('university', user_preference.university)
            user_preference.entertainment = data.get('entertainment', user_preference.entertainment)
            user_preference.pharmacy = data.get('pharmacy', user_preference.pharmacy)
            user_preference.swimming_pool = data.get('swimming_pool', user_preference.swimming_pool)
            user_preference.bank = data.get('bank', user_preference.bank)
            user_preference.post_office = data.get('post_office', user_preference.post_office)
            user_preference.hospital = data.get('hospital', user_preference.hospital)
            user_preference.clinic = data.get('clinic', user_preference.clinic)
            user_preference.veterinary = data.get('veterinary', user_preference.veterinary)
            user_preference.beach_river = data.get('beach_river', user_preference.beach_river)
            user_preference.industrial_zone = data.get('industrial_zone', user_preference.industrial_zone)
            user_preference.bicycle_path = data.get('bicycle_path', user_preference.bicycle_path)
            user_preference.walking_routes = data.get('walking_routes', user_preference.walking_routes)
            user_preference.car_park = data.get('car_park', user_preference.car_park)
            user_preference.theme_commerce = data.get('theme_commerce', user_preference.theme_commerce)
            user_preference.theme_social_leisure = data.get('theme_social_leisure', user_preference.theme_social_leisure)
            user_preference.theme_health = data.get('theme_health', user_preference.theme_health)
            user_preference.theme_nature_sports = data.get('theme_nature_sports', user_preference.theme_nature_sports)
            user_preference.theme_service = data.get('theme_service', user_preference.theme_service)
            user_preference.theme_education = data.get('theme_education', user_preference.theme_education)

            # Salva o objeto no banco de dados
            user_preference.save()

            # Retorna uma resposta de sucesso
            return JsonResponse({'message': 'User preference added/updated successfully'})

        # Retorna um erro se o método HTTP não for POST
        return JsonResponse({'error': 'Method not allowed'}, status=405)

class GetZoneDataView(APIView):
    def get(self, request):
        try:
         # Define as consultas SQL para buscar os dados
            queries = {
                'distritos': 'SELECT * FROM view_values_by_destrito',
                'municipios': 'SELECT * FROM view_values_by_municipio',
                'freguesias': 'SELECT * FROM view_values_by_freguesia',
                'subseccao': 'SELECT * FROM view_values_by_subseccao'
            }

            results = {}
            with connection.cursor() as cursor:
                for zone_type, query in queries.items():
                    cursor.execute(query)
                    data = cursor.fetchall()

                # Organiza os dados buscados no formato desejado
                    zone_data = {}
                    for row in data:
                        id = row[0]  # Supondo que o primeiro valor seja o ID
                        if id not in zone_data:
                            zone_data[id] = {}
                        for i in range(1, len(row)):  # Começamos do índice 1 para evitar o ID
                            column_name = cursor.description[i][0]
                            zone_data[id][column_name] = row[i]

                    results[zone_type] = zone_data

            return JsonResponse(results, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

