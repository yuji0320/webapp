# Generated by Django 2.0.8 on 2019-02-06 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manufacturing_data', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='joborder',
            name='commercial_parts_budget',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=17, verbose_name='Commercial parts budget'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='joborder',
            name='electrical_parts_budget',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=17, verbose_name='Electrical parts budget'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='joborder',
            name='processed_parts_budget',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=17, verbose_name='Processed parts budget'),
            preserve_default=False,
        ),
    ]