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

    class Meta:
        model = UserStaff
        fields = ['id', 'company', 'is_login_user', 'staffNumber']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('full_name', 'full_name'),
            ('staff_number', 'staff_number'),
        ),
    )


class UserPartnerFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    abbr = filters.CharFilter(lookup_expr='icontains')
    partnerNumber = filters.CharFilter(field_name='partner_number', lookup_expr='contains')

    class Meta:
        model = UserPartner
        fields = ['id', 'company', 'name', 'partnerNumber', 'is_customer', 'is_delivery_destination', 'is_supplier',
                  'is_manufacturer']

    order_by = filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('name', 'name'),
            ('partner_number', 'partner_number'),
        ),
    )
