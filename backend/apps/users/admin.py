from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Subscription, UsageTracking, TeamMember


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'subscription_tier', 'subscription_status', 'created_at']
    list_filter = ['subscription_tier', 'subscription_status', 'is_staff', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Subscription Info', {
            'fields': ('subscription_tier', 'subscription_status', 'stripe_customer_id', 'avatar_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_login_at')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'tier', 'status', 'current_period_end', 'cancel_at_period_end']
    list_filter = ['tier', 'status', 'cancel_at_period_end']
    search_fields = ['user__email', 'stripe_subscription_id']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UsageTracking)
class UsageTrackingAdmin(admin.ModelAdmin):
    list_display = ['user', 'month', 'content_blocks_created', 'video_generations', 'api_calls']
    list_filter = ['month']
    search_fields = ['user__email']
    readonly_fields = ['updated_at']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['member', 'team_owner', 'role', 'is_active', 'invited_at']
    list_filter = ['role', 'is_active']
    search_fields = ['member__email', 'team_owner__email']
