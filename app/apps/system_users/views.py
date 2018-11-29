from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializer import *


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
    fullName = filters.CharFilter(field_name='full_name', lookup_expr='contains')
    ruby = filters.CharFilter(lookup_expr='contains')
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


class UserCopmanyAPIView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserCopmanySerializer
    queryset = UserCompany.objects.all()
    filter_class = UserCompanyFilter


class UserStaffAPIView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserStaffSerializer
    queryset = UserStaff.objects.all()
    filter_class = UserStaffFilter

    def get_queryset(self):
        user = self.request.user
        queryset = UserStaff.objects.all()
        if user.is_superuser:
            return queryset
        else:
            return queryset.filter(company=user.staff.company.id)


class UserAPIView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return User.objects.all()
        else:
            return User.objects.all().filter(staff__company=user.staff.company)

    # ユーザー情報の確認用API
    @action(methods=['get'], detail=False)
    def login_user_data(self, request):
        user = self.request.user

        return Response(data={
            'id': user.id,
            'username': user.username,
            'fullname': user.staff.full_name,
            'company_name': user.staff.company.name,
            'company_id': user.staff.company.id,
        })
