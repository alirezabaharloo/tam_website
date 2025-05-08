from django.db import models
from accounts.models import User
from django.utils.text import slugify
from django_jalali.db import models as jmodels
from parler.models import TranslatableModel, TranslatedFields
from django.utils.translation import gettext_lazy as _
from uuid import uuid4
from .managers import ArticleManager

class Article(TranslatableModel):
    class Status(models.TextChoices):
        DRAFT = 'DR', 'Draft'
        ACCEPT = 'AC', 'Accept'
        REJECT = 'RJ', 'Reject'

    # Relationships
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='articles',
        null=True,
        help_text="The user who wrote this article"
    )

    # Translated fields
    translations = TranslatedFields(
        title=models.CharField(_("title"), max_length=250),
        body=models.TextField(_("body")),
    )

    # Core fields
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    # file fields
    image = models.ImageField(upload_to='articles/', null=True, blank=True)

    # Timestamps
    created_date = jmodels.jDateTimeField(
        auto_now_add=True,
        help_text="Date when the article was created"
    )
    updated_date = jmodels.jDateTimeField(
        auto_now=True,
        help_text="Date when the article was last modified"
    )


    # custom query set
    objects = ArticleManager()

    class Meta:
        ordering = ['-created_date']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

    def date_format(self, field, gregorian=False):
        """Returns date in Tehran-solar/Utc-gregorian timezone and date."""
        date = getattr(self, field)
        if gregorian:
            greg_date = date.togregorian()
            return greg_date.strftime('%Y-%m-%d at %H:%M:%S UTC')
        return date.strftime('%Y-%m-%d در %H:%M:%S')

    
    def get_title(self, language_code='fa'):
        if self.has_translation(language_code):
            return self.safe_translation_getter('title', language_code=language_code, default="")
        return ""

    def get_body(self, language_code='fa'):
        if self.has_translation(language_code):
            return self.safe_translation_getter('body', language_code=language_code, default="")
        return ""

    def __str__(self):
        return f"{self.get_title('en')}"

    def save(self, *args, **kwargs):
        title_en = self.get_title('en')
        slugified_title = slugify(title_en)
        if not self.slug or slugified_title != self.slug:
            self.slug = slugified_title or self.slug or uuid4()

        super().save(*args, **kwargs)

