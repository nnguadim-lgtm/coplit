from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'subscription_tier', 'documents_processed_this_month',
            'preferred_language', 'company', 'phone_number',
            'date_joined', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'documents_processed_this_month', 'date_joined', 'created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    
    class Meta:
        model = UserProfile
        fields = [
            'avatar', 'bio', 'timezone', 'notification_preferences',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'password_confirm',
            'first_name', 'last_name', 'preferred_language', 'company'
        ]
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password')


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""
    
    token = serializers.CharField()
    password = serializers.CharField(validators=[validate_password])


class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification."""
    
    token = serializers.CharField()