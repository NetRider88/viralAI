from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """Custom User model with subscription support"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    avatar_url = models.URLField(blank=True, null=True)
    
    # Subscription fields
    subscription_tier = models.CharField(
        max_length=50,
        choices=[
            ('free', 'Free'),
            ('creator', 'Creator'),
            ('pro', 'Pro'),
            ('agency', 'Agency'),
        ],
        default='free'
    )
    subscription_status = models.CharField(
        max_length=50,
        choices=[
            ('active', 'Active'),
            ('canceled', 'Canceled'),
            ('past_due', 'Past Due'),
            ('trialing', 'Trialing'),
        ],
        default='active'
    )
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email


class Subscription(models.Model):
    """User subscription details"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription_details')
    
    tier = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    
    # Stripe fields
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_price_id = models.CharField(max_length=255, blank=True, null=True)
    
    # Billing period
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
    
    def __str__(self):
        return f"{self.user.email} - {self.tier}"


class UsageTracking(models.Model):
    """Track monthly usage per user"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage_tracking')
    
    month = models.DateField()
    content_blocks_created = models.IntegerField(default=0)
    video_generations = models.IntegerField(default=0)
    api_calls = models.IntegerField(default=0)
    image_generations = models.IntegerField(default=0)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'usage_tracking'
        unique_together = ['user', 'month']
        ordering = ['-month']
    
    def __str__(self):
        return f"{self.user.email} - {self.month}"


class TeamMember(models.Model):
    """Team members for Pro/Agency plans"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_members')
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams')
    
    role = models.CharField(
        max_length=50,
        choices=[
            ('owner', 'Owner'),
            ('admin', 'Admin'),
            ('member', 'Member'),
        ],
        default='member'
    )
    permissions = models.JSONField(default=dict, blank=True)
    
    invited_at = models.DateTimeField(auto_now_add=True)
    joined_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'team_members'
        unique_together = ['team_owner', 'member']
    
    def __str__(self):
        return f"{self.member.email} in {self.team_owner.email}'s team"
