from system_master.models import *
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail


class UserCompany(models.Model):
    """ユーザー企業"""
    country = models.ForeignKey('system_master.SystemCountry', on_delete=models.CASCADE)  # 所在国
    name = models.CharField('company name', max_length=255, unique=True)  # 企業名
    postal_code = models.CharField('postal code', max_length=20)  # 郵便番号
    address = models.TextField('physical address')  # 住所
    phone = models.CharField('phone number', max_length=20)  # 電話番号
    fax = models.CharField('fax number', max_length=20, blank=True)  # FAX番号
    default_currency = models.ForeignKey('system_master.SystemCurrency', on_delete=models.PROTECT)  # 会計通貨
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    class Meta:
        db_table = 'user_company'

    def __str__(self): return self.name


class UserStaff(models.Model):
    """従業員リスト"""
    company = models.ForeignKey('UserCompany', on_delete=models.CASCADE)  # 所属企業
    staff_number = models.IntegerField(_('staff number'))  # 企業内での従業員番号
    full_name = models.CharField(_('full name'), max_length=150)  # 氏名
    ruby = models.CharField(_('ruby'), max_length=150, blank=True)  # ふりがな
    mobile = models.CharField(_('mobile number'), max_length=15, blank=True)  # 個人携帯番号
    email = models.EmailField(_('email address'), blank=True)  # メールアドレス
    postal_code = models.CharField(_('postal code'), max_length=20, blank=True)  # 自宅郵便番号
    address = models.TextField(_('home address'), blank=True)  # 自宅住所
    date_birth = models.DateField(_('date birth'), blank=True, null=True)  # 誕生日
    date_joined = models.DateField(_('date joined'), blank=True, null=True)  # 入社日
    date_left = models.DateField(_('date left'), blank=True, null=True)  # 退職日
    # 管理者権限 Boolean
    is_login_user = models.BooleanField(
        _('login status'),
        default=True,
        help_text=_(
            'Designates whether the user can create login user.'),
    )
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email', ]

    class Meta:
        db_table = 'staff'
        verbose_name = _('staff')
        verbose_name_plural = _('staffs')
        unique_together = (("company", "staff_number"),)  # 会社ごとの従業員番号ユニーク

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self): return self.full_name


class UserAccountManager(BaseUserManager):
    def create_user(self, request_data):
        now = timezone.now()

        if not request_data['username']:
            raise ValueError('Users must have an username.')

        staff = request_data['staff']

        user = self.model(
            username=request_data['username'],
            staff=staff,
            last_login=now,
            is_staff=True,
            is_active=True,
            created_at=now,
            modified_at=now,
        )
        user.set_password(request_data['password'])
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, staff):
        request_data = {
            'username': username,
            'password': password,
            'staff': UserStaff.objects.get(pk=int(staff))
        }
        user = self.create_user(request_data)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ユーザー AbstractUserをコピペし編集"""

    username_validator = UnicodeUsernameValidator()

    # ユーザーID
    username = models.CharField(
        _('username'),
        max_length=20,
        unique=True,
        null=False,
        default=None,
        help_text=_(
            'Required. 20 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    # 紐付きユーザー
    staff = models.OneToOneField(
        UserStaff,
        on_delete=models.CASCADE,
    )
    # 管理者権限 Boolean
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'),
    )
    # 有効ユーザー管理
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    created_at = models.DateTimeField('created time', auto_now_add=True, blank=True)  # 作成日時
    modified_at = models.DateTimeField('updated time', auto_now=True, blank=True)  # 更新日時

    objects = UserAccountManager()

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = ['staff']

    class Meta:
        db_table = 'user'
        verbose_name = _('user')
        verbose_name_plural = _('users')
