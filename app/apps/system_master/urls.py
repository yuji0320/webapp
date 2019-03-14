from .views import *
from rest_framework import routers


routeList = (
    (r'countries', SystemCountryAPIView),
    (r'currencies', SystemCurrencyAPIView),
    (r'unit_types', SystemUnitTypeAPIView),
    (r'expense_categories', SystemExpenseCategoryAPIView),
    (r'failure_category', SystemFailureCategoryAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
