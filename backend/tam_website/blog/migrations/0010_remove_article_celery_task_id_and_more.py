# Generated by Django 5.2.1 on 2025-07-29 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_article_celery_task_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='celery_task_id',
        ),
        migrations.AddField(
            model_name='article',
            name='scheduled_task_id',
            field=models.CharField(blank=True, help_text='Celery task ID for scheduled publication', max_length=255, null=True),
        ),
    ]
