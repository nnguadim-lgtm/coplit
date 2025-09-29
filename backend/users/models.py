from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Extended User model for Coplit SaaS application."""
    
    SUBSCRIPTION_TIERS = [
        ('free', _('Free')),
        ('pro', _('Pro')),
        ('team', _('Team')),
        ('enterprise', _('Enterprise')),
    ]
    
    email = models.EmailField(_('email address'), unique=True)
    subscription_tier = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_TIERS,
        default='free',
        help_text=_('User subscription tier')
    )
    documents_processed_this_month = models.PositiveIntegerField(
        default=0,
        help_text=_('Number of documents processed this month')
    )
    preferred_language = models.CharField(
        max_length=5,
        choices=[('en', 'English'), ('ar', 'العربية')],
        default='en',
        help_text=_('User preferred language')
    )
    company = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text=_('Company or organization name')
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text=_('Phone number for support')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        
    def __str__(self):
        return self.email
    
    @property
    def monthly_document_limit(self):
        """Return the monthly document processing limit based on subscription tier."""
        limits = {
            'free': 5,
            'pro': float('inf'),  # Unlimited
            'team': float('inf'),  # Unlimited
            'enterprise': float('inf'),  # Unlimited
        }
        return limits.get(self.subscription_tier, 5)
    
    def can_process_document(self):
        """Check if user can process another document this month."""
        return self.documents_processed_this_month < self.monthly_document_limit
    
    def increment_documents_processed(self):
        """Increment the documents processed counter."""
        self.documents_processed_this_month += 1
        self.save(update_fields=['documents_processed_this_month'])


class UserProfile(models.Model):
    """Additional profile information for users."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        help_text=_('User avatar image')
    )
    bio = models.TextField(
        blank=True,
        max_length=500,
        help_text=_('Short biography or description')
    )
    timezone = models.CharField(
        max_length=50,
        default='UTC',
        help_text=_('User timezone')
    )
    notification_preferences = models.JSONField(
        default=dict,
        help_text=_('User notification preferences')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
        
    def __str__(self):
        return f"{self.user.email} Profile"
