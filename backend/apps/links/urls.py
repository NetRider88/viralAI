from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrackableLinkViewSet

router = DefaultRouter()
router.register(r'', TrackableLinkViewSet, basename='link')

urlpatterns = [
    path('', include(router.urls)),
]
