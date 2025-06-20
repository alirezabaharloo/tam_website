# Generated by Django 5.2.1 on 2025-05-31 23:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0017_alter_article_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='image',
        ),
        migrations.AddField(
            model_name='article',
            name='type',
            field=models.CharField(choices=[('TX', 'Text'), ('SS', 'Slide Show'), ('VD', 'Video')], default='TX', max_length=2),
        ),
        migrations.AddField(
            model_name='article',
            name='video_url',
            field=models.URLField(null=True),
        ),
        migrations.CreateModel(
            name='SlidShow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='slide-show-images')),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='article_images', to='blog.article')),
            ],
        ),
    ]
