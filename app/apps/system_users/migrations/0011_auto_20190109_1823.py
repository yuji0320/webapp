# Generated by Django 2.0.8 on 2019-01-09 18:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('system_users', '0010_auto_20190109_1821'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='usercompany',
            options={'verbose_name': 'User Company', 'verbose_name_plural': 'User companies'},
        ),
        migrations.AlterModelOptions(
            name='userpartner',
            options={'verbose_name': 'Partner', 'verbose_name_plural': 'Partners'},
        ),
    ]
