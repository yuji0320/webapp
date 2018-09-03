from rest_framework import serializers
from .models import *


class SystemCountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCountry
        fields = (
            'id',
            'name',
            'code',
            'created_at',
            'modified_at'
        )


class SystemCurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCurrency
        fields = (
            'id',
            'name',
            'code',
            'display',
            'decimal_point',
            'created_at',
            'modified_at'
        )


class SystemUnitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUnitType
        fields = (
            'id',
            'name',
            'display',
            'created_at',
            'modified_at'
        )
