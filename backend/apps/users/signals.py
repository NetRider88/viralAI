
# Listmonk Integration
from .listmonk import add_subscriber_to_listmonk

@receiver(post_save, sender=User)
def sync_new_user_to_listmonk(sender, instance, created, **kwargs):
    """Automatically add new users to Listmonk email list"""
    if created:
        add_subscriber_to_listmonk(
            email=instance.email,
            name=instance.get_full_name() or instance.email.split('@')[0],
            lists=[1]
        )
