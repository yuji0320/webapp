from .views import *
from rest_framework import routers


routeList = (
    (r'inventory_master', InventoryMasterAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
