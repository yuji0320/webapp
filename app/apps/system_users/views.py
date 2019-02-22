from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializer import *
from .filters import UserCompanyFilter, UserStaffFilter, UserPartnerFilter


class UserCompanySerializer(viewsets.ModelViewSet):
    serializer_class = UserCompanySerializer
    queryset = UserCompany.objects.all()
    filter_class = UserCompanyFilter


class UserStaffAPIView(viewsets.ModelViewSet):
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
            'default_currency_code': user.staff.company.default_currency.code,
            'default_currency_display': user.staff.company.default_currency.display
        })


class UserPartnerAPIView(viewsets.ModelViewSet):
    serializer_class = UserPartnerSerializer
    queryset = UserPartner.objects.all()
    filter_class = UserPartnerFilter

    def get_queryset(self):
        user = self.request.user
        queryset = UserPartner.objects.all()
        if user.is_superuser:
            return queryset
        else:
            return queryset.filter(company=user.staff.company.id)


class UserExpenseCategoryAPIView(viewsets.ModelViewSet):
    serializer_class = UserExpenseCategorySerializer
    queryset = UserExpenseCategory.objects.all()
