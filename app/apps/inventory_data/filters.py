from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *
from django.db.models import F, Sum


class InventoryMasterFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    standard = filters.CharFilter(field_name='standard', lookup_expr='icontains')
    material = filters.CharFilter(field_name='material', lookup_expr='icontains')
    notes = filters.CharFilter(field_name='notes', lookup_expr='icontains')

    class Meta:
        model = InventoryMaster
        fields = [
            'id', 'company', 'name', 'manufacturer', 'standard', 'material', 'notes', 'is_standard_inventory', 'is_disabled',
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


class LocationMasterFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    notes = filters.CharFilter(field_name='notes', lookup_expr='icontains')

    class Meta:
        model = LocationMaster
        fields = [
            'id', 'company', 'name', 'number', 'notes', 'is_disabled',
        ]

    order_by = filters.OrderingFilter(
        choices=(
            ('created_at', 'created_at'),
            ('-created_at', '-created_at'),
            ('modified_at', 'modified_at'),
            ('-modified_at', '-modified_at'),
            ('name', 'name'),
            ('-name', '-name'),
            ('number', 'number'),
            ('-number', '-number'),
        )
    )


class InStockPartsFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='inventory_master__name', lookup_expr='icontains')
    standard = filters.CharFilter(field_name='inventory_master__standard', lookup_expr='icontains')
    has_stock = filters.NumberFilter(field_name='amount', lookup_expr='gt')

    class Meta:
        model = InStockParts
        fields = [
            'id', 'inventory_master', 'amount', 'location', 'name', 'standard',
        ]

    order_by = filters.OrderingFilter(
        choices=(
            ('created_at', 'created_at'),
            ('-created_at', '-created_at'),
            ('modified_at', 'modified_at'),
            ('-modified_at', '-modified_at'),
        )
    )