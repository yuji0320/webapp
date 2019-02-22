from django_filters import rest_framework as filters
from .models import *


class JobOrderFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    mfg_no = filters.CharFilter(field_name='mfg_no', lookup_expr='icontains')

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
