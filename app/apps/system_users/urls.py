from .views import *
from rest_framework import routers


routeList = (
    (r'user_companies', UserCopmanyAPIView),
    (r'user_staffs', UserStaffAPIView),
    (r'users', UserAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])