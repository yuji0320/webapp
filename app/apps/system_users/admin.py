from django.contrib import admin
from .models import *
# from django.contrib.auth.admin import UserAdmin

# Register your models here.

admin.site.register(UserCopmany)
admin.site.register(UserStaff)

# class AdminUserAdmin(UserAdmin):
#     fieldsets = (
#         (None, {'fields': ('username', 'password')}),
#     )
#
#
# admin.site.register(User, AdminUserAdmin)
