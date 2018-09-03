# from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from .models import *


class UserCopmanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCopmany
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
            'is_staff',
            'created_at',
            'modified_at',
        )


# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=False, required=False)
#
#     class Meta:
#         model = User
#         fields = (
#             'id',
#             'username',
#             'password',
#             'is_active',
#             'created_at',
#             'modified_at'
#         )
#
#     def create(self, validated_data):
#         return User.objects.create_user(request_data=validated_data)
