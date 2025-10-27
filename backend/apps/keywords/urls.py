from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KeywordResearchViewSet

router = DefaultRouter()
router.register(r'', KeywordResearchViewSet, basename='keyword')

urlpatterns = [
    path('', include(router.urls)),
]
