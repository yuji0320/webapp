# Generated by Django 2.1.7 on 2019-07-03 23:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system_master', '0005_auto_20190702_2326'),
    ]

    operations = [
        migrations.AddField(
            model_name='systemjobtype',
            name='abbr',
            field=models.CharField(blank=True, max_length=150, verbose_name='Abbreviation'),
        ),
    ]
