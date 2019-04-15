from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *


class JobOrderFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    mfg_no = filters.CharFilter(field_name='mfg_no', lookup_expr='icontains')
    incremental_field = filters.CharFilter(field_name='incrementalFilter', method='incremental_filter')

    @staticmethod
    def incremental_filter(queryset, name, value):
        return queryset.all().filter(
            Q(mfg_no__icontains=value) | Q(name__icontains=value)
        )

    class Meta:
        model = JobOrder
        fields = ['id', 'company', 'name', 'mfg_no', ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
            ('mfg_no', 'mfg_no'),
        ),
    )


class BillOfMaterialFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    standard = filters.CharFilter(field_name='standard', lookup_expr='icontains')

    class Meta:
        model = BillOfMaterial
        fields = ['id', 'company', 'job_order', 'type', 'name', "standard", "is_printed"]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
        ),
    )


class MakingOrderFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    standard = filters.CharFilter(field_name='standard', lookup_expr='icontains')
    no_supplier = filters.BooleanFilter(field_name='supplier', lookup_expr='isnull')

    class Meta:
        model = MakingOrder
        fields = [
            'id', 'number', 'company', 'bill_of_material', 'bill_of_material__job_order', 'bill_of_material__type',
            'name', 'standard', 'is_printed', 'supplier', 'no_supplier', 'unit_price'
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('unit_price', 'unit_price'),
            ('number', 'number'),
            ('name', 'name'),
        ),
    )


class ReceivingProcessFilter(filters.FilterSet):

    class Meta:
        model = ReceivingProcess
        fields = [
            'id', 'order__number', 'order__company', 'order__bill_of_material', 'order__bill_of_material__job_order',
            'order__bill_of_material__type', 'is_received', 'order__supplier', 'unit_price'
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('order__number', 'order__number'),
        ),
    )
