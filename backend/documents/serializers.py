from rest_framework import serializers
from .models import Document, ProcessedDocument, DocumentType, DocumentShare


class DocumentTypeSerializer(serializers.ModelSerializer):
    """Serializer for DocumentType model."""
    
    class Meta:
        model = DocumentType
        fields = ['id', 'name', 'description', 'default_formatting_config']


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model."""
    
    document_type = DocumentTypeSerializer(read_only=True)
    document_type_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Document
        fields = [
            'id', 'original_filename', 'file', 'file_size', 'file_hash',
            'status', 'processing_started_at', 'processing_completed_at',
            'error_message', 'title', 'language', 'page_count',
            'word_count', 'character_count', 'virus_scan_status',
            'virus_scan_result', 'document_type', 'document_type_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'file_size', 'file_hash', 'status', 'processing_started_at',
            'processing_completed_at', 'error_message', 'page_count',
            'word_count', 'character_count', 'virus_scan_status',
            'virus_scan_result', 'created_at', 'updated_at'
        ]


class DocumentUploadSerializer(serializers.ModelSerializer):
    """Serializer for document upload."""
    
    document_type_id = serializers.IntegerField(required=False)
    
    class Meta:
        model = Document
        fields = ['file', 'document_type_id', 'title']
        
    def validate_file(self, value):
        """Validate uploaded file."""
        # Check file size (50MB limit)
        max_size = 50 * 1024 * 1024  # 50MB
        if value.size > max_size:
            raise serializers.ValidationError(
                f"File size too large. Maximum size is {max_size // (1024 * 1024)}MB"
            )
        
        # Check file type
        allowed_types = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ]
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Invalid file type. Only Word documents (.docx, .doc) are allowed."
            )
        
        return value


class ProcessedDocumentSerializer(serializers.ModelSerializer):
    """Serializer for ProcessedDocument model."""
    
    document = DocumentSerializer(read_only=True)
    
    class Meta:
        model = ProcessedDocument
        fields = [
            'document', 'pdf_file', 'preview_image', 'formatting_config',
            'processing_time_seconds', 'output_page_count', 'output_file_size',
            'created_at', 'updated_at'
        ]


class DocumentShareSerializer(serializers.ModelSerializer):
    """Serializer for DocumentShare model."""
    
    document = DocumentSerializer(read_only=True)
    shared_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = DocumentShare
        fields = [
            'id', 'document', 'shared_by', 'shared_with_email', 'share_token',
            'can_view', 'can_download', 'expires_at', 'is_active',
            'created_at', 'accessed_at', 'access_count'
        ]
        read_only_fields = [
            'id', 'share_token', 'created_at', 'accessed_at', 'access_count'
        ]


class DocumentShareCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating document shares."""
    
    class Meta:
        model = DocumentShare
        fields = [
            'shared_with_email', 'can_view', 'can_download', 'expires_at'
        ]