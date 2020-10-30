from django.db import models
from system_users.models import *
from django.utils.translation import gettext_lazy as _
from decimal import Decimal


# 在庫部品マスタ
class StockPartsMaster(models.Model):
    # 部品表
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
    name = models.CharField(_('Parts name'), max_length=255)  # 部品名
    manufacturer = models.ForeignKey('system_users.UserPartner',
                                     related_name='%(class)s_requests_manufacturer',
                                     on_delete=models.PROTECT,
                                     blank=True,
                                     null=True)  # メーカー
    standard = models.CharField(_('Standard・Model'), max_length=255, blank=True)  # 規格・型式
    unit = models.ForeignKey('system_master.SystemUnitType', on_delete=models.PROTECT)  # 計量単位種別
    notes = models.TextField(_('Notes'), blank=True)  # 備考
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
        db_table = 'stock_parts_master'
        verbose_name = _('Stock Parts Master')
        verbose_name_plural = _('Stock Parts Master')
        unique_together = (("company", "manufacturer", "standard"),)  # 会社ごとの工事番号ユニーク
