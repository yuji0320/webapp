from rest_framework import serializers
from .models import *


class SystemCountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemCountry
        fields = '__all__'


class SystemCurrencySerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.code) + ": " + obj.name
        return search_field

    class Meta:
        model = SystemCurrency
        fields = '__all__'


class SystemUnitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUnitType
        fields = '__all__'


class SystemExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemExpenseCategory
        fields = '__all__'


class SystemFailureCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemFailureCategory
        fields = '__all__'
