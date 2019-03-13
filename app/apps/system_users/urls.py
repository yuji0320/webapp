from .views import *
from rest_framework import routers


routeList = (
    (r'user_companies', UserCompanySerializer),
    (r'user_staffs', UserStaffAPIView),
    (r'users', UserAPIView),
    (r'user_partners', UserPartnerAPIView),
    (r'user_expense_category', UserExpenseCategoryAPIView),
    (r'user_failure_category', UserFailureCategoryAPIView),
)

router = routers.DefaultRouter()
for route in routeList:
    router.register(route[0], route[1])
