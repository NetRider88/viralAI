from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(['GET'])
def home(request):
    return JsonResponse({
        'message': 'Welcome to VIRAL.AI API',
        'version': '1.0.0',
        'status': 'operational',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'docs': '/api/docs/',
            'short_links': '/l/<short_code>/'
        }
    })

@require_http_methods(['GET'])
def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'viral-ai',
        'database': 'connected'
    })
