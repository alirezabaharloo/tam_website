# Generated by Django 5.1.7 on 2025-05-02 11:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_ipaddress'),
        ('blog', '0014_remove_article_hits_delete_articlemiddel'),
    ]

    operations = [
        migrations.DeleteModel(
            name='IpAddress',
        ),
    ]
