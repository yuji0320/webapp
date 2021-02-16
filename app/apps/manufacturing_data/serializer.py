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
    incremental_field = serializers.SerializerMethodField()
    customer_abbr = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    delivery_destination_abbr = serializers.SerializerMethodField()
    delivery_destination_name = serializers.SerializerMethodField()
    order_currency_code = serializers.SerializerMethodField()
    order_currency_display = serializers.SerializerMethodField()
    publisher_name = serializers.SerializerMethodField()
    designer_name = serializers.SerializerMethodField()

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

    # 取引先略称
    @staticmethod
    def get_customer_abbr(obj):
        abbr = ""
        if obj.customer:
            abbr = obj.customer.abbr
        return abbr

    # 取引先名
    @staticmethod
    def get_customer_name(obj):
        name = ""
        if obj.customer:
            name = obj.customer.name
        return name

    # 納入先略称
    @staticmethod
    def get_delivery_destination_abbr(obj):
        abbr = ""
        if obj.delivery_destination:
            abbr = obj.delivery_destination.abbr
        return abbr

    # 納入先略称
    @staticmethod
    def get_delivery_destination_name(obj):
        name = ""
        if obj.delivery_destination:
            name = obj.delivery_destination.name
        return name

    # 取引通貨記号
    @staticmethod
    def get_order_currency_code(obj):
        code = obj.order_currency.code
        return code

    # 取引通貨記号
    @staticmethod
    def get_order_currency_display(obj):
        display = obj.order_currency.display
        return display

    # 作成者名
    @staticmethod
    def get_publisher_name(obj):
        publisher_name = ""
        if obj.publisher:
            publisher_name = str(obj.publisher.staff_number) + " : " + str(obj.publisher.full_name)
        return publisher_name
    
    # 設計者名
    @staticmethod
    def get_designer_name(obj):
        designer_name = ""
        if obj.designer:
            designer_name = str(obj.designer.staff_number) + " : " + str(obj.designer.full_name)
        return designer_name

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
            'incremental_field',
            'customer_abbr',
            'customer_name',
            'delivery_destination_abbr',
            'delivery_destination_name',
            'order_currency_code',
            'order_currency_display',
            'publisher_name',
            'designer_name',
        )
        read_only_fields = [
            'default_currency_order_amount',
            'costs',
            'incremental_field',
            'customer_abbr',
            'customer_name',
            'delivery_destination_abbr',
            'delivery_destination_name',
            'order_currency_code',
            'order_currency_display',
            'publisher_name',
            'designer_name',
        ]


# 部品表
class BillOfMaterialSerializer(serializers.ModelSerializer):
    default_currency_price = serializers.SerializerMethodField()
    total_default_currency_price = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    order_amount = serializers.SerializerMethodField()
    mfg_no = serializers.SerializerMethodField()
    is_processed = serializers.SerializerMethodField()
    parts_detail = serializers.SerializerMethodField()
    manufacturer_abbr = serializers.SerializerMethodField()

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

    # 部品詳細データ表示
    @staticmethod
    def get_parts_detail(obj):
        # 加工部品かどうかを判断
        status = obj.type.is_processed_parts
        if status:
            parts_detail = obj.drawing_number
        else:
            parts_detail = obj.standard
        return parts_detail

    # メーカー名取得
    @staticmethod
    def get_manufacturer_abbr(obj):
        manufacturer_abbr = ""
        if obj.manufacturer:
            manufacturer_abbr = obj.manufacturer.abbr
        return manufacturer_abbr

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
            'notes',
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
            'mfg_no',
            'is_processed',
            'parts_detail',
            'manufacturer_abbr'
        )
        read_only_fields = [
            'default_currency_price',
            'total_default_currency_price',
            'display_price',
            'order_amount',
            'mfg_no',
            'is_processed',
            'parts_detail',
            'manufacturer_abbr'
        ]


# 発注ファイル
class MakingOrderSerializer(serializers.ModelSerializer):
    total_default_currency_price = serializers.SerializerMethodField()
    display_total_default_currency_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    display_price_total = serializers.SerializerMethodField()
    mfg_no = serializers.SerializerMethodField()
    job_order = serializers.SerializerMethodField()
    is_processed = serializers.SerializerMethodField()
    # parts_detail = serializers.SerializerMethodField()
    manufacturer_abbr = serializers.SerializerMethodField()
    supplier_abbr = serializers.SerializerMethodField()
    bom_price = serializers.SerializerMethodField()
    currency_display = serializers.SerializerMethodField()


    # デフォルト通貨での合計価格計算
    @staticmethod
    def get_total_default_currency_price(obj):
        total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        return round(total_price, 2)

    # デフォルト通貨での合計価格計算(表示用)
    @staticmethod
    def get_display_total_default_currency_price(obj):
        total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        display_price = "{:,.2f}".format(total_price)
        return display_price

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

    # 工事番号取得
    @staticmethod
    def get_job_order(obj):
        if obj.bill_of_material:
            job_order = obj.bill_of_material.job_order.id
        else:
            job_order = ""
        return job_order

    @staticmethod
    def get_is_processed(obj):
        if obj.bill_of_material:
            status = obj.bill_of_material.type.is_processed_parts
        else:
            status = False
        return status

    # # 部品詳細データ表示
    # @staticmethod
    # def get_parts_detail(obj):
    #     # 加工部品かどうかを判断
    #     if obj.bill_of_material:
    #         status = obj.bill_of_material.type.is_processed_parts
    #     else:
    #         status = False
    #     if status:
    #         parts_detail = obj.drawing_number
    #     else:
    #         parts_detail = obj.standard
    #     return parts_detail

    # メーカー名取得
    @staticmethod
    def get_manufacturer_abbr(obj):
        manufacturer_abbr = ""
        if obj.manufacturer:
            manufacturer_abbr = obj.manufacturer.abbr
        return manufacturer_abbr

    # 仕入れ先名名取得
    @staticmethod
    def get_supplier_abbr(obj):
        supplier_abbr = ""
        if obj.supplier:
            supplier_abbr = obj.supplier.abbr
        return supplier_abbr

    # 部品表金額取得
    @staticmethod
    def get_bom_price(obj):
        if obj.bill_of_material:
            bom_price = str(obj.bill_of_material.unit_price)
        else:
            bom_price = ""
        return bom_price

    # 取引通貨記号
    @staticmethod
    def get_currency_display(obj):
        display = obj.currency.display
        return display

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
            'ordered_date',
            'is_printed',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'total_default_currency_price',
            'display_total_default_currency_price',
            'total_price',
            'display_price',
            'display_price_total',
            'mfg_no',
            'job_order',
            'is_processed',
            # 'parts_detail'
            'manufacturer_abbr',
            'supplier_abbr',
            'bom_price',
            'currency_display',
        )
        read_only_fields = [
            'total_default_currency_price',
            'display_total_default_currency_price',
            'total_price',
            'display_price',
            'display_price_total',
            'mfg_no',
            'job_order',
            'is_processed',
            'manufacturer_abbr',
            'supplier_abbr',
            'bom_price',
            'currency_display',
        ]


class ReceivingProcessSerializer(serializers.ModelSerializer):
    # order_data = MakingOrderSerializer(source='order', read_only=True)
    order_number = serializers.SerializerMethodField()
    part_name = serializers.SerializerMethodField()
    part_detail = serializers.SerializerMethodField()
    part_detail_other = serializers.SerializerMethodField()
    desired_delivery_date = serializers.SerializerMethodField()
    order_amount = serializers.SerializerMethodField()
    order_price = serializers.SerializerMethodField()
    order_price_display = serializers.SerializerMethodField()
    total_default_currency_price = serializers.SerializerMethodField()
    display_total_default_currency_price = serializers.SerializerMethodField()
    mfg_no = serializers.SerializerMethodField()
    manufacturer_abbr = serializers.SerializerMethodField()
    supplier_abbr = serializers.SerializerMethodField()
    supplier = serializers.SerializerMethodField()
    part_type = serializers.SerializerMethodField()
    ordered_date = serializers.SerializerMethodField()

    # 発注番号取得
    @staticmethod
    def get_order_number(obj):
        order_number = obj.order.number
        return order_number

    # 部品名取得
    @staticmethod
    def get_part_name(obj):
        part_name = obj.order.name
        return part_name

    # 部品詳細データ表示
    @staticmethod
    def get_part_detail(obj):
        # 加工部品かどうかを判断
        if obj.order.bill_of_material:
            status = obj.order.bill_of_material.type.is_processed_parts
        else:
            status = False
        if status:
            part_detail = obj.order.drawing_number
        else:
            part_detail = obj.order.standard
        return part_detail

    # 部品詳細その他データ表示
    @staticmethod
    def get_part_detail_other(obj):
        # 加工部品かどうかを判断
        if obj.order.bill_of_material:
            status = obj.order.bill_of_material.type.is_processed_parts
        else:
            status = False
        if status:
            part_detail = obj.order.material
        else:
            if obj.order.manufacturer:
                part_detail = obj.order.manufacturer.abbr
            else :
                part_detail = ""
        return part_detail

    # 希望納期取得
    @staticmethod
    def get_desired_delivery_date(obj):
        desired_delivery_date = obj.order.desired_delivery_date
        return desired_delivery_date

    # 発注個数取得
    @staticmethod
    def get_order_amount(obj):
        order_amount = obj.order.amount
        return order_amount

    # 発注金額取得
    @staticmethod
    def get_order_price(obj):
        order_price = obj.order.unit_price
        return order_price

    # 発注金額取得
    @staticmethod
    def get_order_price_display(obj):
        order_price_display = obj.currency.display + "{:-,.2f}".format(obj.order.unit_price)
        return order_price_display

    # デフォルト通貨での合計価格計算
    @staticmethod
    def get_total_default_currency_price(obj):
        total_price = 0
        if(obj.is_received): 
            total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        return round(total_price, 2)

    # デフォルト通貨での合計価格計算(表示用)
    @staticmethod
    def get_display_total_default_currency_price(obj):
        total_price = 0
        if(obj.is_received): 
            total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        display_price = "{:,.2f}".format(total_price)
        return display_price

    # 工事番号取得
    @staticmethod
    def get_mfg_no(obj):
        # 加工部品かどうかを判断
        if obj.order.bill_of_material:
            mfg_no = obj.order.bill_of_material.job_order.mfg_no
        else:
            mfg_no = "N/A"
        return mfg_no

    # メーカー名取得
    @staticmethod
    def get_manufacturer_abbr(obj):
        manufacturer_abbr = ""
        if obj.order.manufacturer:
            manufacturer_abbr = obj.order.manufacturer.abbr
        return manufacturer_abbr

    # 仕入先id取得
    @staticmethod
    def get_supplier(obj):
        supplier = ""
        if(obj.order.supplier) :
            supplier = obj.order.supplier.id
        return supplier

    # 仕入先名取得
    @staticmethod
    def get_supplier_abbr(obj):
        supplier_abbr = ""
        if(obj.order.supplier) :
            supplier_abbr = obj.order.supplier.abbr
        return supplier_abbr

    # 部品種別取得
    @staticmethod
    def get_part_type(obj):
        part_type = ""
        if(obj.order.bill_of_material) :
            part_type = obj.order.bill_of_material.type.id
        return part_type

    # 発注日取得
    @staticmethod
    def get_ordered_date(obj):
        ordered_date = obj.order.ordered_date
        return ordered_date

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
            'order_number',
            'part_name',
            'part_detail',
            'part_detail_other',
            'desired_delivery_date',
            'order_amount',
            'order_price',
            'order_price_display',
            'total_default_currency_price',
            'display_total_default_currency_price',
            'mfg_no',
            'manufacturer_abbr',
            'supplier',
            'supplier_abbr',
            'part_type',
            'ordered_date',
        )
        read_only_fields = [
            'order_number',
            'part_name',
            'part_detail',
            'part_detail_other',
            'desired_delivery_date',
            'order_amount',
            'order_price',
            'order_price_display',
            'total_default_currency_price',
            'display_total_default_currency_price',
            'mfg_no',
            'manufacturer_abbr',
            'supplier',
            'supplier_abbr',
            'part_type',
            'ordered_date',
        ]

class ManHourSerializer(serializers.ModelSerializer):
    mfg_no = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    staff_name = serializers.SerializerMethodField()
    job_type = serializers.SerializerMethodField()

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

    # 従業員名取得
    @staticmethod
    def get_staff_name(obj):
        staff_name = obj.staff.full_name
        return staff_name

    # 作業区分取得
    @staticmethod
    def get_job_type(obj):
        job_type = obj.type.name
        return job_type

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
            'mfg_no',
            'product_name',
            'staff_name',
            'job_type',
        )
        read_only_fields = [
            'mfg_no',
            'product_name',
            'staff_name',
            'job_type',
        ]

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
