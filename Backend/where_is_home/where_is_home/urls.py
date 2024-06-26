"""
URL configuration for where_is_home project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import GenerateTokenView,GetUserView, UpdateUserView, GetZoneDataView, GetUserPreferenceView, UpdateUserPreferenceView,GetAllProperties, GetPropertyById, GetRoomById, GetAllPropertiesDenied, GetPendingRooms
from .views import UpdateRoomStatus, OwnerApprovedPropertiesView, OwnerApprovedRoomsView, OwnerDeniedOnHoldPropertiesView, OwnerDeniedOnHoldRoomsView
from .views import CreateImovel, CreateRoom, UpdateImovel, UpdateRoom, DeleteImovel, DeleteRoom, UpdateRoomAvailability, GetAllRoomsView, PreferenceAverageView

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
#    path('admin/', admin.site.urls),	
    path('loginusers/', GenerateTokenView.as_view(), name='login'),
    path('users/', GetUserView.as_view(), name='get my user'),
    path('users/update/', UpdateUserView.as_view(), name='update my user'),
    path('users/preferences/', GetUserPreferenceView.as_view(), name='get user preference'),
    path('users/preferences/update/', UpdateUserPreferenceView.as_view(), name='add or update user preference'),
    path('properties/aproved/', GetAllProperties.as_view(), name='get_all_properties_aproved'),
    path('properties/denied/', GetAllPropertiesDenied.as_view(), name='get_all_properties_denied'),
    path('properties/<int:imovel_id>/', GetPropertyById.as_view(), name='get_property_by_id'),
    path('properties/rooms/<int:quarto_id>/', GetRoomById.as_view(), name='get_room_by_id'),
    path('properties/rooms/all/', GetAllRoomsView.as_view(), name='get_all_rooms'),
    path('api/zone/', GetZoneDataView.as_view(), name='get_zone_data'),
    path('preferences/average/', PreferenceAverageView.as_view(), name='preference_average'),
    path('admin/pending/rooms/', GetPendingRooms.as_view(), name='pending_rooms to admin aprove or denie'),
    path('admin/update/room/status/<int:quarto_id>/', UpdateRoomStatus.as_view(), name='update_room_status'),
    path('owner/approved/properties/', OwnerApprovedPropertiesView.as_view(), name='get_owner_approved_properties'),
    path('owner/approved/rooms/', OwnerApprovedRoomsView.as_view(), name='get_owner_approved_rooms'),
    path('owner/denied_on_hold/properties/', OwnerDeniedOnHoldPropertiesView.as_view(), name='get_owner_denied_properties'),
    path('owner/denied_on_hold/rooms/', OwnerDeniedOnHoldRoomsView.as_view(), name='get_owner_denied_rooms'),
    path('owner/create/property/', CreateImovel.as_view(), name='create_property'),
    path('owner/create/room/', CreateRoom.as_view(), name='create_room'),
    path('owner/update/property/<int:imovel_id>/', UpdateImovel.as_view(), name='update_property'),
    path('owner/update/room/<int:quarto_id>/', UpdateRoom.as_view(), name='update_room'),
    path('owner/delete/property/<int:imovel_id>/', DeleteImovel.as_view(), name='delete_property'),
    path('owner/delete/room/<int:quarto_id>/', DeleteRoom.as_view(), name='delete_room'),
    path('owner/update/room/availability/<int:quarto_id>/', UpdateRoomAvailability.as_view(), name='update_room_availability'),
]

