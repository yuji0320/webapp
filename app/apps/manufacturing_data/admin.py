from django.contrib import admin
from .models import *


class AdminJobOrder(admin.ModelAdmin):
    list_display = ('mfg_no', 'name', 'created_at', 'modified_at')


class AdminBillOfMaterial(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'modified_at')


class AdminMakingOrder(admin.ModelAdmin):
    list_display = ('number', 'name', 'created_at', 'modified_at')
    search_fields = ('number',)


class AdminReceivingProcess(admin.ModelAdmin):
    list_display = ('get_number', 'order', 'created_at', 'modified_at')
    list_filter = ('is_received', 'created_at', 'modified_at')
    search_fields = ('order__number',)

    @staticmethod
    def get_number(obj):
        return obj.order.number
    get_number.short_description = 'Number'
    get_number.admin_order_field = 'order__number'


class AdminManHour(admin.ModelAdmin):
    list_display = ('job_order', 'staff', 'work_hour', 'date', 'created_at', 'modified_at')
    search_fields = ('number',)


admin.site.register(JobOrder, AdminJobOrder)
admin.site.register(BillOfMaterial, AdminBillOfMaterial)
admin.site.register(MakingOrder, AdminMakingOrder)
admin.site.register(ReceivingProcess, AdminReceivingProcess)
admin.site.register(ManHour, AdminManHour)
