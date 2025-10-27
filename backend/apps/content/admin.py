from django.contrib import admin
from .models import ContentBlock, PlatformContent, BrandKit, ImageLibrary


class PlatformContentInline(admin.TabularInline):
    model = PlatformContent
    extra = 0
    fields = ['platform', 'content_type', 'posted_at', 'reach', 'engagement']
    readonly_fields = ['reach', 'engagement']


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'keyword_text', 'status', 'total_reach', 'total_engagement', 'created_at']
    list_filter = ['status', 'niche', 'created_at']
    search_fields = ['title', 'keyword_text', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'total_reach', 'total_engagement', 'total_clicks']
    inlines = [PlatformContentInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'keyword', 'title', 'keyword_text', 'niche')
        }),
        ('Content Settings', {
            'fields': ('content_angle', 'tone', 'status')
        }),
        ('Performance Metrics', {
            'fields': ('total_reach', 'total_engagement', 'total_clicks', 'total_conversions', 'revenue_generated'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PlatformContent)
class PlatformContentAdmin(admin.ModelAdmin):
    list_display = ['content_block', 'platform', 'content_type', 'posted_at', 'reach', 'engagement']
    list_filter = ['platform', 'content_type', 'posted_at']
    search_fields = ['content_block__title', 'caption']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(BrandKit)
class BrandKitAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_default', 'created_at']
    list_filter = ['is_default']
    search_fields = ['name', 'user__email']


@admin.register(ImageLibrary)
class ImageLibraryAdmin(admin.ModelAdmin):
    list_display = ['filename', 'user', 'folder', 'file_size', 'is_ai_generated', 'created_at']
    list_filter = ['is_ai_generated', 'folder', 'created_at']
    search_fields = ['filename', 'user__email', 'tags']
