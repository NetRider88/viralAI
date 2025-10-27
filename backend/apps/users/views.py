from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import update_session_auth_hash
from .models import User, UsageTracking
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    UsageTrackingSerializer
)
import logging

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint
    
    POST /api/auth/register/
    {
        "username": "john",
        "email": "john@example.com",
        "password": "SecurePass123!",
        "password2": "SecurePass123!",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        logger.info(f"New user registered: {user.email}")
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    User login endpoint
    
    POST /api/auth/login/
    {
        "email": "john@example.com",
        "password": "SecurePass123!"
    }
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Update last login
        user.last_login_at = user.last_login
        user.save(update_fields=['last_login_at'])
        
        logger.info(f"User logged in: {user.email}")
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    User logout endpoint (blacklists refresh token)
    
    POST /api/auth/logout/
    {
        "refresh": "refresh_token_here"
    }
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            logger.info(f"User logged out: {request.user.email}")
            
            return Response(
                {"message": "Logout successful"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update user profile
    
    GET /api/auth/profile/
    PUT /api/auth/profile/
    PATCH /api/auth/profile/
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    Change user password
    
    POST /api/auth/change-password/
    {
        "old_password": "OldPass123!",
        "new_password": "NewPass123!",
        "new_password2": "NewPass123!"
    }
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {"old_password": ["Wrong password."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Update session to prevent logout
        update_session_auth_hash(request, user)
        
        logger.info(f"Password changed for user: {user.email}")
        
        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )


class UserUsageView(APIView):
    """
    Get current month usage statistics
    
    GET /api/auth/usage/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        from datetime import date
        
        current_month = date.today().replace(day=1)
        
        usage, created = UsageTracking.objects.get_or_create(
            user=request.user,
            month=current_month
        )
        
        # Get subscription limits
        tier_limits = {
            'free': {'content_blocks': 1, 'videos': 0, 'images': 1},
            'creator': {'content_blocks': 50, 'videos': 5, 'images': 50},
            'pro': {'content_blocks': 200, 'videos': 999, 'images': 200},
            'agency': {'content_blocks': 9999, 'videos': 9999, 'images': 9999},
        }
        
        limits = tier_limits.get(request.user.subscription_tier, tier_limits['free'])
        
        return Response({
            'usage': UsageTrackingSerializer(usage).data,
            'limits': limits,
            'tier': request.user.subscription_tier,
            'percentage_used': {
                'content_blocks': round((usage.content_blocks_created / limits['content_blocks']) * 100, 1) if limits['content_blocks'] > 0 else 0,
                'videos': round((usage.video_generations / limits['videos']) * 100, 1) if limits['videos'] > 0 else 0,
            }
        }, status=status.HTTP_200_OK)
