from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.links.views import redirect_short_link
from .views import home, health_check
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="VIRAL.AI API",
      default_version='v1',
      description="API documentation for VIRAL.AI",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@viral.ai-it.io"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', home, name='home'),
    path('health/', health_check, name='health_check'),
    path('management-portal-x7k9/', admin.site.urls),
    path('api/', include('viral_ai.api_urls')),
    path('l/<str:short_code>/', redirect_short_link, name='redirect_short_link'),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
