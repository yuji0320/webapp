from system_users.models import *
# from django.utils import timezone
from django.utils.translation import gettext_lazy as _


# Create your models here.


# class JobOrder(models.Model):
#     # 作業指図書
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
#     mfg_no = models.CharField(_('Manufacturing Number'), max_length=20)  # 工事番号
#     name = models.CharField(_('Product name'), max_length=255)  # 製品名
#     publisher = models.ForeignKey('system_users.UserStaff',
#                                   related_name='%(class)s_requests_publisher',
#                                   on_delete=models.PROTECT,
#                                   blank=True)  # 作業指図書発行者
#     designer = models.ForeignKey('system_users.UserStaff',
#                                  related_name='%(class)s_requests_designer',
#                                  on_delete=models.PROTECT,
#                                  blank=True)  # 設計者
#     customer = models.ForeignKey('system_users.UserPartner',
#                                  related_name='%(class)s_requests_client',
#                                  on_delete=models.PROTECT,
#                                  blank=True)  # 取引先
#     delivery_destination = models.ForeignKey('system_users.UserPartner',
#                                              related_name='%(class)s_requests_delivery_destination',
#                                              on_delete=models.PROTECT,
#                                              blank=True)  # 納入先
#     order_currency = models.ForeignKey('system_master.SystemCurrency', on_delete=models.PROTECT)  # 受注通貨
#     order_rate = models.FloatField(_('Order rate'), default=1)  # 受注時為替レート
#     order_price = models.DecimalField(_('Order Price'), max_digits=17, decimal_places=2)  # 受注金額
#     tax_percent = models.IntegerField(_('Tax Percentage'))  # 付加価値税率
#     notes = models.TextField(_('Notes'))  # 備考
#     created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
#     created_by = models.ForeignKey('system_users.User',
#                                    related_name='%(class)s_requests_created',
#                                    on_delete=models.PROTECT)  # データ作成者
#     modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時
#     modified_by = models.ForeignKey('system_users.User',
#                                     related_name='%(class)s_requests_modified',
#                                     on_delete=models.PROTECT)  # データ更新者
