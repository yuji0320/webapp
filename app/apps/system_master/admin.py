from django.contrib import admin
from .models import *


class AdminSystemUnitType(admin.ModelAdmin):
    list_display = ('number', 'name', 'display', 'created_at', 'modified_at')


admin.site.register(SystemCountry)
admin.site.register(SystemCurrency)
admin.site.register(SystemUnitType, AdminSystemUnitType)
