import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _


class SystemCountry(models.Model):
    """国名"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField('country name', max_length=50, unique=True)  # 国名
    code = models.CharField('country code', max_length=2, unique=True)  # 国名コード(ISO 3166-1)
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_country'

    def __str__(self): return self.name


class SystemCurrency(models.Model):
    """通貨"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField('currency name', max_length=50, unique=True)  # 通貨名称
    code = models.CharField('currency code', max_length=3, unique=True)  # 通貨コード(ISO 4217)
    display = models.CharField('currency display', max_length=10, unique=True)  # 通貨表示記号
    decimal_point = models.IntegerField('decimal point')  # 小数点以下桁数
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_currency'

    def __str__(self): return self.name


class SystemUnitType(models.Model):
    """単位"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.IntegerField('number', unique=True)  # 項目番号
    name = models.CharField('unit type name', max_length=50, unique=True)  # 単位名称
    display = models.CharField('unit type display', max_length=50, unique=True)  # 単位表示記号
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_unit_type'

    def __str__(self): return self.name


class SystemExpenseCategory(models.Model):
    # 費用項目リスト
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category_number = models.IntegerField(_('Category number'), unique=True)  # 項目番号
    category_name = models.CharField(_('Category name'), max_length=150)  # 項目名
    is_processed_parts = models.BooleanField(_('is Processed parts'), default=False)  # 加工部品かどうか
    is_active = models.BooleanField(_('is Active'), default=True)  # 有効かどうか
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_expense_categories'
        verbose_name = _('System Expense Category')
        verbose_name_plural = _('System Expense Categories')

    def __str__(self): return self.category_name


class SystemFailureCategory(models.Model):
    # 仕損費種別マスタ
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category_number = models.IntegerField(_('Category number'), unique=True)  # 企業内での項目番号
    category_name = models.CharField(_('Category name'), max_length=150)  # 項目名
    is_active = models.BooleanField(_('is Active'), default=True)  # 有効かどうか
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_failure_category'
        verbose_name = _('System Failure Category')
        verbose_name_plural = _('System Failure Categories')

    def __str__(self): return self.category_name
