# Generated by Django 2.1.7 on 2019-07-02 23:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('system_users', '0020_usercompany_time_charge'),
        ('system_master', '0005_auto_20190702_2326'),
        ('manufacturing_data', '0030_receivingprocess_suspense_received_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='ManHour',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('work_hour', models.DecimalField(decimal_places=2, max_digits=17, verbose_name='Work Hour')),
                ('date', models.DateField(verbose_name='Date')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created time')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='updated time')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='manhour_requests_created', to=settings.AUTH_USER_MODEL)),
                ('failure', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='system_master.SystemFailureCategory')),
                ('job_order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='manufacturing_data.JobOrder')),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='manhour_requests_modified', to=settings.AUTH_USER_MODEL)),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='system_users.UserStaff')),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='system_master.SystemJobType')),
            ],
            options={
                'verbose_name': 'Man Hour',
                'verbose_name_plural': 'Man hours',
                'db_table': 'man_hour',
            },
        ),
    ]