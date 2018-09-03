from django.db import models


class SystemCountry(models.Model):
    """国名"""
    name = models.CharField('country name', max_length=50, unique=True)  # 国名
    code = models.CharField('country code', max_length=2, unique=True)  # 国名コード(ISO 3166-1)
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_country'

    def __str__(self): return self.name


class SystemCurrency(models.Model):
    """通貨"""
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
    name = models.CharField('unit type name', max_length=50, unique=True)  # 単位名称
    display = models.CharField('unit type display', max_length=50, unique=True)  # 単位表示記号
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'system_unit_type'

    def __str__(self): return self.name