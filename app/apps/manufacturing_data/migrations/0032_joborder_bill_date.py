# Generated by Django 2.1.7 on 2019-07-04 03:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manufacturing_data', '0031_manhour'),
    ]

    operations = [
        migrations.AddField(
            model_name='joborder',
            name='bill_date',
            field=models.DateField(blank=True, null=True, verbose_name='Bill Date'),
        ),
    ]
