import decimal
from .models import *
from system_users.serializer import *
from system_master.serializer import *


# 作業指図書
class JobOrderSerializer(serializers.ModelSerializer):
    default_currency_order_amount = serializers.SerializerMethodField()
    costs = serializers.SerializerMethodField()
    publisher_data = UserStaffSerializer(source='publisher', read_only=True)
    designer_data = UserStaffSerializer(source='designer', read_only=True)
    customer_data = UserPartnerSerializer(source='customer', read_only=True)
    delivery_destination_data = UserPartnerSerializer(source='delivery_destination', read_only=True)
    order_currency_data = SystemCurrencySerializer(source='order_currency', read_only=True)
    incremental_field = serializers.SerializerMethodField()

    # デフォルト通貨での受注価格計算
    @staticmethod
    def get_default_currency_order_amount(obj):
        order_price = obj.order_price * decimal.Decimal(float(obj.order_rate))
        return "{:,.2f}".format(order_price)

    # 予算金額の計算
    @staticmethod
    def get_costs(obj):
        # 受注金額レート換算
        order_price = obj.order_price * decimal.Decimal(float(obj.order_rate))
        # 税額計算
        tax_price = order_price * obj.tax_percent / 100
        # 受注金額合計
        order_total = order_price + tax_price
        # 予算直接原価
        direct_cost_budget = obj.commercial_parts_budget + obj.electrical_parts_budget + obj.processed_parts_budget
        limit_profit_budget = order_price - direct_cost_budget
        if limit_profit_budget > 0:
            # 限界利益が正の場合
            limit_profit_percentage = limit_profit_budget / order_price * 100
        elif limit_profit_budget == 0:
            # 限界利益がゼロの場合
            limit_profit_percentage = 0
        else:
            # 限界利益が負の場合
            limit_profit_percentage = (direct_cost_budget - order_price) / order_price * -100

        costs = {
            'tax_price': "{:,.2f}".format(tax_price),
            'order_total': "{:,.2f}".format(order_total),
            'direct_cost_budget': "{:,.2f}".format(direct_cost_budget),
            'limit_profit_budget': "{:,.2f}".format(limit_profit_budget),
            'limit_profit_percentage_budget': "{:-,.2f}".format(limit_profit_percentage),
        }
        return costs

    # 頭出し検索用フィールド
    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.mfg_no) + ": " + obj.name
        return search_field

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
            'modified_by',
            # read_only under here
            'default_currency_order_amount',
            'costs',
            'publisher_data',
            'designer_data',
            'customer_data',
            'delivery_destination_data',
            'order_currency_data',
            'incremental_field',
        )

        # read_only_fields = (
        #     'default_currency_order_amount',
        #     'costs',
        #     'publisher_data',
        #     'customer_data',
        #     'delivery_destination_data',
        # )
        #
        # def update(self, instance, validated_data):
        #     instance.order_price = validated_data.get('order_price', instance.order_price).replace(',', '')
        #     return instance


# 部品表
class BillOfMaterialSerializer(serializers.ModelSerializer):
    default_currency_price = serializers.SerializerMethodField()
    total_default_currency_price = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    manufacturer_data = UserPartnerSerializer(source='manufacturer', read_only=True)

    # デフォルト通貨での単価計算
    @staticmethod
    def get_default_currency_price(obj):
        display_price = obj.unit_price * decimal.Decimal(float(obj.rate))
        return "{:,.2f}".format(display_price)

    # デフォルト通貨での合計価格計算
    @staticmethod
    def get_total_default_currency_price(obj):
        total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        return round(total_price, 2)

    # 表示用単価作成
    @staticmethod
    def get_display_price(obj):
        display_price = obj.currency.display + ' ' + "{:,.2f}".format(obj.unit_price)
        return display_price

    class Meta:
        model = BillOfMaterial
        fields = (
            'id',
            'company',
            'job_order',
            'type',
            'name',
            'manufacturer',
            'standard',
            'unit_number',
            'drawing_number',
            'material',
            'surface_treatment',
            'amount',
            'stock_appropriation',
            'unit',
            'currency',
            'rate',
            'unit_price',
            'desired_delivery_date',
            'failure',
            'is_customer_supplied',
            'is_printed',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'default_currency_price',
            'total_default_currency_price',
            'display_price',
            'manufacturer_data'
        )
