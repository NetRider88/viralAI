from django.contrib import admin
from .models import KeywordResearch


@admin.register(KeywordResearch)
class KeywordResearchAdmin(admin.ModelAdmin):
    list_display = ['keyword', 'user', 'country', 'language', 'search_volume', 'created_at']
    list_filter = ['country', 'language', 'created_at']
    search_fields = ['keyword', 'user__email']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('user', 'keyword', 'country', 'language')
        }),
        ('Search Data', {
            'fields': ('search_volume', 'trend_direction')
        }),
        ('Structured Data', {
            'fields': ('platform_breakdown', 'questions', 'prepositions', 'alphabetical', 'comparisons', 'related_keywords', 'viral_examples'),
            'classes': ('collapse',)
        }),
    )
