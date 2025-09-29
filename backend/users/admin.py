from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    """Inline admin for UserProfile."""
    model = UserProfile
    can_delete = False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model."""
    
    inlines = [UserProfileInline]
    
    list_display = [
        'email', 'username', 'first_name', 'last_name',
        'subscription_tier', 'documents_processed_this_month',
        'is_active', 'date_joined'
    ]
    list_filter = [
        'subscription_tier', 'preferred_language', 'is_active',
        'is_staff', 'date_joined'
    ]
    search_fields = ['email', 'username', 'first_name', 'last_name', 'company']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {
            'fields': ('username', 'first_name', 'last_name', 'company', 'phone_number')
        }),
        (_('Subscription'), {
            'fields': ('subscription_tier', 'documents_processed_this_month')
        }),
        (_('Preferences'), {
            'fields': ('preferred_language',)
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['documents_processed_this_month', 'date_joined', 'created_at', 'updated_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for UserProfile model."""
    
    list_display = ['user', 'timezone', 'created_at']
    list_filter = ['timezone', 'created_at']
    search_fields = ['user__email', 'user__username', 'bio']
    readonly_fields = ['created_at', 'updated_at']
