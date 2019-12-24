from rest_framework import serializers
from .models import *


class UserCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCompany
        fields = '__all__'


class UserStaffSerializer(serializers.ModelSerializer):
    login_user = serializers.SerializerMethodField()
    incremental_field = serializers.SerializerMethodField()

    class Meta:
        model = UserStaff
        fields = '__all__'
        # idの読み込み専用をオフ
        # extra_kwargs = {'id': {'read_only': False}}

    @staticmethod
    def get_login_user(obj):
        login_user = User.objects.all().filter(staff=obj.id)

        if login_user:
            username = login_user.values('username')[0]['username']
            return username
        else:
            return False

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.staff_number) + " : " + obj.ruby + "(" + obj.full_name + ")"
        return search_field


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=False, required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = User
        # fields = ('id', 'username', 'staff', 'is_staff', 'is_active', 'password')
        fields = '__all__'

    def create(self, validated_data):
        return User.objects.create_user(request_data=validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        else:
            instance = super().update(instance, validated_data)
        instance.save()
        return instance


class UserPartnerSerializer(serializers.ModelSerializer):
    incremental_field = serializers.SerializerMethodField()

    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.partner_number) + " : " + obj.abbr + "(" + obj.name + ")"
        return search_field

    class Meta:
        model = UserPartner
        fields = '__all__'


class PasswordSerializer(serializers.Serializer):

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


# class UserExpenseCategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserExpenseCategory
#         fields = '__all__'
#
#
# class UserFailureCategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserFailureCategory
#         fields = '__all__'
