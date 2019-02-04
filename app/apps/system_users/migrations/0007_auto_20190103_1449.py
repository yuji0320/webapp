# Generated by Django 2.0.8 on 2019-01-03 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_users', '0006_auto_20190103_1445'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpartner',
            name='is_client',
            field=models.BooleanField(default=False, verbose_name='is Client'),
        ),
        migrations.AlterField(
            model_name='userpartner',
            name='is_delivery_destination',
            field=models.BooleanField(default=False, verbose_name='is Delivery destination'),
        ),
        migrations.AlterField(
            model_name='userpartner',
            name='is_manufacturer',
            field=models.BooleanField(default=False, verbose_name='is Manufacturer'),
        ),
        migrations.AlterField(
            model_name='userpartner',
            name='is_supplier',
            field=models.BooleanField(default=False, verbose_name='is Supplier'),
        ),
    ]
