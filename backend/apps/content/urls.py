from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentBlockViewSet, BrandKitViewSet, ImageLibraryViewSet

router = DefaultRouter()
router.register(r'blocks', ContentBlockViewSet, basename='content-block')
router.register(r'brand-kits', BrandKitViewSet, basename='brand-kit')
router.register(r'images', ImageLibraryViewSet, basename='image-library')

urlpatterns = [
    path('', include(router.urls)),
]
