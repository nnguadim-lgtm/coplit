from rest_framework import serializers
from .models import FontFamily, FormattingTemplate, FormattingConfiguration, UserFormattingPreset


class FontFamilySerializer(serializers.ModelSerializer):
    """Serializer for FontFamily model."""
    
    class Meta:
        model = FontFamily
        fields = [
            'id', 'name', 'display_name', 'font_type', 'supports_rtl',
            'is_system_font', 'is_active'
        ]


class FormattingConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for FormattingConfiguration model."""
    
    body_font_name = serializers.CharField(source='body_font.name', read_only=True)
    heading_font_name = serializers.CharField(source='heading_font.name', read_only=True)
    
    class Meta:
        model = FormattingConfiguration
        fields = [
            'id', 'page_size', 'page_orientation', 'margin_top', 'margin_bottom',
            'margin_left', 'margin_right', 'body_font', 'body_font_name',
            'body_font_size', 'heading_font', 'heading_font_name', 'heading_font_size',
            'line_spacing', 'paragraph_spacing_before', 'paragraph_spacing_after',
            'text_alignment', 'text_direction', 'include_header', 'header_text',
            'include_footer', 'footer_text', 'include_page_numbers',
            'page_number_position', 'first_line_indent', 'hanging_indent',
            'column_count', 'column_spacing', 'include_toc', 'toc_depth',
            'include_bibliography', 'bibliography_style', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class FormattingTemplateSerializer(serializers.ModelSerializer):
    """Serializer for FormattingTemplate model."""
    
    class Meta:
        model = FormattingTemplate
        fields = [
            'id', 'name', 'description', 'category', 'config',
            'preview_image', 'usage_count', 'is_premium', 'is_active'
        ]


class UserFormattingPresetSerializer(serializers.ModelSerializer):
    """Serializer for UserFormattingPreset model."""
    
    formatting_config = FormattingConfigurationSerializer(read_only=True)
    
    class Meta:
        model = UserFormattingPreset
        fields = [
            'id', 'name', 'description', 'formatting_config',
            'is_default', 'usage_count', 'created_at', 'updated_at'
        ]


class ProcessDocumentSerializer(serializers.Serializer):
    """Serializer for document processing request."""
    
    document_id = serializers.UUIDField()
    formatting_config = serializers.JSONField()
    
    def validate_formatting_config(self, value):
        """Validate formatting configuration."""
        required_fields = [
            'page_size', 'page_orientation', 'body_font', 'body_font_size',
            'text_alignment', 'text_direction'
        ]
        
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Missing required field: {field}")
        
        return value


class PreviewDocumentSerializer(serializers.Serializer):
    """Serializer for document preview request."""
    
    document_id = serializers.UUIDField()
    formatting_config = serializers.JSONField()


class TaskStatusSerializer(serializers.Serializer):
    """Serializer for task status response."""
    
    task_id = serializers.CharField()
    status = serializers.ChoiceField(choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ])
    progress = serializers.IntegerField(min_value=0, max_value=100)
    result = serializers.JSONField(required=False)
    error = serializers.CharField(required=False)
    estimated_completion = serializers.DateTimeField(required=False)


class FormattingSuggestionSerializer(serializers.Serializer):
    """Serializer for formatting suggestions."""
    
    suggested_templates = FormattingTemplateSerializer(many=True)
    detected_language = serializers.ChoiceField(choices=[
        ('en', 'English'),
        ('ar', 'Arabic'),
        ('mixed', 'Mixed'),
    ])
    document_type = serializers.CharField()
    confidence_score = serializers.FloatField(min_value=0, max_value=1)
    recommendations = serializers.ListField(
        child=serializers.DictField()
    )