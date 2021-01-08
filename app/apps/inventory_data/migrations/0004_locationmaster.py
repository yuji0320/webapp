# Generated by Django 3.1 on 2020-12-18 17:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('system_users', '0020_usercompany_time_charge'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('inventory_data', '0003_auto_20201218_1428'),
    ]

    operations = [
        migrations.CreateModel(
            name='LocationMaster',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('number', models.IntegerField(unique=True, verbose_name='number')),
                ('name', models.CharField(max_length=255, verbose_name='Parts name')),
                ('notes', models.TextField(blank=True, verbose_name='Notes')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created time')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='updated time')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='system_users.usercompany')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='locationmaster_requests_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='locationmaster_requests_modified', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'location_master',
            },
        ),
    ]
