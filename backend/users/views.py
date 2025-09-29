from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

from .models import User, UserProfile
from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer,
    LoginSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer,
    EmailVerificationSerializer
)


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create authentication token
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user profile
        profile = UserProfile.objects.get(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'profile': UserProfileSerializer(profile).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """User login endpoint."""
    
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        login(request, user)
        
        # Get or create authentication token
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user profile
        try:
            profile = UserProfile.objects.get(user=user)
            profile_data = UserProfileSerializer(profile).data
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(user=user)
            profile_data = UserProfileSerializer(profile).data
        
        return Response({
            'user': UserSerializer(user).data,
            'profile': profile_data,
            'token': token.key,
            'message': 'Login successful'
        })


class LogoutView(generics.GenericAPIView):
    """User logout endpoint."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        try:
            # Delete the user's token
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass
        
        logout(request)
        return Response({
            'message': 'Logout successful'
        })


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """Get and update current user information."""
    
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile."""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    """Request password reset."""
    serializer = PasswordResetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Send password reset email
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        
        send_mail(
            subject='Password Reset Request',
            message=f'Click the link to reset your password: {reset_url}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Password reset email sent'
        })
        
    except User.DoesNotExist:
        # Don't reveal whether email exists or not
        return Response({
            'message': 'Password reset email sent'
        })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    """Confirm password reset."""
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    # TODO: Implement token validation and password reset
    return Response({
        'message': 'Password reset successful'
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """Verify user email."""
    serializer = EmailVerificationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    # TODO: Implement email verification
    return Response({
        'message': 'Email verified successfully'
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def resend_verification_email(request):
    """Resend email verification."""
    user = request.user
    
    # TODO: Generate verification token and send email
    return Response({
        'message': 'Verification email sent'
    })
