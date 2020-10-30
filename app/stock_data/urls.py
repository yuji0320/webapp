from .views import *
from rest_framework import routers


routeList = (
    # (r'parts_search', PartsSearchAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
