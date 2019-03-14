# Generated by Django 2.1.7 on 2019-03-14 21:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('manufacturing_data', '0008_billofmaterial_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billofmaterial',
            name='manufacturer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='billofmaterial_requests_manufacturer', to='system_users.UserPartner'),
        ),
    ]
