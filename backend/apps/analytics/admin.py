from django.contrib import admin
from .models import PlatformAnalytics, PlatformConnection


@admin.register(PlatformAnalytics)
class PlatformAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['platform_content', 'platform', 'metric_type', 'metric_value', 'recorded_at']
    list_filter = ['platform', 'metric_type', 'recorded_at']
    search_fields = ['platform_content__content_block__title']
    readonly_fields = ['recorded_at']


@admin.register(PlatformConnection)
class PlatformConnectionAdmin(admin.ModelAdmin):
    list_display = ['user', 'platform', 'platform_username', 'is_active', 'connected_at', 'last_synced_at']
    list_filter = ['platform', 'is_active', 'connected_at']
    search_fields = ['user__email', 'platform_username', 'platform_user_id']
    readonly_fields = ['connected_at']
    
    fieldsets = (
        ('Connection Info', {
            'fields': ('user', 'platform', 'platform_user_id', 'platform_username')
        }),
        ('OAuth Tokens', {
            'fields': ('access_token', 'refresh_token', 'token_expires_at'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active', 'connected_at', 'last_synced_at')
        }),
    )
