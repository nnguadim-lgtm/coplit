import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator


User = get_user_model()


def document_upload_path(instance, filename):
    """Generate upload path for documents."""
    return f'documents/{instance.user.id}/{uuid.uuid4()}/{filename}'


def processed_document_upload_path(instance, filename):
    """Generate upload path for processed documents."""
    return f'processed/{instance.document.user.id}/{uuid.uuid4()}/{filename}'


class DocumentType(models.Model):
    """Document type classification for better formatting suggestions."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    default_formatting_config = models.JSONField(
        default=dict,
        help_text=_('Default formatting configuration for this document type')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Document Type')
        verbose_name_plural = _('Document Types')
        
    def __str__(self):
        return self.name


class Document(models.Model):
    """Main document model for uploaded Word files."""
    
    STATUS_CHOICES = [
        ('uploaded', _('Uploaded')),
        ('processing', _('Processing')),
        ('completed', _('Completed')),
        ('failed', _('Failed')),
        ('cancelled', _('Cancelled')),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document_type = models.ForeignKey(
        DocumentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents'
    )
    
    # File information
    original_filename = models.CharField(max_length=255)
    file = models.FileField(
        upload_to=document_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=['docx', 'doc'])]
    )
    file_size = models.PositiveIntegerField(help_text=_('File size in bytes'))
    file_hash = models.CharField(
        max_length=64,
        help_text=_('SHA256 hash for duplicate detection')
    )
    
    # Processing status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='uploaded'
    )
    processing_started_at = models.DateTimeField(null=True, blank=True)
    processing_completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    # Document metadata
    title = models.CharField(max_length=500, blank=True)
    language = models.CharField(
        max_length=5,
        choices=[('en', 'English'), ('ar', 'العربية'), ('mixed', 'Mixed')],
        default='en'
    )
    page_count = models.PositiveIntegerField(null=True, blank=True)
    word_count = models.PositiveIntegerField(null=True, blank=True)
    character_count = models.PositiveIntegerField(null=True, blank=True)
    
    # Virus scanning
    virus_scan_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', _('Pending')),
            ('clean', _('Clean')),
            ('infected', _('Infected')),
            ('failed', _('Failed')),
        ],
        default='pending'
    )
    virus_scan_result = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Document')
        verbose_name_plural = _('Documents')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['file_hash']),
        ]
        
    def __str__(self):
        return f"{self.original_filename} ({self.user.email})"
    
    @property
    def is_processing(self):
        """Check if document is currently being processed."""
        return self.status in ['uploaded', 'processing']
    
    @property
    def is_completed(self):
        """Check if document processing is completed."""
        return self.status == 'completed'


class ProcessedDocument(models.Model):
    """Processed/formatted document with PDF output."""
    
    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name='processed_document'
    )
    
    # Output files
    pdf_file = models.FileField(
        upload_to=processed_document_upload_path,
        null=True,
        blank=True
    )
    preview_image = models.ImageField(
        upload_to=processed_document_upload_path,
        null=True,
        blank=True,
        help_text=_('Preview image of first page')
    )
    
    # Processing metadata
    formatting_config = models.JSONField(
        help_text=_('Applied formatting configuration')
    )
    processing_time_seconds = models.FloatField(
        null=True,
        blank=True,
        help_text=_('Time taken to process the document')
    )
    output_page_count = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=_('Number of pages in output PDF')
    )
    output_file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text=_('Size of output PDF in bytes')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Processed Document')
        verbose_name_plural = _('Processed Documents')
        
    def __str__(self):
        return f"Processed: {self.document.original_filename}"


class DocumentShare(models.Model):
    """Sharing model for documents."""
    
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    shared_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shared_documents'
    )
    shared_with_email = models.EmailField()
    share_token = models.UUIDField(default=uuid.uuid4, unique=True)
    
    # Permissions
    can_view = models.BooleanField(default=True)
    can_download = models.BooleanField(default=False)
    
    # Expiration
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    accessed_at = models.DateTimeField(null=True, blank=True)
    access_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = _('Document Share')
        verbose_name_plural = _('Document Shares')
        unique_together = ['document', 'shared_with_email']
        
    def __str__(self):
        return f"{self.document.original_filename} shared with {self.shared_with_email}"
