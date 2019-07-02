from rest_framework import serializers
from .models import *


class SystemCountrySerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)

    class Meta:
        model = SystemCountry
        fields = '__all__'


class SystemCurrencySerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.code) + " : " + obj.name
        return search_field

    class Meta:
        model = SystemCurrency
        fields = '__all__'


class SystemUnitTypeSerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.number) + " : " + obj.display + "(" + obj.name + ")"
        return search_field

    class Meta:
        model = SystemUnitType
        fields = '__all__'


class SystemExpenseCategorySerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.category_number) + " : " + obj.category_name
        return search_field

    class Meta:
        model = SystemExpenseCategory
        fields = '__all__'


class SystemFailureCategorySerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.category_number) + " : " + obj.category_name
        return search_field

    class Meta:
        model = SystemFailureCategory
        fields = '__all__'


class SystemJobTypeSerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.number) + " : " + obj.name
        return search_field

    class Meta:
        model = SystemJobType
        fields = '__all__'
