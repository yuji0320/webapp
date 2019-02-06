from rest_framework import serializers
from .models import *


class JobOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobOrder
        fields = (
            'id',
            'company',
            'mfg_no',
            'name',
            'publisher',
            'designer',
            'customer',
            'delivery_destination',
            'order_currency',
            'order_rate',
            'order_price',
            'tax_percent',
            'order_date',
            'delivery_date',
            'completion_date',
            'notes',
            'commercial_parts_budget',
            'electrical_parts_budget',
            'processed_parts_budget',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by'
        )
