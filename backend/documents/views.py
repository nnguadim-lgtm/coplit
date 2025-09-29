import hashlib
import uuid
from rest_framework import status, generics, permissions, filters, serializers
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from .models import Document, ProcessedDocument, DocumentType, DocumentShare
from .serializers import (
    DocumentSerializer, DocumentUploadSerializer, ProcessedDocumentSerializer,
    DocumentTypeSerializer, DocumentShareSerializer, DocumentShareCreateSerializer
)


class DocumentTypeViewSet(ModelViewSet):
    """ViewSet for DocumentType model."""
    
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class DocumentViewSet(ModelViewSet):
    """ViewSet for Document model."""
    
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'language', 'document_type']
    search_fields = ['original_filename', 'title']
    ordering_fields = ['created_at', 'updated_at', 'original_filename']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentUploadSerializer
        return DocumentSerializer
    
    def perform_create(self, serializer):
        """Handle document upload."""
        file = serializer.validated_data['file']
        
        # Generate file hash for duplicate detection
        file_hash = hashlib.sha256()
        for chunk in file.chunks():
            file_hash.update(chunk)
        
        # Check for duplicates
        existing_doc = Document.objects.filter(
            user=self.request.user,
            file_hash=file_hash.hexdigest()
        ).first()
        
        if existing_doc:
            raise serializers.ValidationError({
                'file': 'This document has already been uploaded.'
            })
        
        # Save document
        document = serializer.save(
            user=self.request.user,
            original_filename=file.name,
            file_size=file.size,
            file_hash=file_hash.hexdigest()
        )
        
        # TODO: Trigger virus scan and document analysis
        # For now, mark as clean
        document.virus_scan_status = 'clean'
        document.save()
        
        return document
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download original document."""
        document = self.get_object()
        
        if not document.file:
            return Response(
                {'error': 'File not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        response = HttpResponse(
            document.file.read(),
            content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        response['Content-Disposition'] = f'attachment; filename="{document.original_filename}"'
        return response
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """Download processed PDF."""
        document = self.get_object()
        
        try:
            processed = document.processed_document
            if not processed.pdf_file:
                return Response(
                    {'error': 'PDF not available'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            response = HttpResponse(
                processed.pdf_file.read(),
                content_type='application/pdf'
            )
            filename = document.original_filename.rsplit('.', 1)[0] + '.pdf'
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
            
        except ProcessedDocument.DoesNotExist:
            return Response(
                {'error': 'Document not processed yet'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Get document processing status."""
        document = self.get_object()
        
        data = {
            'status': document.status,
            'progress': 100 if document.status == 'completed' else 0,
            'stage': document.status,
        }
        
        if document.error_message:
            data['error'] = document.error_message
        
        return Response(data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel document processing."""
        document = self.get_object()
        
        if document.status in ['uploaded', 'processing']:
            document.status = 'cancelled'
            document.save()
            return Response({'message': 'Processing cancelled'})
        
        return Response(
            {'error': 'Cannot cancel processing at this stage'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Share document with another user."""
        document = self.get_object()
        serializer = DocumentShareCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create document share
        share = DocumentShare.objects.create(
            document=document,
            shared_by=request.user,
            **serializer.validated_data
        )
        
        # Generate share URL
        share_url = f"{request.build_absolute_uri('/')[:-1]}/shared/{share.share_token}/"
        
        return Response({
            'share_token': str(share.share_token),
            'share_url': share_url
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def shares(self, request, pk=None):
        """Get document shares."""
        document = self.get_object()
        shares = document.shares.all()
        serializer = DocumentShareSerializer(shares, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['delete'], url_path='shares/(?P<share_id>[^/.]+)')
    def revoke_share(self, request, pk=None, share_id=None):
        """Revoke document share."""
        document = self.get_object()
        
        try:
            share = document.shares.get(id=share_id, shared_by=request.user)
            share.delete()
            return Response({'message': 'Share revoked'})
        except DocumentShare.DoesNotExist:
            return Response(
                {'error': 'Share not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get document analytics."""
        document = self.get_object()
        
        # Calculate analytics
        shares_count = document.shares.count()
        
        data = {
            'views': 0,  # TODO: Implement view tracking
            'downloads': 0,  # TODO: Implement download tracking
            'shares': shares_count,
            'processing_time': 0,  # TODO: Get from processed document
            'file_size_mb': round(document.file_size / (1024 * 1024), 2),
            'page_count': document.page_count or 0,
        }
        
        return Response(data)


class ProcessedDocumentView(generics.RetrieveAPIView):
    """Retrieve processed document details."""
    
    serializer_class = ProcessedDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        document_id = self.kwargs['document_id']
        document = get_object_or_404(
            Document,
            id=document_id,
            user=self.request.user
        )
        
        try:
            return document.processed_document
        except ProcessedDocument.DoesNotExist:
            raise Http404("Processed document not found")


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def shared_document_view(request, share_token):
    """View shared document."""
    try:
        share = DocumentShare.objects.get(
            share_token=share_token,
            is_active=True
        )
        
        # Check if share has expired
        if share.expires_at and share.expires_at < timezone.now():
            return Response(
                {'error': 'Share link has expired'},
                status=status.HTTP_410_GONE
            )
        
        # Update access tracking
        share.access_count += 1
        share.accessed_at = timezone.now()
        share.save()
        
        # Return document info based on permissions
        document_data = DocumentSerializer(share.document).data
        
        data = {
            'document': document_data,
            'can_view': share.can_view,
            'can_download': share.can_download,
            'shared_by': share.shared_by.email,
        }
        
        return Response(data)
        
    except DocumentShare.DoesNotExist:
        return Response(
            {'error': 'Invalid share link'},
            status=status.HTTP_404_NOT_FOUND
        )
