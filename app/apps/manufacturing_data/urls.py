from .views import *
from rest_framework import routers


routeList = (
    (r'job_order', JobOrderAPIView),
    (r'bill_of_material', BillOfMaterialAPIView),
    (r'making_order', MakingOrderAPIView),
    (r'receiving_process', ReceivingProcessAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
