from rest_framework import serializers
from .models import *


class UserCopmanySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCompany
        fields = '__all__'


class UserStaffSerializer(serializers.ModelSerializer):
    login_user = serializers.SerializerMethodField()

    class Meta:
        model = UserStaff
        fields = '__all__'

    @staticmethod
    def get_login_user(obj):
        login_user = User.objects.all().filter(staff=obj.id)

        if login_user:
            username = login_user.values('username')[0]['username']
            return username
        else:
            return False


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=False, required=False)

    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        return User.objects.create_user(request_data=validated_data)


class UserPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPartner
        fields = '__all__'


class UserExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExpenseCategory
        fields = '__all__'
