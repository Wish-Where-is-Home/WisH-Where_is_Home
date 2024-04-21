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
from .models import User, UserPreference, Quarto, Imovel
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
            return {'success': {'id': decoded_token['id'], 'role': decoded_token.get('role')}}
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
        expiration_time = datetime.utcnow() + timedelta(hours=1)
        try:
            user = User.objects.get(id=user_id)
            role = user.role
        except User.DoesNotExist:
            user = User.objects.create(id=user_id, nome=name, email=email, role='normal')
            preferences = UserPreference.objects.create(id=user_id)
            role = 'normal'

        token_payload = {
            'email': email,
            'name': name,
            'id': user_id,
            'role': role,
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

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')
        user = get_object_or_404(User, id=user_id)

        # Obtém os dados do corpo da solicitação
        data = request.data
        # Atualiza as informações do usuário com os dados da solicitação
        user.nome = data.get('nome', user.nome)
        user.endereco = data.get('endereco', user.endereco)
        user.telemovel = data.get('telemovel', user.telemovel)

        user.save()

        return JsonResponse({'message': 'Info: User updated with success.'})

class GetUserView(APIView):
    def get(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
        # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

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

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

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

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        if request.method == 'POST':
            # Verifica se o usuário já existe no banco de dados
            user_preference, created = UserPreference.objects.get_or_create(id=user_id)
            # Obtém os dados do corpo da solicitação
            data = request.data
            print("request.data",data)            

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

class UpdateRoomStatus(APIView):
    def post(self, request, quarto_id):
        token_result = check_token(request)
        if 'error' in token_result:
        # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        if user_role != 'admin':
        # Retorna uma resposta de erro se o usuário não for um administrador
            return JsonResponse({'error': 'Unauthorized access. Only administrators are allowed.'}, status=403)

        data = request.data
        status = data.get('status')
        comment = data.get('comment')

        try:
            # Verifica se o quarto existe
            quarto = Quarto.objects.get(id=quarto_id)

            if status == 'accepted':
                # Atualiza o estado para aceito
                quarto.estado = 'approved'
                quarto.coments_by_admin = None  # Limpa o campo de comentário
                quarto.save()
                return JsonResponse({"message": "Room status updated to accepted."})
            elif status == 'denied':
                # Verifica se o comentário está presente
                if not comment:
                    return JsonResponse({"error": "A comment is required for denied status."}, status=400)
                
                # Atualiza o estado para negado e adiciona o comentário
                quarto.estado = 'denied'
                quarto.coments_by_admin = comment
                quarto.save()
                
                return JsonResponse({"message": "Room status updated to denied with comment."})
            else:
                return JsonResponse({"error": "Invalid status provided."}, status=400)

        except Quarto.DoesNotExist:
            return JsonResponse({"error": "Room not found."}, status=404)


class GetAllProperties(APIView):
    def get(self, request):
        # Recuperar todos os imóveis
        properties = Imovel.objects.all()

        # Inicializar a lista para armazenar os imóveis a serem serializados
        serialized_properties = []

        # Loop através de todos os imóveis
        for property in properties:
            # Verifica se todos os quartos do imóvel estão aprovados
            if property.quarto_set.filter(estado='approved').count() == property.quarto_set.count():
                # Se todos os quartos estiverem aprovados, serializa o imóvel
                if property.geom:
                    geom_coordinates = (property.geom.x, property.geom.y)
                else:
                    geom_coordinates = None

                serialized_property = {
                    "id": property.id,
                    "nome": property.nome,
                    "morada": property.morada,
                    "tipologia": property.tipologia,
                    "area": property.area,
                    "geom": geom_coordinates,
                    "piso": property.piso,
                    "elevador": property.elevador,
                    "wcs": property.wcs,
                    "estacionamento_garagem": property.estacionamento_garagem,
                    "equipado": property.equipado,
                    "cozinha": property.cozinha,
                    "wifi": property.wifi,
                    "descricao": property.descricao,
                    "selo": property.selo,
                    "updated_at": property.updated_at
                }
                serialized_properties.append(serialized_property)

        # Retorna os imóveis serializados como uma resposta JSON
        return JsonResponse({"properties": serialized_properties})

class GetAllPropertiesDenied(APIView):
    def get(self, request):
        # Recuperar todos os imóveis
        properties = Imovel.objects.all()

        # Inicializar a lista para armazenar os imóveis a serem serializados
        serialized_properties = []

        # Loop através de todos os imóveis
        for property in properties:
            # Verifica se todos os quartos do imóvel estão aprovados
            if property.quarto_set.filter(estado='denied').exists():
                # Se todos os quartos estiverem aprovados, serializa o imóvel
                if property.geom:
                    geom_coordinates = (property.geom.x, property.geom.y)
                else:
                    geom_coordinates = None

                serialized_property = {
                    "id": property.id,
                    "nome": property.nome,
                    "morada": property.morada,
                    "tipologia": property.tipologia,
                    "area": property.area,
                    "geom": geom_coordinates,
                    "piso": property.piso,
                    "elevador": property.elevador,
                    "wcs": property.wcs,
                    "estacionamento_garagem": property.estacionamento_garagem,
                    "equipado": property.equipado,
                    "cozinha": property.cozinha,
                    "wifi": property.wifi,
                    "descricao": property.descricao,
                    "selo": property.selo,
                    "updated_at": property.updated_at
                }
                serialized_properties.append(serialized_property)

        # Retorna os imóveis serializados como uma resposta JSON
        return JsonResponse({"properties": serialized_properties})

class GetPendingRooms(APIView):
    def get(self, request):
        # Recuperar todos os quartos pendentes de aprovação
        pending_rooms = Quarto.objects.filter(estado='on hold')

        # Inicializar a lista para armazenar os quartos serializados
        serialized_rooms = []

        # Loop através de todos os quartos pendentes
        for room in pending_rooms:
            # Recuperar o imóvel associado ao quarto
            property = room.imovel

            # Recuperar o proprietário do imóvel
            owner = User.objects.get(id=room.imovel.owner)

            # Serializar os dados do proprietário
            owner_info = {
                'owner_id': owner.id,
                'owner_name': owner.nome,
                'owner_email': owner.email,
                'owner_phone': owner.telemovel
            }

            # Serializar os dados do imóvel
            property_info = {
                'property_id': property.id,
                'property_name': property.nome,
                'property_address': property.morada,
                'property_type': property.tipologia,
                'property_area': property.area,
                'property_geom': (property.geom.x, property.geom.y) if property.geom else None,
                'property_floor': property.piso,
                'property_elevator': property.elevador,
                'property_wc': property.wcs,
                'property_parking': property.estacionamento_garagem,
                'property_equipped': property.equipado,
                'property_kitchen': property.cozinha,
                'property_wifi': property.wifi,
                'property_description': property.descricao,
                'property_seal': property.selo,
                'property_updated_at': property.updated_at
            }

            # Serializar os dados do quarto
            room_info = {
                'room_id': room.id,
                'property_id': property.id,
                'despesas_incluidas': room.despesas_incluidas,
                'wc_privado': room.wc_privado,
                'preco_mes': room.preco_mes,
                'area': room.area,
                'tipologia': room.tipologia,
                'room_state': room.estado,
                'available': room.disponivel,
                'observations': room.observacoes,
                'created_at': room.created_at,
                'updated_at': room.updated_at
            }

            # Adicionar informações ao quarto serializado
            serialized_room = {
                'owner_info': owner_info,
                'property_info': property_info,
                'room_info': room_info
            }

            # Adicionar o quarto serializado à lista
            serialized_rooms.append(serialized_room)

        # Retorna os quartos pendentes serializados como uma resposta JSON
        return JsonResponse({"pending_rooms": serialized_rooms})


class GetPropertyById(APIView):
    def get(self, request, imovel_id):
        try:
            # Recupera a propriedade pelo ID
            property = Imovel.objects.get(id=imovel_id)

            if property.geom:
                geom_coordinates = (property.geom.x, property.geom.y)
            else:
                geom_coordinates = None


            # Serializa os dados da propriedade
            serialized_property = {
                "id": property.id,
                "nome": property.nome,
                "morada": property.morada,
                "tipologia": property.tipologia,
                "area": property.area,
                "geom": geom_coordinates,
                "piso": property.piso,
                "elevador": property.elevador,
                "wcs": property.wcs,
                "estacionamento_garagem": property.estacionamento_garagem,
                "equipado": property.equipado,
                "cozinha": property.cozinha,
                "wifi": property.wifi,
                "descricao": property.descricao,
                "selo": property.selo,
                "updated_at": property.updated_at
            }

            quartos = Quarto.objects.filter(imovel_id=imovel_id)

            serialized_quartos = [{
                "id": quarto.id,
                "despesas_incluidas": quarto.despesas_incluidas,
                "wc_privado": quarto.wc_privado,
                "preco_mes": quarto.preco_mes,
                "area": quarto.area,
                "tipologia": quarto.tipologia,
                "estado": quarto.estado,
                "disponivel": quarto.disponivel,
                "observacoes": quarto.observacoes,
                "updated_at": quarto.updated_at
            } for quarto in quartos]
            
            
            user = get_object_or_404(User, id=property.owner)

            owner_info = {
               'nome': user.nome,
               'email': user.email,
               'telemovel': user.telemovel,
            } 

            return JsonResponse({"property": serialized_property, "quartos": serialized_quartos, "owner_info":owner_info})
        except Imovel.DoesNotExist:
            return JsonResponse({"error": "A propriedade não foi encontrada."}, status=404)

class GetRoomById(APIView):
    def get(self, request, quarto_id):
        try:
            # Recupera o quarto pelo ID
            quarto = Quarto.objects.get(id=quarto_id)

            # Serializa os dados do quarto
            serialized_quarto = {
                "id": quarto.id,
                "imovel_id": quarto.imovel_id,
                "despesas_incluidas": quarto.despesas_incluidas,
                "wc_privado": quarto.wc_privado,
                "preco_mes": quarto.preco_mes,
                "area": quarto.area,
                "tipologia": quarto.tipologia,
                "estado": quarto.estado,
                "disponivel": quarto.disponivel,
                "observacoes": quarto.observacoes,
                "updated_at": quarto.updated_at
            }

            # Recupera os detalhes da propriedade associada ao quarto
            imovel = quarto.imovel
            if imovel.geom:
                geom_coordinates = (imovel.geom.x, imovel.geom.y)
            else:
                geom_coordinates = None
            serialized_imovel = {
                "id": imovel.id,
                "owner": imovel.owner,
                "nome": imovel.nome,
                "morada": imovel.morada,
                "tipologia": imovel.tipologia,
                "area": imovel.area,
                "geom": geom_coordinates,
                "piso": imovel.piso,
                "elevador": imovel.elevador,
                "wcs": imovel.wcs,
                "estacionamento_garagem": imovel.estacionamento_garagem,
                "equipado": imovel.equipado,
                "cozinha": imovel.cozinha,
                "wifi": imovel.wifi,
                "descricao": imovel.descricao,
                "selo": imovel.selo,
                "updated_at": imovel.updated_at
            }

            user = get_object_or_404(User, id=imovel.owner)

            owner_info = {
               'nome': user.nome,
               'email': user.email,
               'telemovel': user.telemovel,
            } 


            # Retorna a resposta como JsonResponse
            return JsonResponse({"quarto": serialized_quarto, "imovel": serialized_imovel, "owner":owner_info})
        except Quarto.DoesNotExist:
            return JsonResponse({"error": "O quarto não foi encontrado."}, status=404)


class OwnerApprovedPropertiesView(APIView):
    def get(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Recupera todas as propriedades do proprietário
        properties = Imovel.objects.filter(owner=user_id)

        # Inicializa as listas para armazenar as propriedades e os quartos serializados
        approved_rooms_properties = []


        # Loop através de todas as propriedades
        for property in properties:
            if property.geom:
                geom_coordinates = (property.geom.x, property.geom.y)
            else:
                geom_coordinates = None

            # Serializa os dados da propriedade
            serialized_property = {
                "id": property.id,
                "nome": property.nome,
                "morada": property.morada,
                "tipologia": property.tipologia,
                "area": property.area,
                "geom": geom_coordinates,
                "piso": property.piso,
                "elevador": property.elevador,
                "wcs": property.wcs,
                "estacionamento_garagem": property.estacionamento_garagem,
                "equipado": property.equipado,
                "cozinha": property.cozinha,
                "wifi": property.wifi,
                "descricao": property.descricao,
                "selo": property.selo,
                "updated_at": property.updated_at
            }

            rooms = property.quarto_set.all()

            # Verifica se todos os quartos têm estado 'approved'
            if rooms.filter(estado='approved').count() == rooms.count():
                # Se todos os quartos forem 'approved', adiciona a propriedade à lista correspondente
                approved_rooms_properties.append(serialized_property)

        # Retorna as propriedades e as listas de quartos correspondentes como uma resposta JSON
        return JsonResponse({
            "approved_rooms_properties": approved_rooms_properties,
        })


class OwnerApprovedRoomsView(APIView):
    def get(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Recupera todos os quartos do proprietário
        rooms = Quarto.objects.filter(imovel__owner=user_id)

        # Inicializa a lista para armazenar os quartos serializados
        serialized_rooms = []

        # Loop através de todos os quartos
        for room in rooms:
            # Recupera o imóvel associado ao quarto
            property = room.imovel

            # Serializa os dados da room
            serialized_room = {
                "id": room.id,
                "property_id": property.id,
                "despesas_incluidas": room.despesas_incluidas,
                "wc_privado": room.wc_privado,
                "preco_mes": room.preco_mes,
                "area": room.area,
                "tipologia": room.tipologia,
                "estado": room.estado,
                "disponivel": room.disponivel,
                "observacoes": room.observacoes,
                "updated_at": room.updated_at
            }

            # Adiciona o quarto serializado à lista se o estado for 'approved'
            if room.estado == 'approved':
                serialized_rooms.append(serialized_room)

        # Retorna os quartos serializados como uma resposta JSON
        return JsonResponse({"rooms": serialized_rooms})
    

class OwnerDeniedOnHoldPropertiesView(APIView):
    def get(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Recupera todas as propriedades do proprietário
        properties = Imovel.objects.filter(owner=user_id)

        # Inicializa as listas para armazenar as propriedades e os quartos serializados
        denied_rooms_properties = []
        on_hold_rooms_properties = []

        # Loop através de todas as propriedades
        for property in properties:
            if property.geom:
                geom_coordinates = (property.geom.x, property.geom.y)
            else:
                geom_coordinates = None

            # Serializa os dados da propriedade
            serialized_property = {
                "id": property.id,
                "nome": property.nome,
                "morada": property.morada,
                "tipologia": property.tipologia,
                "area": property.area,
                "geom": geom_coordinates,
                "piso": property.piso,
                "elevador": property.elevador,
                "wcs": property.wcs,
                "estacionamento_garagem": property.estacionamento_garagem,
                "equipado": property.equipado,
                "cozinha": property.cozinha,
                "wifi": property.wifi,
                "descricao": property.descricao,
                "selo": property.selo,
                "updated_at": property.updated_at
            }

            rooms = property.quarto_set.all()

            # Verifica se todos os quartos têm estado 'approved'
            if rooms.filter(estado='denied').exists():
                # Se todos os quartos forem 'approved', adiciona a propriedade à lista correspondente
                denied_rooms_properties.append(serialized_property)
            elif rooms.filter(estado='on hold').exists():
                on_hold_rooms_properties.append(serialized_property)


        # Retorna as propriedades e as listas de quartos correspondentes como uma resposta JSON
        return JsonResponse({
            "denied_rooms_properties": denied_rooms_properties,
            "on_hold_rooms_properties": on_hold_rooms_properties
        })


class OwnerDeniedOnHoldRoomsView(APIView):
    def get(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Recupera todos os quartos do proprietário
        rooms = Quarto.objects.filter(imovel__owner=user_id)

        # Inicializa a lista para armazenar os quartos serializados
        onHold_rooms = []
        denied_rooms = []

        # Loop através de todos os quartos
        for room in rooms:
            # Recupera o imóvel associado ao quarto
            property = room.imovel

            # Serializa os dados da room
            serialized_room = {
                "id": room.id,
                "property_id": property.id,
                "despesas_incluidas": room.despesas_incluidas,
                "wc_privado": room.wc_privado,
                "preco_mes": room.preco_mes,
                "area": room.area,
                "tipologia": room.tipologia,
                "estado": room.estado,
                "disponivel": room.disponivel,
                "observacoes": room.observacoes,
                "coments_by_admin": room.coments_by_admin,
                "updated_at": room.updated_at
            }

            # Adiciona o quarto serializado à lista se o estado for 'approved'
            if room.estado == 'denied':
                denied_rooms.append(serialized_room)
            elif room.estado == 'on hold':
                onHold_rooms.append(serialized_room)

        # Retorna os quartos serializados como uma resposta JSON
        return JsonResponse({
            "denied_rooms": denied_rooms,
            "onHold_rooms": onHold_rooms
        })
    

#Create a new imovel
class CreateImovel(APIView):
    def post(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')


        # Obtém os dados do corpo da solicitação
        data = request.data

        # Cria um novo objeto Imovel com os dados da solicitação
        imovel = Imovel.objects.create(
            owner=user_id,
            nome=data.get('nome'),
            morada=data.get('morada'),
            tipologia=data.get('tipologia'),
            area=data.get('area'),
            geom=data.get('geom'),
            piso=data.get('piso'),
            elevador=data.get('elevador'),
            wcs=data.get('wcs'),
            estacionamento_garagem=data.get('estacionamento_garagem'),
            equipado=data.get('equipado'),
            cozinha=data.get('cozinha'),
            wifi=data.get('wifi'),
            descricao=data.get('descricao'),
            selo=data.get('selo')
        )

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Imovel created successfully.'})
    
#Create a new room for a property
class CreateRoom(APIView):
    def post(self, request):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Obtém os dados do corpo da solicitação
        data = request.data

        # Verifica se o imóvel existe
        try:
            imovel = Imovel.objects.get(id=data.get('imovel_id'))
        except Imovel.DoesNotExist:
            return JsonResponse({'error': 'Imovel not found.'}, status=404)

        # Verifica se o imóvel pertence ao usuário
        if imovel.owner != user_id:
            return JsonResponse({'error': 'Unauthorized access. You do not own this property.'}, status=403)

        # Cria um novo objeto Quarto com os dados da solicitação
        room = Quarto.objects.create(
            imovel=imovel,
            despesas_incluidas=data.get('despesas_incluidas'),
            wc_privado=data.get('wc_privado'),
            preco_mes=data.get('preco_mes'),
            area=data.get('area'),
            tipologia=data.get('tipologia'),
            estado='on hold',
            disponivel=True,
            observacoes=data.get('observacoes')
        )

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Room created successfully.'})

class UpdateImovel(APIView):
    def post(self, request, imovel_id):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Obtém os dados do corpo da solicitação
        data = request.data

        # Verifica se o imóvel existe
        try:
            imovel = Imovel.objects.get(id=imovel_id)
        except Imovel.DoesNotExist:
            return JsonResponse({'error': 'Imovel not found.'}, status=404)

        # Verifica se o imóvel pertence ao usuário
        if imovel.owner != user_id:
            return JsonResponse({'error': 'Unauthorized access. You do not own this property.'}, status=403)

        # Atualiza as informações do imóvel com os dados da solicitação
        imovel.nome = data.get('nome', imovel.nome)
        imovel.morada = data.get('morada', imovel.morada)
        imovel.tipologia = data.get('tipologia', imovel.tipologia)
        imovel.area = data.get('area', imovel.area)
        imovel.geom = data.get('geom', imovel.geom)
        imovel.piso = data.get('piso', imovel.piso)
        imovel.elevador = data.get('elevador', imovel.elevador)
        imovel.wcs = data.get('wcs', imovel.wcs)
        imovel.estacionamento_garagem = data.get('estacionamento_garagem', imovel.estacionamento_garagem)
        imovel.equipado = data.get('equipado', imovel.equipado)
        imovel.cozinha = data.get('cozinha', imovel.cozinha)
        imovel.wifi = data.get('wifi', imovel.wifi)
        imovel.descricao = data.get('descricao', imovel.descricao)
        imovel.selo = data.get('selo', imovel.selo)

        # Salva o objeto no banco de dados
        imovel.save()

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Imovel updated successfully.'})
    
class UpdateRoom(APIView):
    def post(self, request, quarto_id):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Obtém os dados do corpo da solicitação
        data = request.data

        # Verifica se o quarto existe
        try:
            room = Quarto.objects.get(id=quarto_id)
        except Quarto.DoesNotExist:
            return JsonResponse({'error': 'Room not found.'}, status=404)

        # Verifica se o imóvel pertence ao usuário
        if room.imovel.owner != user_id:
            return JsonResponse({'error': 'Unauthorized access. You do not own this property.'}, status=403)

        # Atualiza as informações do quarto com os dados da solicitação
        room.despesas_incluidas = data.get('despesas_incluidas', room.despesas_incluidas)
        room.wc_privado = data.get('wc_privado', room.wc_privado)
        room.preco_mes = data.get('preco_mes', room.preco_mes)
        room.area = data.get('area', room.area)
        room.tipologia = data.get('tipologia', room.tipologia)
        room.estado = 'on hold'
        room.disponivel = data.get('disponivel', room.disponivel)
        room.observacoes = data.get('observacoes', room.observacoes)

        # Salva o objeto no banco de dados
        room.save()

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Room updated successfully.'})
    
class DeleteImovel(APIView):
    def delete(self, request, imovel_id):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Verifica se o imóvel existe
        try:
            imovel = Imovel.objects.get(id=imovel_id)
        except Imovel.DoesNotExist:
            return JsonResponse({'error': 'Imovel not found.'}, status=404)

        # Verifica se o imóvel pertence ao usuário
        if imovel.owner != user_id:
            return JsonResponse({'error': 'Unauthorized access. You do not own this property.'}, status=403)

        # Deleta o imóvel do banco de dados, tambeém deleta os quartos associados
        imovel.delete()

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Imovel deleted successfully.'})
    
class DeleteRoom(APIView):
    def delete(self, request, quarto_id):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Verifica se o quarto existe
        try:
            room = Quarto.objects.get(id=quarto_id)
        except Quarto.DoesNotExist:
            return JsonResponse({'error': 'Room not found.'}, status=404)

        # Verifica se o imóvel pertence ao usuário
        if room.imovel.owner != user_id:
            return JsonResponse({'error': 'Unauthorized access. You do not own this property.'}, status=403)

        # Deleta o quarto do banco de dados
        room.delete()

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Room deleted successfully.'})
    

    #update a disponibilidade of a room
class UpdateRoomAvailability(APIView):
    def post(self, request, quarto_id):
        token_result = check_token(request)
        if 'error' in token_result:
            # Retorna uma resposta de erro se o token não for válido ou estiver expirado
            return JsonResponse({'error': token_result['error']}, status=401)

        # Extrai o ID do usuário e a função (role) do resultado retornado pela função check_token 
        user_info = token_result['success']
        user_id = user_info.get('id')
        user_role = user_info.get('role')

        # Obtém os dados do corpo da solicitação
        data = request.data

        # Verifica se o quarto existe
        try:
            room = Quarto.objects.get(id=quarto_id)
        except Quarto.DoesNotExist:
            return JsonResponse({'error': 'Room not found.'}, status=404)

        # Verifica se o imóvel pertence ao usuário
        if room.imovel.owner != user_id:
            return JsonResponse({'error': 'Unauthorized access. You do not own this property.'}, status=403)

        # Atualiza a disponibilidade do quarto com os dados da solicitação
        room.disponivel = data.get('disponivel', room.disponivel)

        # Salva o objeto no banco de dados
        room.save()

        # Retorna uma resposta de sucesso
        return JsonResponse({'message': 'Room availability updated successfully.'})
