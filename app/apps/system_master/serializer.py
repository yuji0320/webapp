from rest_framework import serializers
from .models import *


class SystemCountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCountry
        fields = ('__all__')


class SystemCurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCurrency
        fields = ('__all__')


class SystemUnitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUnitType
        fields = ('__all__')
