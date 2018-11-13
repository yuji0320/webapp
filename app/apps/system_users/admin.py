from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

# Register your models here.


class AdminUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
    )

    list_display = ('username', 'get_staff', 'is_staff')

    def get_staff(self, obj):
        return obj.staff.full_name
    get_staff.short_description = 'Staff name'


admin.site.register(UserCompany)
admin.site.register(UserStaff)
admin.site.register(User, AdminUserAdmin)
