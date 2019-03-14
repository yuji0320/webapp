from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *


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

    class Meta:
        model = SystemFailureCategory
        fields = ['id', 'category_name', 'category_number', 'is_active']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('category_name', 'category_name'),
            ('category_number', 'category_number'),
        ),
    )
