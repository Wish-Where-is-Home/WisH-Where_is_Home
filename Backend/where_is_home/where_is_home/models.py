from django.db import models
from django.contrib.gis.db import models 
import uuid

class User(models.Model):
    id = models.CharField(max_length=30,  primary_key=True)
    nome = models.CharField(max_length=255, null=False, blank=False)
    email = models.CharField(max_length=255, null=False, blank=False, unique=True)
    endereco = models.CharField(max_length=255, null=True, blank=True)
    telemovel = models.CharField(max_length=20, null=True, blank=True)
    role = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.email
    class Meta:
        db_table = 'users'

class UserPreference(models.Model):
    id = models.CharField(max_length=30, primary_key=True)
    sports_center = models.DecimalField(max_digits=10, decimal_places=4)
    commerce = models.DecimalField(max_digits=10, decimal_places=4)
    bakery = models.DecimalField(max_digits=10, decimal_places=4)
    food_court = models.DecimalField(max_digits=10, decimal_places=4)
    nightlife = models.DecimalField(max_digits=10, decimal_places=4)
    camping = models.DecimalField(max_digits=10, decimal_places=4)
    health_services = models.DecimalField(max_digits=10, decimal_places=4)
    hotel = models.DecimalField(max_digits=10, decimal_places=4)
    supermarket = models.DecimalField(max_digits=10, decimal_places=4)
    culture = models.DecimalField(max_digits=10, decimal_places=4)
    school = models.DecimalField(max_digits=10, decimal_places=4)
    library = models.DecimalField(max_digits=10, decimal_places=4)
    parks = models.DecimalField(max_digits=10, decimal_places=4)
    services = models.DecimalField(max_digits=10, decimal_places=4)
    kindergarten = models.DecimalField(max_digits=10, decimal_places=4)
    university = models.DecimalField(max_digits=10, decimal_places=4)
    entertainment = models.DecimalField(max_digits=10, decimal_places=4)
    pharmacy = models.DecimalField(max_digits=10, decimal_places=4)
    swimming_pool = models.DecimalField(max_digits=10, decimal_places=4)
    bank = models.DecimalField(max_digits=10, decimal_places=4)
    post_office = models.DecimalField(max_digits=10, decimal_places=4)
    hospital = models.DecimalField(max_digits=10, decimal_places=4)
    clinic = models.DecimalField(max_digits=10, decimal_places=4)
    veterinary = models.DecimalField(max_digits=10, decimal_places=4)
    beach_river = models.DecimalField(max_digits=10, decimal_places=4)
    industrial_zone = models.DecimalField(max_digits=10, decimal_places=4)
    bicycle_path = models.DecimalField(max_digits=10, decimal_places=4)
    walking_routes = models.DecimalField(max_digits=10, decimal_places=4)
    car_park = models.DecimalField(max_digits=10, decimal_places=4)
    theme_commerce = models.DecimalField(max_digits=10, decimal_places=4)
    theme_social_leisure = models.DecimalField(max_digits=10, decimal_places=4)
    theme_health = models.DecimalField(max_digits=10, decimal_places=4)
    theme_nature_sports = models.DecimalField(max_digits=10, decimal_places=4)
    theme_service = models.DecimalField(max_digits=10, decimal_places=4)
    theme_education = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return self.id

    class Meta:
        db_table = 'users_preferences'

class Imovel(models.Model):
    owner = models.CharField(max_length=30)
    nome = models.CharField(max_length=100)
    morada = models.TextField()
    tipologia = models.CharField(max_length=50, blank=True, null=True)
    area = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    geom = models.PointField(srid=4326, blank=True, null=True)
    piso = models.IntegerField(blank=True, null=True)
    elevador = models.BooleanField(default=False)
    wcs = models.IntegerField(blank=True, null=True)
    estacionamento_garagem = models.BooleanField(default=False)
    equipado = models.BooleanField(default=False)
    cozinha = models.BooleanField(default=False)
    wifi = models.BooleanField(default=False)
    descricao = models.TextField(blank=True, null=True)
    selo = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'imovel'


class Quarto(models.Model):
    imovel = models.ForeignKey('Imovel', on_delete=models.CASCADE)
    despesas_incluidas = models.TextField(blank=True)
    wc_privado = models.BooleanField(default=False)
    preco_mes = models.DecimalField(max_digits=10, decimal_places=2)
    area = models.DecimalField(max_digits=10, decimal_places=2)
    tipologia = models.TextField(blank=True)
    estado = models.CharField(max_length=50, blank=True, null=True, default="on hold") # on hold, aproved, rejected -> alterar no servidor models e views
    disponivel = models.BooleanField(default=True)
    observacoes = models.TextField(blank=True)
    coments_by_admin = models.TextField(blank=True, null=True)  # Adicionando o novo campo
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'quartos'
