from django.urls import path, include

urlpatterns = [
    path('auth/', include('apps.users.urls')),
    path('keywords/', include('apps.keywords.urls')),
    path('content/', include('apps.content.urls')),
    path('links/', include('apps.links.urls')),
    # More API endpoints will be added here
]
