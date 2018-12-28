from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from .models import *
from .forms import UserChangeForm, UserCreationForm
from django.utils.translation import gettext_lazy as _

# Register your models here.


class AdminUserStaff(admin.ModelAdmin):
    list_display = ('full_name', 'company', 'created_at', 'modified_at')


class MyUserAdmin(auth_admin.UserAdmin):
    fieldsets = (
        (None, {
            'fields': ('username', 'password', 'staff')
        }),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'staff')}
         ),
    )
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = auth_admin.AdminPasswordChangeForm
    list_display = ('username', 'get_staff', 'is_staff')

    def get_staff(self, obj):
        return obj.staff.full_name

    get_staff.short_description = 'Staff name'


admin.site.register(UserCompany)
admin.site.register(UserStaff, AdminUserStaff)
admin.site.register(User, MyUserAdmin)
admin.site.register(UserPartner)
