from .views import *
from rest_framework import routers


routeList = (
    (r'job_order', JobOrderAPIView),
    (r'bill_of_material', BillOfMaterialAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
