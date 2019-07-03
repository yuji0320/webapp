from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *


class JobOrderFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    mfg_no = filters.CharFilter(field_name='mfg_no', lookup_expr='icontains')
    incremental_field = filters.CharFilter(field_name='incrementalFilter', method='incremental_filter')
    related_party_mfg_no = filters.CharFilter(field_name='related_party_mfg_no', lookup_expr='icontains')
    completion_date = filters.DateFromToRangeFilter(field_name='completion_date')

    @staticmethod
    def incremental_filter(queryset, name, value):
        return queryset.all().filter(
            Q(mfg_no__icontains=value) | Q(name__icontains=value)
        )

    class Meta:
        model = JobOrder
        fields = ['id', 'company', 'name', 'mfg_no', 'related_party_mfg_no', 'completion_date', ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
            ('mfg_no', 'mfg_no'),
            ('customer__name', 'customer__name'),
            ('completion_date', 'completion_date'),
        ),
    )


class BillOfMaterialFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    standard = filters.CharFilter(field_name='standard', lookup_expr='icontains')
    parts_data = filters.CharFilter(field_name='partsData', method='parts_data_filter')

    @staticmethod
    def parts_data_filter(queryset, name, value):
        return queryset.all().filter(
            Q(standard__icontains=value) | Q(drawing_number__icontains=value)
        )

    class Meta:
        model = BillOfMaterial
        fields = ['id', 'company', 'job_order', 'type', 'name', 'manufacturer', "standard", "is_printed", "parts_data",
                  'type__is_processed_parts', ]

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
    no_bom = filters.BooleanFilter(field_name='bill_of_material', lookup_expr='isnull')

    class Meta:
        model = MakingOrder
        fields = [
            'id', 'number', 'company', 'bill_of_material', 'bill_of_material__job_order', 'bill_of_material__type',
            'name', 'standard', 'is_printed', 'supplier', 'no_supplier', 'unit_price', 'no_bom',
            'bill_of_material__type__is_processed_parts'
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('unit_price', 'unit_price'),
            ('number', 'number'),
            ('name', 'name'),
            ('desired_delivery_date', 'desired_delivery_date')
        ),
    )


class ReceivingProcessFilter(filters.FilterSet):
    desired_delivery_date = filters.DateFromToRangeFilter(field_name='order__desired_delivery_date')
    name = filters.CharFilter(field_name='order__name', lookup_expr='icontains')
    no_bom = filters.BooleanFilter(field_name='order__bill_of_material', lookup_expr='isnull')
    is_suspense_received = filters.BooleanFilter(field_name='suspense_received_date', lookup_expr='isnull')

    class Meta:
        model = ReceivingProcess
        fields = [
            'id', 'order__number', 'order__company', 'order__bill_of_material', 'order__bill_of_material__job_order',
            'order__bill_of_material__type', 'is_received', 'order__supplier', 'unit_price', 'desired_delivery_date',
            'name', 'suspense_received_date', 'is_suspense_received',
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('modified_at', 'modified_at'),
            ('order__number', 'order__number'),
            ('order__desired_delivery_date', 'order__desired_delivery_date'),
        ),
    )


class ManHourFilter(filters.FilterSet):
    work_date_range = filters.DateFromToRangeFilter(field_name='date')
    name = filters.CharFilter(field_name='staff__full_name', lookup_expr='icontains')
    mfg_no = filters.CharFilter(field_name='job_order__mfg_no', lookup_expr='icontains')
    date_icontains = filters.CharFilter(field_name='date', lookup_expr='icontains')

    class Meta:
        model = ManHour
        fields = [
            'id', 'job_order', 'staff', 'type', 'date', 'failure', 'work_date_range', 'name', 'mfg_no', 'date_icontains'
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('modified_at', 'modified_at'),
            ('date', 'date'),
        ),
    )


class PartsSearchFilter(filters.FilterSet):

    class Meta:
        model = BillOfMaterial
        fields = [
            'company', 'job_order', 'manufacturer', 'standard', 'drawing_number', 'type'
        ]

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('modified_at', 'modified_at'),
            ('date', 'date'),
        ),
    )
