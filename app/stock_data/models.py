from django.db import models
from system_users.models import *
from system_master.models import *
from django.utils.translation import gettext_lazy as _
from decimal import Decimal


class InventoryMaster(models.Model):
    #  在庫部品マスタ
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
    name = models.CharField(_('Parts name'), max_length=255)  # 部品名
    manufacturer = models.ForeignKey('system_users.UserPartner',
                                        related_name='%(class)s_requests_manufacturer',
                                        on_delete=models.PROTECT,
                                        blank=True,
                                        null=True)  # メーカー
    standard = models.CharField(_('Standard・Model'), max_length=255, blank=True)  # 規格・型式
    material = models.CharField(_('Material'), max_length=255, blank=True)  # 材質
    unit = models.ForeignKey('system_master.SystemUnitType', on_delete=models.PROTECT)  # 計量単位種別
    notes = models.TextField(_('Notes'), blank=True)  # 備考
    is_standard_inventory = models.BooleanField(verbose_name='is Standard Invontory', default=False,) #標準在庫かどうか
    is_disabled = models.BooleanField(verbose_name='is Disabled', default=False,)
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    created_by = models.ForeignKey('system_users.User',
                                    related_name='%(class)s_requests_created',
                                    on_delete=models.PROTECT)  # データ作成者
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時
    modified_by = models.ForeignKey('system_users.User',
                                    related_name='%(class)s_requests_modified',
                                    on_delete=models.PROTECT)  # データ最終更新者

    class Meta:
        db_table = 'inventory_master'
        verbose_name = _('Inventory Master')
        verbose_name_plural = _('Inventory Master')

    def __str__(self): return self.name


# class LocationMaster(models.Model):
#     # 保管場所マスタ
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
#     number = models.IntegerField('number', unique=True)  # 項目番号
#     name = models.CharField(_('Parts name'), max_length=255)  # 部品名
#     created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
#     created_by = models.ForeignKey('system_users.User',
#                                     related_name='%(class)s_requests_created',
#                                     on_delete=models.PROTECT)  # データ作成者
#     modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時
#     modified_by = models.ForeignKey('system_users.User',
#                                     related_name='%(class)s_requests_modified',
#                                     on_delete=models.PROTECT)  # データ最終更新者

#     class Meta:
#         db_table = 'location_master'

#     def __str__(self): return self.name

# class StockData(models.Model):
#     # 在庫データ
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
#     inventory_master = models.OneToOneField('InventoryMaster', on_delete=models.PROTECT,)  # 紐付在庫マスタ
#     apply_amount = models.DecimalField(_('Apply amount'), max_digits=17, decimal_places=2, default=1)  # 個数
#     used_amount = models.DecimalField(_('Used amount'), max_digits=17, decimal_places=2, default=1)  # 個数
#     currency = models.ForeignKey('system_master.SystemCurrency', on_delete=models.PROTECT)  # 通貨種別
#     rate = models.FloatField(_('Order Rate'), default=1)  # 登録時為替レート
#     unit_price = models.DecimalField(_('Unit Price'), max_digits=17, decimal_places=2, default=0)  # 単価
#     location = models.OneToOneField('LocationMaster', on_delete=models.PROTECT,)  # 紐付場所マスタ
#     created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
#     created_by = models.ForeignKey('system_users.User',
#                                     related_name='%(class)s_requests_created',
#                                     on_delete=models.PROTECT)  # データ作成者
#     modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時
#     modified_by = models.ForeignKey('system_users.User',
#                                     related_name='%(class)s_requests_modified',
#                                     on_delete=models.PROTECT)  # データ最終更新者

#     class Meta:
#         db_table = 'stock_data' 
