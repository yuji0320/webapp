# Generated by Django 2.0.8 on 2018-12-25 18:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('system_users', '0002_auto_20181225_1808'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='staff',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='system_users.UserStaff'),
        ),
    ]
