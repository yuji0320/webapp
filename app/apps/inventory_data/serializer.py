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