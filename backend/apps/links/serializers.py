from rest_framework import serializers
from .models import TrackableLink, LinkClick


class LinkClickSerializer(serializers.ModelSerializer):
    """Serializer for link clicks"""
    
    class Meta:
        model = LinkClick
        fields = [
            'id',
            'ip_address',
            'user_agent',
            'referer',
            'country',
            'city',
            'region',
            'device_type',
            'browser',
            'os',
            'is_unique',
            'clicked_at',
        ]
        read_only_fields = fields


class TrackableLinkSerializer(serializers.ModelSerializer):
    """Serializer for trackable links"""
    
    total_clicks = serializers.IntegerField(source='clicks', read_only=True)
    unique_clicks = serializers.IntegerField(source='unique_visitors', read_only=True)
    original_url = serializers.URLField(source='destination_url')
    
    class Meta:
        model = TrackableLink
        fields = [
            'id',
            'original_url',
            'short_code',
            'custom_slug',
            'platform',
            'title',
            'description',
            'campaign',
            'total_clicks',
            'unique_clicks',
            'conversions',
            'revenue',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'short_code', 'total_clicks', 'unique_clicks', 'conversions', 'revenue', 'created_at']


class TrackableLinkCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating trackable links"""
    
    original_url = serializers.URLField(source='destination_url')
    custom_slug = serializers.CharField(max_length=255, required=False, allow_blank=True)
    
    class Meta:
        model = TrackableLink
        fields = [
            'original_url',
            'custom_slug',
            'platform',
            'title',
            'description',
            'campaign',
        ]
    
    def validate_custom_slug(self, value):
        """Validate custom slug is unique"""
        if value and TrackableLink.objects.filter(short_code=value).exists():
            raise serializers.ValidationError("This custom slug is already taken")
        return value
    
    def create(self, validated_data):
        custom_slug = validated_data.pop('custom_slug', None)
        
        # If custom slug provided, use it as short_code
        if custom_slug:
            validated_data['short_code'] = custom_slug
        
        return TrackableLink.objects.create(**validated_data)
