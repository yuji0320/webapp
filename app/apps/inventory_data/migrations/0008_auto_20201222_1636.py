# Generated by Django 3.1 on 2020-12-22 16:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory_data', '0007_auto_20201221_1658'),
    ]

    operations = [
        migrations.RenameField(
            model_name='instockparts',
            old_name='apply_amount',
            new_name='amount',
        ),
        migrations.RemoveField(
            model_name='instockparts',
            name='used_amount',
        ),
    ]
