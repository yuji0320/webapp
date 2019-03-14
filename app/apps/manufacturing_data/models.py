from system_users.models import *
# from django.utils import timezone
from django.utils.translation import gettext_lazy as _


# Create your models here.


class JobOrder(models.Model):
    # 作業指図書
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
    mfg_no = models.CharField(_('Manufacturing Number'), max_length=20)  # 工事番号
    name = models.CharField(_('Product name'), max_length=255)  # 製品名
    publisher = models.ForeignKey('system_users.UserStaff',
                                  related_name='%(class)s_requests_publisher',
                                  on_delete=models.PROTECT,
                                  blank=True,
                                  null=True)  # 作業指図書発行者
    designer = models.ForeignKey('system_users.UserStaff',
                                 related_name='%(class)s_requests_designer',
                                 on_delete=models.PROTECT,
                                 blank=True,
                                 null=True)  # 設計者
    customer = models.ForeignKey('system_users.UserPartner',
                                 related_name='%(class)s_requests_customer',
                                 on_delete=models.PROTECT,
                                 blank=True)  # 取引先
    delivery_destination = models.ForeignKey('system_users.UserPartner',
                                             related_name='%(class)s_requests_delivery_destination',
                                             on_delete=models.PROTECT,
                                             blank=True)  # 納入先
    order_currency = models.ForeignKey('system_master.SystemCurrency', on_delete=models.PROTECT)  # 受注通貨
    order_rate = models.FloatField(_('Order Rate'), default=1)  # 受注時為替レート
    order_price = models.DecimalField(_('Order Price'), max_digits=17, decimal_places=2)  # 受注金額
    tax_percent = models.IntegerField(_('Tax Percentage'))  # 付加価値税率
    order_date = models.DateField(_('Order Date'), blank=True, null=True)  # 受注日
    delivery_date = models.DateField(_('Delivery Date'), blank=True, null=True)  # 納入日
    completion_date = models.DateField(_('Completion Date'), blank=True, null=True)  # 工事完了日
    notes = models.TextField(_('Notes'), blank=True)  # 備考
    commercial_parts_budget = models.DecimalField(
        _('Commercial parts budget'),
        max_digits=17,
        decimal_places=2,
        default=0
    )  # 市販部品見積金額
    electrical_parts_budget = models.DecimalField(
        _('Electrical parts budget'),
        max_digits=17,
        decimal_places=2,
        default=0
    )  # 電気部品見積金額
    processed_parts_budget = models.DecimalField(
        _('Processed parts budget'),
        max_digits=17,
        decimal_places=2,
        default=0
    )  # 加工部品見積金額
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    created_by = models.ForeignKey('system_users.User',
                                   related_name='%(class)s_requests_created',
                                   on_delete=models.PROTECT)  # データ作成者
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時
    modified_by = models.ForeignKey('system_users.User',
                                    related_name='%(class)s_requests_modified',
                                    on_delete=models.PROTECT)  # データ最終更新者

    class Meta:
        db_table = 'job_order'
        verbose_name = _('Job Order')
        verbose_name_plural = _('Job Order')
        unique_together = (("company", "mfg_no"),)  # 会社ごとの工事番号ユニーク

    # def __str__(self):
    #     return u"MFG No:{mfg_no}, Product Name:{name}".format(**vars(self))


class BillOfMaterial(models.Model):
    # 部品表
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey('system_users.UserCompany', on_delete=models.PROTECT)  # 紐付け企業
    job_order = models.ForeignKey('JobOrder', on_delete=models.PROTECT)  # 紐付け工事番号
    type = models.ForeignKey('system_master.SystemExpenseCategory', on_delete=models.PROTECT)  # 部品種別
    name = models.CharField(_('Parts name'), max_length=255)  # 部品名
    manufacturer = models.ForeignKey('system_users.UserPartner',
                                     related_name='%(class)s_requests_manufacturer',
                                     on_delete=models.PROTECT,
                                     blank=True,
                                     null=True)  # メーカー
    standard = models.CharField(_('Standard・Model'), max_length=255, blank=True)  # 規格・型式
    drawing_number = models.CharField(_('Drawing Number'), max_length=255, blank=True)  # 図面番号
    material = models.CharField(_('Material'), max_length=255, blank=True)  # 材質
    surface_treatment = models.CharField(_('Surface treatment'), max_length=255, blank=True)  # 表面加工
    unit_number = models.CharField(_('Unit Number'), max_length=255, blank=True)  # ユニット番号
    quantity = models.DecimalField(_('Quantity'), max_digits=17, decimal_places=2, default=1)  # 個数
    stock_appropriation = models.DecimalField(
        _('Stock appropriation'),
        max_digits=17,
        decimal_places=2,
        default=0
    )  # 在庫充当個数
    unit = models.ForeignKey('system_master.SystemUnitType', on_delete=models.PROTECT)  # 計量単位種別
    currency = models.ForeignKey('system_master.SystemCurrency', on_delete=models.PROTECT)  # 通貨種別
    rate = models.FloatField(_('Order Rate'), default=1)  # 受注時為替レート
    unit_price = models.DecimalField(_('Unit Price'), max_digits=17, decimal_places=2, default=0)  # 単価
    desired_delivery_date = models.DateField(_('Desired delivery date'), blank=True, null=True)  # 希望納期
    failure = models.ForeignKey(
        'system_master.SystemFailureCategory',
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )  # 仕損種別
    is_customer_supplied = models.BooleanField(_('is Customer supplied'), default=False)  # 支給品かどうか
    is_printed = models.BooleanField(_('is Printed'), default=False)  # 部品表印刷済みかどうか
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    created_by = models.ForeignKey('system_users.User',
                                   related_name='%(class)s_requests_created',
                                   on_delete=models.PROTECT)  # データ作成者
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時
    modified_by = models.ForeignKey('system_users.User',
                                    related_name='%(class)s_requests_modified',
                                    on_delete=models.PROTECT)  # データ最終更新者

    class Meta:
        db_table = 'bill_of_material'
        verbose_name = _('Bill of Material')
        verbose_name_plural = _('Bill of Material')
