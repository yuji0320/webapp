# Generated by Django 2.1.7 on 2019-03-15 00:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('manufacturing_data', '0012_billofmaterial'),
    ]

    operations = [
        migrations.AddField(
            model_name='billofmaterial',
            name='job_order',
            field=models.ForeignKey(default='e6fe81ef-f2a8-45ac-9dfb-6e282737343f', on_delete=django.db.models.deletion.PROTECT, to='manufacturing_data.JobOrder'),
            preserve_default=False,
        ),
    ]
