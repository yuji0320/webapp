# Generated by Django 2.1.7 on 2019-03-15 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('manufacturing_data', '0014_auto_20190315_0036'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='billofmaterial',
            name='quantity',
        ),
        migrations.AddField(
            model_name='billofmaterial',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=17, verbose_name='Amount'),
        ),
    ]