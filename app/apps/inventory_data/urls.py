from .views import *
from rest_framework import routers


routeList = (
    (r'inventory_master', InventoryMasterAPIView),
    (r'location_master', LocationMasterAPIView),
    (r'in_stock_parts', InStockPartsAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
