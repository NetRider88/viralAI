from django.contrib import admin
from .models import TrackableLink, LinkClick


class LinkClickInline(admin.TabularInline):
    model = LinkClick
    extra = 0
    fields = ['clicked_at', 'country', 'device_type', 'browser', 'is_unique']
    readonly_fields = ['clicked_at', 'country', 'device_type', 'browser', 'is_unique']
    can_delete = False


@admin.register(TrackableLink)
class TrackableLinkAdmin(admin.ModelAdmin):
    list_display = ['short_code', 'user', 'platform', 'clicks', 'unique_visitors', 'conversions', 'created_at']
    list_filter = ['platform', 'is_active', 'created_at']
    search_fields = ['short_code', 'custom_slug', 'destination_url', 'user__email']
    readonly_fields = ['short_code', 'clicks', 'unique_visitors', 'created_at', 'full_url']
    inlines = [LinkClickInline]
    
    fieldsets = (
        ('Link Info', {
            'fields': ('user', 'content_block', 'platform', 'short_code', 'custom_slug', 'destination_url', 'full_url')
        }),
        ('Metrics', {
            'fields': ('clicks', 'unique_visitors', 'conversions', 'revenue')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
    )


@admin.register(LinkClick)
class LinkClickAdmin(admin.ModelAdmin):
    list_display = ['link', 'country', 'device_type', 'browser', 'is_unique', 'clicked_at']
    list_filter = ['country', 'device_type', 'browser', 'is_unique', 'clicked_at']
    search_fields = ['link__short_code', 'ip_address']
    readonly_fields = ['clicked_at']
