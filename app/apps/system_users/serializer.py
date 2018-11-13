from rest_framework import serializers
from .models import *


class UserCopmanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCompany
        fields = (
            'id',
            'country',
            'name',
            'postal_code',
            'address',
            'phone',
            'fax',
            'default_currency',
            'created_at',
            'modified_at'
        )


class UserStaffSerializer(serializers.ModelSerializer):
    login_user = serializers.SerializerMethodField()

    class Meta:
        model = UserStaff
        fields = (
            'id',
            'company',
            'staff_number',
            'full_name',
            'ruby',
            'mobile',
            'email',
            'postal_code',
            'address',
            'date_birth',
            'date_joined',
            'date_left',
            'is_login_user',
            'created_at',
            'modified_at',
            'login_user'
        )

    @staticmethod
    def get_login_user(obj):
        login_user = User.objects.all().filter(id=obj.id)

        if login_user:
            username = login_user.values('username')[0]['username']
            return username
        else:
            return False


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=False, required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'staff',
            'username',
            'password',
            'is_active',
            'is_staff',
            'created_at',
            'modified_at',
        )

    def create(self, validated_data):
        return User.objects.create_user(request_data=validated_data)
