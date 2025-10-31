from django.urls import path, include
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(['GET'])
def api_root(request):
    return JsonResponse({
        'message': 'VIRAL.AI API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth/',
            'keywords': '/api/keywords/',
            'content': '/api/content/',
            'links': '/api/links/',
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('auth/', include('apps.users.urls')),
    path('keywords/', include('apps.keywords.urls')),
    path('content/', include('apps.content.urls')),
    path('links/', include('apps.links.urls')),
]
