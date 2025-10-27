from rest_framework import serializers
from .models import ContentBlock, PlatformContent, BrandKit, ImageLibrary


class ContentBlockSerializer(serializers.ModelSerializer):
    """Serializer for content blocks"""
    
    platform_versions = serializers.SerializerMethodField()
    
    class Meta:
        model = ContentBlock
        fields = [
            'id',
            'title',
            'keyword_text',
            'niche',
            'content_angle',
            'tone',
            'status',
            'total_reach',
            'total_engagement',
            'total_clicks',
            'total_conversions',
            'revenue_generated',
            'platform_versions',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_reach', 'total_engagement', 'total_clicks']
    
    def get_platform_versions(self, obj):
        """Get all platform versions"""
        return PlatformContentSerializer(obj.platform_versions.all(), many=True).data


class PlatformContentSerializer(serializers.ModelSerializer):
    """Serializer for platform-specific content"""
    
    class Meta:
        model = PlatformContent
        fields = [
            'id',
            'platform',
            'content_type',
            'caption',
            'hashtags',
            'content_data',
            'images',
            'video_script',
            'video_url',
            'trackable_link',
            'posted_at',
            'reach',
            'engagement',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'reach', 'engagement']


class ContentGenerationRequestSerializer(serializers.Serializer):
    """Serializer for content generation request"""
    
    keyword = serializers.CharField(max_length=255)
    platforms = serializers.ListField(
        child=serializers.ChoiceField(choices=['instagram', 'tiktok', 'linkedin', 'twitter', 'facebook', 'youtube']),
        min_length=1
    )
    content_type = serializers.CharField(max_length=100, required=False, default='post')
    tone = serializers.CharField(max_length=100, required=False, default='professional')
    audience_type = serializers.CharField(max_length=100, required=False, default='general')
    angle = serializers.CharField(max_length=100, required=False, default='informative')
    niche = serializers.CharField(max_length=100, required=False, allow_blank=True)
    generation_mode = serializers.ChoiceField(choices=['both', 'text', 'image'], default='both', required=False)
    image_count = serializers.IntegerField(min_value=1, max_value=10, default=1)
    generate_video_script = serializers.BooleanField(default=False)
    custom_prompt = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    adapt_from = serializers.CharField(max_length=100, required=False, allow_blank=True)


class ImageGenerationRequestSerializer(serializers.Serializer):
    """Serializer for image generation request"""
    
    prompt = serializers.CharField(max_length=1000)
    style = serializers.ChoiceField(choices=['natural', 'vivid'], default='natural')
    size = serializers.ChoiceField(
        choices=['1024x1024', '1024x1792', '1792x1024'],
        default='1024x1024'
    )


class BrandKitSerializer(serializers.ModelSerializer):
    """Serializer for brand kits"""
    
    class Meta:
        model = BrandKit
        fields = [
            'id',
            'name',
            'logo_url',
            'colors',
            'fonts',
            'watermark_settings',
            'is_default',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class ImageLibrarySerializer(serializers.ModelSerializer):
    """Serializer for image library"""
    
    class Meta:
        model = ImageLibrary
        fields = [
            'id',
            'filename',
            'file_url',
            'file_size',
            'width',
            'height',
            'mime_type',
            'folder',
            'tags',
            'is_ai_generated',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
