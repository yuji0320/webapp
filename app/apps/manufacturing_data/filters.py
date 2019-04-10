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

    class Meta:
        model = MakingOrder
        fields = [
            'id', 'company', 'bill_of_material', 'bill_of_material__job_order', 'bill_of_material__type', 'name',
            "standard", "is_printed"
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
        ),
    )
