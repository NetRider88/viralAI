from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse
from .models import TrackableLink, LinkClick
from .serializers import TrackableLinkSerializer, TrackableLinkCreateSerializer, LinkClickSerializer
import qrcode
from io import BytesIO
import logging

logger = logging.getLogger(__name__)


class TrackableLinkViewSet(viewsets.ModelViewSet):
    """API endpoint for trackable links"""
    
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TrackableLinkCreateSerializer
        return TrackableLinkSerializer
    
    def get_queryset(self):
        """Return links for current user"""
        return TrackableLink.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create link for current user"""
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Override create to return full serialized data"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return full serialized data using TrackableLinkSerializer
        instance = serializer.instance
        output_serializer = TrackableLinkSerializer(instance)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['get'])
    def qr_code(self, request, pk=None):
        """Generate QR code for link"""
        link = self.get_object()
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        
        # Use the full URL
        short_url = f"{request.build_absolute_uri('/')[:-1]}/l/{link.short_code}"
        qr.add_data(short_url)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to bytes
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        return HttpResponse(buffer.getvalue(), content_type='image/png')
    
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get detailed analytics for link"""
        link = self.get_object()
        
        # Get recent clicks
        recent_clicks = LinkClick.objects.filter(link=link).order_by('-clicked_at')[:100]
        
        # Aggregate data
        clicks_by_country = {}
        clicks_by_device = {}
        clicks_by_browser = {}
        
        for click in recent_clicks:
            # Country
            country = click.country or 'Unknown'
            clicks_by_country[country] = clicks_by_country.get(country, 0) + 1
            
            # Device
            device = click.device_type or 'Unknown'
            clicks_by_device[device] = clicks_by_device.get(device, 0) + 1
            
            # Browser
            browser = click.browser or 'Unknown'
            clicks_by_browser[browser] = clicks_by_browser.get(browser, 0) + 1
        
        return Response({
            'link': TrackableLinkSerializer(link).data,
            'recent_clicks': LinkClickSerializer(recent_clicks[:20], many=True).data,
            'clicks_by_country': clicks_by_country,
            'clicks_by_device': clicks_by_device,
            'clicks_by_browser': clicks_by_browser,
        })


def redirect_short_link(request, short_code):
    """Redirect short link and track click"""
    
    # Get link
    link = get_object_or_404(TrackableLink, short_code=short_code, is_active=True)
    
    # Track click
    try:
        # Get request data
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        referer = request.META.get('HTTP_REFERER', '')
        
        # Parse user agent for device/browser info
        device_type = parse_device_type(user_agent)
        browser = parse_browser(user_agent)
        os = parse_os(user_agent)
        
        # Check if unique (simple check based on IP)
        is_unique = not LinkClick.objects.filter(
            link=link,
            ip_address=ip_address
        ).exists()
        
        # Create click record
        LinkClick.objects.create(
            link=link,
            ip_address=ip_address,
            user_agent=user_agent,
            referer=referer,
            device_type=device_type,
            browser=browser,
            os=os,
            is_unique=is_unique
        )
        
        # Update link metrics
        link.clicks += 1
        if is_unique:
            link.unique_visitors += 1
        link.save(update_fields=['clicks', 'unique_visitors'])
        
    except Exception as e:
        logger.error(f"Error tracking click: {str(e)}")
    
    # Redirect to destination
    return redirect(link.destination_url)


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def parse_device_type(user_agent):
    """Parse device type from user agent"""
    user_agent = user_agent.lower()
    if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
        return 'mobile'
    elif 'tablet' in user_agent or 'ipad' in user_agent:
        return 'tablet'
    else:
        return 'desktop'


def parse_browser(user_agent):
    """Parse browser from user agent"""
    user_agent = user_agent.lower()
    if 'chrome' in user_agent:
        return 'Chrome'
    elif 'firefox' in user_agent:
        return 'Firefox'
    elif 'safari' in user_agent:
        return 'Safari'
    elif 'edge' in user_agent:
        return 'Edge'
    elif 'opera' in user_agent:
        return 'Opera'
    else:
        return 'Other'


def parse_os(user_agent):
    """Parse OS from user agent"""
    user_agent = user_agent.lower()
    if 'windows' in user_agent:
        return 'Windows'
    elif 'mac' in user_agent:
        return 'macOS'
    elif 'linux' in user_agent:
        return 'Linux'
    elif 'android' in user_agent:
        return 'Android'
    elif 'ios' in user_agent or 'iphone' in user_agent or 'ipad' in user_agent:
        return 'iOS'
    else:
        return 'Other'
