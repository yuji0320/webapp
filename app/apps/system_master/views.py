from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializer import *
from .filters import SystemExpenseCategoryFilter, SystemFailureCategoryFilter


class SystemCountryFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = SystemCountry
        fields = ['id', 'name']


class SystemCountryAPIView(viewsets.ModelViewSet):
    # permission_classes = (
    #     IsAuthenticated,
    # )
    serializer_class = SystemCountrySerializer
    queryset = SystemCountry.objects.all()
    filter_class = SystemCountryFilter


class SystemCurrencyAPIView(viewsets.ModelViewSet):
    # permission_classes = (
    #     IsAuthenticated,
    # )
    serializer_class = SystemCurrencySerializer
    queryset = SystemCurrency.objects.all()


class SystemUnitTypeAPIView(viewsets.ModelViewSet):
    # permission_classes = (
    #     IsAuthenticated,
    # )
    serializer_class = SystemUnitTypeSerializer
    queryset = SystemUnitType.objects.all()


class SystemExpenseCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = SystemExpenseCategorySerializer
    queryset = SystemExpenseCategory.objects.all()
    filter_class = SystemExpenseCategoryFilter


class SystemFailureCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = SystemFailureCategorySerializer
    queryset = SystemFailureCategory.objects.all()
    filter_class = SystemFailureCategoryFilter
