from django.contrib import admin
from .models import *


class AdminJobOrder(admin.ModelAdmin):
    list_display = ('mfg_no', 'name', 'created_at', 'modified_at')


# class AdminJobBudget(admin.ModelAdmin):
#     list_display = ('budget_price', 'created_at', 'modified_at')


admin.site.register(JobOrder, AdminJobOrder)
# admin.site.register(JobBudget)
