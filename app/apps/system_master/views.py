from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializer import *


class SystemCountryAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = SystemCountrySerializer
    queryset = SystemCountry.objects.all()


class SystemCurrencyAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = SystemCurrencySerializer
    queryset = SystemCurrency.objects.all()


class SystemUnitTypeAPIView(viewsets.ModelViewSet):
    permission_classes = (
        IsAuthenticated,
    )
    serializer_class = SystemUnitTypeSerializer
    queryset = SystemUnitType.objects.all()
