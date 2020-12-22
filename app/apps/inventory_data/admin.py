from django.contrib import admin
from .models import *

class AdminInventoryMaster(admin.ModelAdmin):
    list_display = ('name', 'manufacturer', 'standard', 'material', 'notes', 'created_at', 'modified_at')
    search_fields = ('name',)


class AdminLocationMaster(admin.ModelAdmin):
    list_display = ('number', 'name', 'notes', 'created_at', 'modified_at')
    search_fields = ('name',)


class AdminInStockParts(admin.ModelAdmin):
    list_display = ('id', 'inventory_master', 'amount', 'created_at', 'modified_at')
    search_fields = ('inventory_master',)

admin.site.register(InventoryMaster, AdminInventoryMaster)
admin.site.register(LocationMaster, AdminLocationMaster)
admin.site.register(InStockParts, AdminInStockParts)
