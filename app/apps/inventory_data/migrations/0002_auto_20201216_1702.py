# Generated by Django 3.1 on 2020-12-16 17:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory_data', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='inventorymaster',
            options={'verbose_name': 'Inventory Master', 'verbose_name_plural': 'Inventory Master'},
        ),
        migrations.AlterModelTable(
            name='inventorymaster',
            table='inventory_master',
        ),
    ]
