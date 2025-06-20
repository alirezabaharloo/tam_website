# Generated by Django 5.2.1 on 2025-06-07 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0021_remove_image_article_image_article'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='category',
            field=models.ManyToManyField(help_text='The category of this article', to='blog.category'),
        ),
        migrations.DeleteModel(
            name='Comment',
        ),
    ]
