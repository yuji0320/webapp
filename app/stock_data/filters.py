from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *


class InventoryMasterFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    standard = filters.CharFilter(field_name='standard', lookup_expr='icontains')
    material = filters.CharFilter(field_name='material', lookup_expr='icontains')
    notes = filters.CharFilter(field_name='notes', lookup_expr='icontains')

    class Meta:
        model = InventoryMaster
        fields = [
            'id', 'name', 'manufacturer', 'standard', 'material', 'notes', 'is_standard_inventory', 'is_disabled',
        ]

    order_by = filters.OrderingFilter(
        choices=(
            ('created_at', 'created_at'),
            ('-created_at', '-created_at'),
            ('modified_at', 'modified_at'),
            ('-modified_at', '-modified_at'),
            ('name', 'name'),
            ('-name', '-name'),
            ('manufacturer__name', 'manufacturer__name'),
            ('-manufacturer__name', '-manufacturer__name'),
            ('standard', 'standard'),
            ('-standard', '-standard'),
            ('drawing_number', 'drawing_number'),
            ('-drawing_number', '-drawing_number'),
        )
    )