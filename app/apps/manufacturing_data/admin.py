from django.contrib import admin
from .models import *


class AdminJobOrder(admin.ModelAdmin):
    list_display = ('mfg_no', 'name', 'created_at', 'modified_at')


class AdminBillOfMaterial(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'modified_at')


class AdminMakingOrder(admin.ModelAdmin):
    list_display = ('number', 'name', 'created_at', 'modified_at')


class AdminReceivingProcess(admin.ModelAdmin):
    list_display = ('order', 'created_at', 'modified_at')


admin.site.register(JobOrder, AdminJobOrder)
admin.site.register(BillOfMaterial, AdminBillOfMaterial)
admin.site.register(MakingOrder, AdminMakingOrder)
admin.site.register(ReceivingProcess, AdminReceivingProcess)
