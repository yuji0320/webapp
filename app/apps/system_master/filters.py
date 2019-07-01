from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *


class SystemCountryFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = SystemCountry
        fields = ['id', 'name']


class SystemUnitTypeFilter(filters.FilterSet):

    class Meta:
        model = SystemUnitType
        fields = ['id', 'number', 'name']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
            ('number', 'number'),
        ),
    )


class SystemExpenseCategoryFilter(filters.FilterSet):

    class Meta:
        model = SystemExpenseCategory
        fields = ['id', 'category_name', 'category_number', 'is_active']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('category_name', 'category_name'),
            ('category_number', 'category_number'),
        ),
    )


class SystemFailureCategoryFilter(filters.FilterSet):
    incremental_field = filters.CharFilter(field_name='incrementalFilter', method='incremental_filter')

    @staticmethod
    def incremental_filter(queryset, name, value):
        return queryset.all().filter(
            Q(category_number__icontains=value) | Q(category_name__icontains=value)
        )

    class Meta:
        model = SystemFailureCategory
        fields = ['id', 'category_name', 'category_number', 'is_active', 'incremental_field']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('category_name', 'category_name'),
            ('category_number', 'category_number'),
        ),
    )


class SystemWorkTypeFilter(filters.FilterSet):
    incremental_field = filters.CharFilter(field_name='incrementalFilter', method='incremental_filter')

    @staticmethod
    def incremental_filter(queryset, name, value):
        return queryset.all().filter(
            Q(number__icontains=value) | Q(name__icontains=value)
        )

    class Meta:
        model = SystemWorkType
        fields = ['id', 'name', 'number', 'is_calculate', 'incremental_field']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
            ('number', 'number'),
        ),
    )
