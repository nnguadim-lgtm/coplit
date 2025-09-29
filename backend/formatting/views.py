import uuid
import json
from rest_framework import status, generics, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta

from documents.models import Document
from .models import FontFamily, FormattingTemplate, FormattingConfiguration, UserFormattingPreset
from .serializers import (
    FontFamilySerializer, FormattingTemplateSerializer, FormattingConfigurationSerializer,
    UserFormattingPresetSerializer, ProcessDocumentSerializer, PreviewDocumentSerializer,
    TaskStatusSerializer, FormattingSuggestionSerializer
)


class FontFamilyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for FontFamily model."""
    
    queryset = FontFamily.objects.filter(is_active=True)
    serializer_class = FontFamilySerializer
    permission_classes = [permissions.IsAuthenticated]


class FormattingTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for FormattingTemplate model."""
    
    serializer_class = FormattingTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = FormattingTemplate.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset.order_by('-usage_count', 'name')


class FormattingConfigurationViewSet(viewsets.ModelViewSet):
    """ViewSet for FormattingConfiguration model."""
    
    serializer_class = FormattingConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Return configurations that belong to user's presets
        return FormattingConfiguration.objects.filter(
            user_preset__user=self.request.user
        )


class UserFormattingPresetViewSet(viewsets.ModelViewSet):
    """ViewSet for UserFormattingPreset model."""
    
    serializer_class = UserFormattingPresetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserFormattingPreset.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Create formatting configuration first
        config_data = self.request.data.get('formatting_config', {})
        config = FormattingConfiguration.objects.create(**config_data)
        
        # Create preset
        preset = serializer.save(
            user=self.request.user,
            formatting_config=config
        )
        
        # If this is marked as default, unset other defaults
        if preset.is_default:
            UserFormattingPreset.objects.filter(
                user=self.request.user,
                is_default=True
            ).exclude(id=preset.id).update(is_default=False)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_document(request):
    """Process document with formatting configuration."""
    serializer = ProcessDocumentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    document_id = serializer.validated_data['document_id']
    formatting_config = serializer.validated_data['formatting_config']
    
    # Verify document belongs to user
    document = get_object_or_404(
        Document,
        id=document_id,
        user=request.user
    )
    
    # Check if document is already being processed
    if document.status == 'processing':
        return Response(
            {'error': 'Document is already being processed'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate task ID
    task_id = str(uuid.uuid4())
    
    # Update document status
    document.status = 'processing'
    document.processing_started_at = timezone.now()
    document.save()
    
    # Store task in cache for status tracking
    cache.set(f'task_{task_id}', {
        'status': 'processing',
        'progress': 0,
        'document_id': str(document_id),
        'started_at': timezone.now().isoformat(),
    }, timeout=3600)  # 1 hour
    
    # TODO: Queue document processing task with Celery
    # For now, simulate immediate processing
    estimated_completion = timezone.now() + timedelta(minutes=5)
    
    return Response({
        'task_id': task_id,
        'status': 'processing',
        'estimated_completion': estimated_completion.isoformat(),
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_preview(request):
    """Generate document preview with formatting."""
    serializer = PreviewDocumentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    document_id = serializer.validated_data['document_id']
    formatting_config = serializer.validated_data['formatting_config']
    
    # Verify document belongs to user
    document = get_object_or_404(
        Document,
        id=document_id,
        user=request.user
    )
    
    # TODO: Generate actual preview
    # For now, return mock preview URLs
    preview_url = f"/api/v1/documents/{document_id}/preview/"
    preview_image = f"/api/v1/documents/{document_id}/preview-image/"
    
    return Response({
        'preview_url': preview_url,
        'preview_image': preview_image,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_task_status(request, task_id):
    """Get processing task status."""
    task_data = cache.get(f'task_{task_id}')
    
    if not task_data:
        return Response(
            {'error': 'Task not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if task belongs to user
    document_id = task_data.get('document_id')
    if document_id:
        try:
            Document.objects.get(id=document_id, user=request.user)
        except Document.DoesNotExist:
            return Response(
                {'error': 'Task not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    return Response({
        'task_id': task_id,
        'status': task_data.get('status', 'unknown'),
        'progress': task_data.get('progress', 0),
        'result': task_data.get('result'),
        'error': task_data.get('error'),
        'estimated_completion': task_data.get('estimated_completion'),
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def validate_formatting_config(request):
    """Validate formatting configuration."""
    config = request.data.get('config', {})
    
    errors = {}
    warnings = {}
    
    # Validate required fields
    required_fields = {
        'page_size': ['A4', 'Letter', 'Legal', 'A3', 'A5'],
        'page_orientation': ['portrait', 'landscape'],
        'text_alignment': ['left', 'right', 'center', 'justify'],
        'text_direction': ['ltr', 'rtl', 'auto'],
    }
    
    for field, valid_values in required_fields.items():
        if field not in config:
            errors[field] = ['This field is required']
        elif config[field] not in valid_values:
            errors[field] = [f'Invalid value. Must be one of: {", ".join(valid_values)}']
    
    # Validate numeric ranges
    numeric_validations = {
        'body_font_size': (8, 72),
        'heading_font_size': (8, 72),
        'line_spacing': (0.5, 3.0),
        'margin_top': (0, 144),
        'margin_bottom': (0, 144),
        'margin_left': (0, 144),
        'margin_right': (0, 144),
    }
    
    for field, (min_val, max_val) in numeric_validations.items():
        if field in config:
            try:
                value = float(config[field])
                if not (min_val <= value <= max_val):
                    errors[field] = [f'Value must be between {min_val} and {max_val}']
            except (ValueError, TypeError):
                errors[field] = ['Invalid numeric value']
    
    # Generate warnings for RTL content
    if config.get('text_direction') == 'rtl':
        if config.get('text_alignment') == 'left':
            warnings['text_alignment'] = ['Consider using right alignment for RTL text']
    
    return Response({
        'is_valid': len(errors) == 0,
        'errors': errors if errors else None,
        'warnings': warnings if warnings else None,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_formatting_suggestions(request, document_id):
    """Get formatting suggestions for a document."""
    document = get_object_or_404(
        Document,
        id=document_id,
        user=request.user
    )
    
    # TODO: Implement actual content analysis
    # For now, return mock suggestions
    
    # Detect language (mock)
    detected_language = 'en'
    if 'arabic' in document.original_filename.lower():
        detected_language = 'ar'
    
    # Get relevant templates
    suggested_templates = FormattingTemplate.objects.filter(
        is_active=True,
        is_premium=False  # Only free templates for now
    )[:3]
    
    # Generate recommendations
    recommendations = []
    if detected_language == 'ar':
        recommendations.append({
            'field': 'text_direction',
            'current_value': 'auto',
            'suggested_value': 'rtl',
            'reason': 'Arabic content detected, RTL direction recommended'
        })
        recommendations.append({
            'field': 'text_alignment',
            'current_value': 'justify',
            'suggested_value': 'right',
            'reason': 'Right alignment works better with RTL text'
        })
    
    return Response({
        'suggested_templates': FormattingTemplateSerializer(suggested_templates, many=True).data,
        'detected_language': detected_language,
        'document_type': 'general',
        'confidence_score': 0.85,
        'recommendations': recommendations,
    })
