# Generated by Django 2.1.7 on 2019-04-22 03:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manufacturing_data', '0027_joborder_related_party_mfg_no'),
    ]

    operations = [
        migrations.AlterField(
            model_name='receivingprocess',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=17, verbose_name='Amount'),
        ),
    ]
