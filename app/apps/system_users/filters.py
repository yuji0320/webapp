from django.db.models import Q
from django_filters import rest_framework as filters
from .models import *


class UserCompanyFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = UserCompany
        fields = ['id', 'name']

    order_by = filters.OrderingFilter(
        fields=(
            ('name', 'name'),
            ('created_at', 'created_at'),
        ),
    )


class UserStaffFilter(filters.FilterSet):
    fullName = filters.CharFilter(field_name='full_name', lookup_expr='icontains')
    ruby = filters.CharFilter(lookup_expr='icontains')
    staffNumber = filters.CharFilter(field_name='staff_number', lookup_expr='contains')
    incremental_field = filters.CharFilter(field_name='incrementalFilter', method='incremental_filter')
    is_tenure = filters.BooleanFilter(field_name='is_retired_filter', method='is_tenure_filter')
    date_left = filters.CharFilter(method='date_left_filter')

    @staticmethod
    def incremental_filter(queryset, name, value):
        return queryset.all().filter(
            Q(ruby__icontains=value) | Q(staff_number__icontains=value) | Q(full_name__icontains=value)
        )

    @staticmethod
    def is_tenure_filter(queryset, name, value):
        return queryset.all().filter(date_left__isnull=value)

    @staticmethod
    def date_left_filter(queryset, name, value):
        return queryset.all().filter(
            Q(date_left__isnull=True) | Q(date_left__gte=value)
        )

    class Meta:
        model = UserStaff
        fields = ['id', 'company', 'is_login_user', 'staffNumber', 'is_tenure', 'date_left']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('full_name', 'full_name'),
            ('staff_number', 'staff_number'),
            ('ruby', 'ruby'),
        ),
    )


class UserPartnerFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    abbr = filters.CharFilter(lookup_expr='icontains')
    partnerNumber = filters.CharFilter(field_name='partner_number', lookup_expr='contains')
    incremental_field = filters.CharFilter(field_name='incrementalFilter', method='incremental_filter')

    @staticmethod
    def incremental_filter(queryset, name, value):
        return queryset.all().filter(
            Q(abbr__icontains=value) | Q(partner_number__icontains=value) | Q(name__icontains=value)
        )

    class Meta:
        model = UserPartner
        fields = ['id', 'company', 'name', 'partnerNumber', 'is_customer', 'is_delivery_destination', 'is_supplier',
                  'is_manufacturer', 'abbr']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
            ('partner_number', 'partner_number'),
        ),
    )
