import decimal
# from django.forms import IntegerField
from .models import *
from system_users.serializer import *
from system_master.serializer import *
# from manufacturing_data.serializer import *


class InventoryMasterSerializer(serializers.ModelSerializer):
    manufacturer_abbr = serializers.SerializerMethodField()

    # メーカー名取得
    @staticmethod
    def get_manufacturer_abbr(obj):
        manufacturer_abbr = ""
        if obj.manufacturer:
            manufacturer_abbr = obj.manufacturer.abbr
        return manufacturer_abbr

    class Meta:
        model = InventoryMaster
        fields = (
            # 発注ファイル
            'id',
            'company',
            'name',
            'manufacturer',
            'standard',
            'material',
            'unit',
            'notes',
            'is_standard_inventory',
            'is_disabled',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'manufacturer_abbr',
        )


class LocationMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationMaster
        fields = (
            # 発注ファイル
            'id',
            'company',
            'number',
            'name',
            'notes',
            'is_disabled',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
        )


class InStockPartsSerializer(serializers.ModelSerializer):
    default_currency_unit_price = serializers.SerializerMethodField()
    total_default_currency_price = serializers.SerializerMethodField()
    inventory_master = InventoryMasterSerializer()
    # inventory_master_data = serializers.SerializerMethodField()

    @staticmethod
    def get_default_currency_unit_price(obj):
        default_unit_price = obj.unit_price * decimal.Decimal(float(obj.rate))
        return "{:,.2f}".format(default_unit_price)

    # デフォルト通貨での合計価格計算
    @staticmethod
    def get_total_default_currency_price(obj):
        total_price = obj.unit_price * decimal.Decimal(float(obj.rate)) * decimal.Decimal(float(obj.amount))
        return round(total_price, 2)

    # # マスタデータ取得
    # @staticmethod
    # def get_inventory_master_data(obj):
    #     manufacturer_abbr = ""
    #     if obj.inventory_master.manufacturer:
    #         manufacturer_abbr = obj.inventory_master.manufacturer.abbr

    #     inventory_master_data = {
    #         'company': obj.inventory_master.company.id,
    #         'name': obj.inventory_master.name,
    #         'manufacturer_abbr': manufacturer_abbr,
    #         'standard': obj.inventory_master.standard,
    #         'material': obj.inventory_master.material,
    #         'unit': obj.inventory_master.unit.id,
    #         'notes': obj.inventory_master.notes,
    #         'isDisabled': obj.inventory_master.is_disabled,
    #     }
    #     return inventory_master_data

    class Meta:
        model = InStockParts
        fields = (
            # 発注ファイル
            'id',
            'inventory_master',
            'amount',
            'currency',
            'rate',
            'unit_price',
            'location',
            'created_at',
            'created_by',
            'modified_at',
            'modified_by',
            # read_only under here
            'default_currency_unit_price',
            'total_default_currency_price',
            # 'inventory_master_data',
        )