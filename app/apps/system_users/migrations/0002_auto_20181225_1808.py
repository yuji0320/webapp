# Generated by Django 2.0.8 on 2018-12-25 18:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('system_users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usercompany',
            name='country',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='system_master.SystemCountry'),
        ),
        migrations.AlterField(
            model_name='userstaff',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='system_users.UserCompany'),
        ),
    ]
