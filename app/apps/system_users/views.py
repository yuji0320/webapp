from django.http import Http404
from rest_framework import viewsets
from rest_framework import status
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializer import *
from .filters import UserCompanyFilter, UserStaffFilter, UserPartnerFilter


class UserCompanySerializer(viewsets.ModelViewSet):
    serializer_class = UserCompanySerializer
    queryset = (
        UserCompany.objects.select_related(
            'country',
        )
    )
    filter_class = UserCompanyFilter


class UserStaffAPIView(viewsets.ModelViewSet):
    serializer_class = UserStaffSerializer
    queryset = (
        UserStaff.objects.select_related(
            'company', 'default_currency'
        )
    )
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
            'default_currency_display': user.staff.company.default_currency.display,
            'default_currency_id': user.staff.company.default_currency.id,
            'staff_id': user.staff.id
        })

    @action(methods=['put'], detail=False)
    def set_password(self, request):
        serializer = PasswordSerializer(data=request.data)
        user = self.request.user

        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({'old_password': ['Wrong password.']},
                                status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'status': 'password set'}, status=status.HTTP_200_OK)

        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


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


# class UserExpenseCategoryAPIView(viewsets.ModelViewSet):
#     serializer_class = UserExpenseCategorySerializer
#     queryset = UserExpenseCategory.objects.all()
#     filter_class = UserExpenseCategoryFilter
#
#
# class UserFailureCategoryAPIView(viewsets.ModelViewSet):
#     serializer_class = UserFailureCategorySerializer
#     queryset = UserFailureCategory.objects.all()
