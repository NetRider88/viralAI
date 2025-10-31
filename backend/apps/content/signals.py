from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date
from apps.content.models import ContentBlock
from apps.keywords.models import KeywordResearch
from apps.users.models import UsageTracking

@receiver(post_save, sender=ContentBlock)
def track_content_creation(sender, instance, created, **kwargs):
    if created:
        current_month = date.today().replace(day=1)
        usage, _ = UsageTracking.objects.get_or_create(
            user=instance.user,
            month=current_month
        )
        usage.content_blocks_created += 1
        usage.save()

@receiver(post_save, sender=KeywordResearch)
def track_keyword_research(sender, instance, created, **kwargs):
    if created:
        current_month = date.today().replace(day=1)
        usage, _ = UsageTracking.objects.get_or_create(
            user=instance.user,
            month=current_month
        )
        usage.api_calls += 1
        usage.save()

def track_image_generation(user):
    current_month = date.today().replace(day=1)
    usage, _ = UsageTracking.objects.get_or_create(
        user=user,
        month=current_month
    )
    usage.image_generations += 1
    usage.save()

def track_video_generation(user):
    current_month = date.today().replace(day=1)
    usage, _ = UsageTracking.objects.get_or_create(
        user=user,
        month=current_month
    )
    usage.video_generations += 1
    usage.save()
