# from requests import Response
from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticated
from core.multi_crud import multi_create
from .serializer import *
from .filters import *


class SystemCountryAPIView(viewsets.ModelViewSet):
    # permission_classes = IsAuthenticated
    queryset = SystemCountry.objects.all()
    serializer_class = SystemCountrySerializer
    filter_class = SystemCountryFilter

    @multi_create(serializer_class=SystemCountrySerializer)
    def create(self, request, **kwargs):
        pass

    # @multi_update(serializer_class=SystemCountrySerializer)
    # def put(self, request, pk=None, *args, **kwargs):
    #     pass


class SystemCurrencyAPIView(viewsets.ModelViewSet):
    # permission_classes = IsAuthenticated

    serializer_class = SystemCurrencySerializer
    queryset = SystemCurrency.objects.all()


class SystemUnitTypeAPIView(viewsets.ModelViewSet):
    # permission_classes = IsAuthenticated
    serializer_class = SystemUnitTypeSerializer
    queryset = SystemUnitType.objects.all()
    filter_class = SystemUnitTypeFilter


class SystemExpenseCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = SystemExpenseCategorySerializer
    queryset = SystemExpenseCategory.objects.all()
    filter_class = SystemExpenseCategoryFilter


class SystemFailureCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = SystemFailureCategorySerializer
    queryset = SystemFailureCategory.objects.all()
    filter_class = SystemFailureCategoryFilter
