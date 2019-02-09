import decimal
from rest_framework import serializers
from .models import *


class JobOrderSerializer(serializers.ModelSerializer):
    default_currency_order_amount = serializers.SerializerMethodField('get_dcom')

    # デフォルト通貨での受注価格計算
    @staticmethod
    def get_dcom(obj):
        order_price = obj.order_price * decimal.Decimal(float(obj.order_rate))
        return "%.2f" % order_price

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
            'default_currency_order_amount',  # read_only
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
            'modified_by',
        )
        read_only_fields = ('default_currency_order_amount',)
