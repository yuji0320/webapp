import decimal
# from django.forms import IntegerField
from .models import *
from system_users.serializer import *
from system_master.serializer import *


class DirectCostBudgetSerializer(serializers.ModelSerializer):
    id = serializers.CharField(required=False)

    class Meta:
        model = DirectCostBudget
        fields = '__all__'


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
        direct_cost_budget = obj.commercial_parts_budget + obj.electrical_parts_budget + obj.processed_parts_budget + \
                             obj.outsourcing_mechanical_design_budget + obj.outsourcing_electrical_design_budget + \
                             obj.outsourcing_other_budget + obj.shipping_cost_budget
        # 限界利益予算額
        limit_profit_budget = order_price - direct_cost_budget
        if obj.order_price == 0:
            limit_profit_percentage = 0
        else:
            if limit_profit_budget > 0:
                # 限界利益が正の場合
                limit_profit_percentage = limit_profit_budget / order_price * 100
            elif limit_profit_budget == 0:
                # 限界利益がゼロの場合
                limit_profit_percentage = 0
            else:
                # 限界利益が負の場合
                limit_profit_percentage = (direct_cost_budget - order_price) / order_price * -100
        # 予算労務時間
        working_hours_budget = obj.mechanical_design_budget_hours + obj.electrical_design_budget_hours + \
                               obj.assembly_budget_hours + obj.electrical_wiring_budget_hours + obj.installation_budget_hours
        # 予算労務費
        labor_cost_budget = working_hours_budget * obj.company.time_charge
        manufacturing_cost_budget = direct_cost_budget + labor_cost_budget
        total_profit_budget = limit_profit_budget - labor_cost_budget
        if obj.order_price == 0:
            total_profit_percentage = 0
        else:
            if total_profit_budget > 0:
                # 限界利益が正の場合
                total_profit_percentage = total_profit_budget / order_price * 100
            elif total_profit_budget == 0:
                # 限界利益がゼロの場合
                total_profit_percentage = 0
            else:
                # 限界利益が負の場合
                total_profit_percentage = (labor_cost_budget + direct_cost_budget - order_price) / order_price * -100

        costs = {
            'tax_price': "{:,.2f}".format(tax_price),
            'order_total': "{:,.2f}".format(order_total),
            'direct_cost_budget': "{:,.2f}".format(direct_cost_budget),
            'limit_profit_budget': "{:,.2f}".format(limit_profit_budget),
            'limit_profit_percentage_budget': "{:-,.2f}".format(limit_profit_percentage),
            'working_hours_budget': "{:-,.2f}".format(working_hours_budget),
            'labor_cost_budget': "{:-,.2f}".format(labor_cost_budget),
            'manufacturing_cost_budget': "{:-,.2f}".format(manufacturing_cost_budget),
            'total_profit_budget': "{:-,.2f}".format(total_profit_budget),
            'total_profit_percentage': "{:-,.2f}".format(total_profit_percentage),
        }
        return costs

    # 頭出し検索用フィールド
    @staticmethod
    def get_incremental_field(obj):
        search_field = str(obj.mfg_no) + " : " + obj.name
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
            'bill_date',
            'notes',
            'related_party_mfg_no',
            'commercial_parts_budget',
            'electrical_parts_budget',
            'processed_parts_budget',
            'outsourcing_mechanical_design_budget',
            'outsourcing_electrical_design_budget',
            'outsourcing_other_budget',
            'shipping_cost_budget',
            'mechanical_design_budget_hours',
            'electrical_design_budget_hours',
            'assembly_budget_hours',
            'electrical_wiring_budget_hours',
            'installation_budget_hours',
            'shipping_cost_result',
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
    order_amount = serializers.SerializerMethodField()
    manufacturer_data = UserPartnerSerializer(source='manufacturer', read_only=True)
    mfg_no = serializers.SerializerMethodField()
    is_processed = serializers.SerializerMethodField()

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

    # 発注数量計算
    @staticmethod
    def get_order_amount(obj):
        amount = 0.00
        amount_def = decimal.Decimal(float(obj.amount)) - decimal.Decimal(float(obj.stock_appropriation))
        if not obj.is_customer_supplied:
            if amount_def > 0:
                amount = amount_def
        return round(amount, 2)

    # 表示用単価作成
    @staticmethod
    def get_display_price(obj):
        display_price = obj.currency.display + ' ' + "{:,.2f}".format(obj.unit_price)
        return display_price

    # 工事番号取得
    @staticmethod
    def get_mfg_no(obj):
        return obj.job_order.mfg_no

    @staticmethod
    def get_is_processed(obj):
        status = obj.type.is_processed_parts
        return status

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
            'order_amount',
            'manufacturer_data',
            'mfg_no',
            'is_processed'
        )


# 発注ファイル
class MakingOrderSerializer(serializers.ModelSerializer):
    total_default_currency_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    display_price_total = serializers.SerializerMethodField()
    currency_data = SystemCurrencySerializer(source='currency', read_only=True)
    manufacturer_data = UserPartnerSerializer(source='manufacturer', read_only=True)
    supplier_data = UserPartnerSerializer(source='supplier', read_only=True)
    mfg_no = serializers.SerializerMethodField()
    is_processed = serializers.SerializerMethodField()
    # parts_detail = serializers.SerializerMethodField()
    bill_of_material = BillOfMaterialSerializer(many=False, read_only=True)
    bill_of_material_id = serializers.PrimaryKeyRelatedField(
        queryset=BillOfMaterial.objects.all(), source='bill_of_material', write_only=True, allow_null=True)

    # デフォルト通貨での合計価格計算
    @staticmethod
    def get_total_default_currency_price(obj):
        total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        return round(total_price, 2)

    # 発注通貨での合計金額
    @staticmethod
    def get_total_price(obj):
        total_price = obj.unit_price * decimal.Decimal(float(obj.amount))
        return round(total_price, 2)

    # 表示用単価作成(通貨記号付き文字列単価)
    @staticmethod
    def get_display_price(obj):
        display_price = obj.currency.display + ' ' + "{:-,.2f}".format(obj.unit_price)
        return display_price

    # 表示用合計金額作成(通貨記号付き文字列合計金額)
    @staticmethod
    def get_display_price_total(obj):
        total_price = round(obj.unit_price * decimal.Decimal(float(obj.amount)), 2)
        display_price = obj.currency.display + ' ' + "{:,.2f}".format(total_price)
        return display_price

    # 工事番号取得
    @staticmethod
    def get_mfg_no(obj):
        if obj.bill_of_material:
            mfg_no = obj.bill_of_material.job_order.mfg_no
        else:
            mfg_no = ""
        return mfg_no

    @staticmethod
    def get_is_processed(obj):
        if obj.bill_of_material:
            status = obj.bill_of_material.type.is_processed_parts
        else:
            status = False
        return status

    # 部品詳細データ表示
    @staticmethod
    def get_parts_detail(obj):
        # 加工部品かどうかを判断
        if obj.bill_of_material:
            status = obj.bill_of_material.type.is_processed_parts
        else:
            status = False
        if status:
            parts_detail = obj.drawing_number
        else:
            parts_detail = obj.standard
        return parts_detail

    def validate(self, data):
        if data['number']:
            return data
        else:
            try:
                data['number'] = MakingOrder.objects.filter(company=data['company']).latest('created_at').number + 1
            except ValueError:
                data['number'] = 1
            return data

    class Meta:
        model = MakingOrder
        fields = (
            'id',
            'company',
            'number',
            'bill_of_material',
            'bill_of_material_id',
            'name',
            'manufacturer',
            'standard',
            'unit_number',
            'drawing_number',
            'material',
            'surface_treatment',
            'amount',
            'unit',
            'currency',
            'rate',
            'unit_price',
            'supplier',
            'desired_delivery_date',
            'supplier',
            'ordered_date',
            'is_printed',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'total_default_currency_price',
            'total_price',
            'display_price',
            'display_price_total',
            'currency_data',
            'manufacturer_data',
            'supplier_data',
            'mfg_no',
            'is_processed',
            # 'parts_detail'
        )

    # def update(self, instance, validated_data):
    #     bom = validated_data.bill_of_material

    # def to_representation(self, instance):
    #     response = super().to_representation(instance)
    #     response['bill_of_material'] = BillOfMaterialSerializer(instance.bill_of_material).data
    #     return response


class ReceivingProcessSerializer(serializers.ModelSerializer):
    order_data = MakingOrderSerializer(source='order', read_only=True)

    class Meta:
        model = ReceivingProcess
        fields = (
            # 発注ファイル
            'id',
            'order',
            'amount',
            'unit',
            'currency',
            'rate',
            'unit_price',
            'received_date',
            'suspense_received_date',
            'is_received',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'order_data',
            # 'parts_detail'
        )


class ManHourSerializer(serializers.ModelSerializer):
    staff_data = UserStaffSerializer(source='staff', read_only=True)
    type_data = SystemJobTypeSerializer(source='type', read_only=True)
    failure_data = SystemFailureCategorySerializer(source='failure', read_only=True)
    mfg_no = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()

    # 工事番号取得
    @staticmethod
    def get_mfg_no(obj):
        mfg_no = ""
        if obj.job_order:
            mfg_no = obj.job_order.mfg_no
        return mfg_no

    # 製品名取得
    @staticmethod
    def get_product_name(obj):
        name = ""
        if obj.job_order:
            name = obj.job_order.name
        return name

    class Meta:
        model = ManHour
        fields = (
            # 発注ファイル
            'id',
            'job_order',
            'staff',
            'type',
            'work_hour',
            'date',
            'failure',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'staff_data',
            'type_data',
            'failure_data',
            'mfg_no',
            'product_name'
        )


class PartsSearchSerializer(serializers.ModelSerializer):
    mfg_no = serializers.SerializerMethodField()
    # order_data = serializers.SerializerMethodField()

    # 工事番号取得
    @staticmethod
    def get_mfg_no(obj):
        return obj.job_order.mfg_no

    # # 工事番号取得
    # @staticmethod
    # def get_order_data(obj):
    #     try:
    #         order_abstruct_contents = MakingOrder.objects.all().filter(
    #             bill_of_material=obj.id).data
    #         return order_abstruct_contents
    #     except:
    #         order_abstruct_contents = None
    #         return order_abstruct_contents
    #     # return BillOfMaterial.objects.values('id').get(id=obj.id)

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
            'drawing_number',
            'amount',
            'unit',
            'currency',
            'rate',
            'unit_price',
            'is_customer_supplied',
            'is_printed',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'mfg_no',
            # 'order_data'
        )
