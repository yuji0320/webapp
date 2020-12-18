from .views import *
from rest_framework import routers


routeList = (
    (r'inventory_master', InventoryMasterAPIView),
    (r'location_master', LocationMasterAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
