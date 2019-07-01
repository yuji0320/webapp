from django.contrib import admin
from .models import *


class AdminSystemUnitType(admin.ModelAdmin):
    list_display = ('number', 'name', 'display', 'created_at', 'modified_at')


class AdminSystemExpenseCategory(admin.ModelAdmin):
    list_display = ('category_name', 'category_number', 'created_at', 'modified_at')


class AdminSystemFailureCategory(admin.ModelAdmin):
    list_display = ('category_name', 'category_number', 'created_at', 'modified_at')


class AdminSystemWorkType(admin.ModelAdmin):
    list_display = ('name', 'number', 'is_calculate', 'created_at', 'modified_at')


admin.site.register(SystemCountry)
admin.site.register(SystemCurrency)
admin.site.register(SystemUnitType, AdminSystemUnitType)
admin.site.register(SystemExpenseCategory, AdminSystemExpenseCategory),
admin.site.register(SystemFailureCategory, AdminSystemFailureCategory),
admin.site.register(SystemWorkType, AdminSystemWorkType)
