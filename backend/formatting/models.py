from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator


User = get_user_model()


class FontFamily(models.Model):
    """Available font families for document formatting."""
    
    FONT_TYPES = [
        ('latin', _('Latin')),
        ('arabic', _('Arabic')),
        ('mixed', _('Mixed (Latin + Arabic)')),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    display_name = models.CharField(max_length=100)
    font_type = models.CharField(max_length=20, choices=FONT_TYPES)
    font_file = models.FileField(
        upload_to='fonts/',
        blank=True,
        null=True,
        help_text=_('Font file (TTF/OTF)')
    )
    is_system_font = models.BooleanField(
        default=False,
        help_text=_('Whether this is a system font or custom uploaded font')
    )
    supports_rtl = models.BooleanField(
        default=False,
        help_text=_('Whether this font supports right-to-left text')
    )
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Font Family')
        verbose_name_plural = _('Font Families')
        ordering = ['display_name']
        
    def __str__(self):
        return self.display_name


class FormattingTemplate(models.Model):
    """Pre-defined formatting templates for different document types."""
    
    TEMPLATE_CATEGORIES = [
        ('academic', _('Academic')),
        ('business', _('Business')),
        ('legal', _('Legal')),
        ('government', _('Government')),
        ('personal', _('Personal')),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=TEMPLATE_CATEGORIES)
    
    # Template configuration
    config = models.JSONField(
        help_text=_('Complete formatting configuration as JSON')
    )
    
    # Preview
    preview_image = models.ImageField(
        upload_to='template_previews/',
        blank=True,
        null=True
    )
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    is_premium = models.BooleanField(
        default=False,
        help_text=_('Whether this template requires a premium subscription')
    )
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Formatting Template')
        verbose_name_plural = _('Formatting Templates')
        ordering = ['-usage_count', 'name']
        
    def __str__(self):
        return f"{self.name} ({self.category})"


class FormattingConfiguration(models.Model):
    """User's formatting configuration for a document."""
    
    # Page setup
    page_size = models.CharField(
        max_length=20,
        choices=[
            ('A4', 'A4'),
            ('Letter', 'Letter'),
            ('Legal', 'Legal'),
            ('A3', 'A3'),
            ('A5', 'A5'),
        ],
        default='A4'
    )
    page_orientation = models.CharField(
        max_length=20,
        choices=[
            ('portrait', _('Portrait')),
            ('landscape', _('Landscape')),
        ],
        default='portrait'
    )
    
    # Margins (in points)
    margin_top = models.FloatField(
        default=72,
        validators=[MinValueValidator(0), MaxValueValidator(144)]
    )
    margin_bottom = models.FloatField(
        default=72,
        validators=[MinValueValidator(0), MaxValueValidator(144)]
    )
    margin_left = models.FloatField(
        default=72,
        validators=[MinValueValidator(0), MaxValueValidator(144)]
    )
    margin_right = models.FloatField(
        default=72,
        validators=[MinValueValidator(0), MaxValueValidator(144)]
    )
    
    # Typography
    body_font = models.ForeignKey(
        FontFamily,
        on_delete=models.PROTECT,
        related_name='body_formatting_configs'
    )
    body_font_size = models.FloatField(
        default=12,
        validators=[MinValueValidator(8), MaxValueValidator(72)]
    )
    
    heading_font = models.ForeignKey(
        FontFamily,
        on_delete=models.PROTECT,
        related_name='heading_formatting_configs'
    )
    heading_font_size = models.FloatField(
        default=16,
        validators=[MinValueValidator(8), MaxValueValidator(72)]
    )
    
    # Line spacing
    line_spacing = models.FloatField(
        default=1.5,
        validators=[MinValueValidator(0.5), MaxValueValidator(3.0)]
    )
    paragraph_spacing_before = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(72)]
    )
    paragraph_spacing_after = models.FloatField(
        default=6,
        validators=[MinValueValidator(0), MaxValueValidator(72)]
    )
    
    # Text alignment
    text_alignment = models.CharField(
        max_length=20,
        choices=[
            ('left', _('Left')),
            ('right', _('Right')),
            ('center', _('Center')),
            ('justify', _('Justify')),
        ],
        default='justify'
    )
    
    # RTL/LTR settings
    text_direction = models.CharField(
        max_length=10,
        choices=[
            ('ltr', _('Left to Right')),
            ('rtl', _('Right to Left')),
            ('auto', _('Auto-detect')),
        ],
        default='auto'
    )
    
    # Headers and footers
    include_header = models.BooleanField(default=False)
    header_text = models.CharField(max_length=500, blank=True)
    include_footer = models.BooleanField(default=True)
    footer_text = models.CharField(max_length=500, blank=True)
    include_page_numbers = models.BooleanField(default=True)
    page_number_position = models.CharField(
        max_length=20,
        choices=[
            ('top_left', _('Top Left')),
            ('top_center', _('Top Center')),
            ('top_right', _('Top Right')),
            ('bottom_left', _('Bottom Left')),
            ('bottom_center', _('Bottom Center')),
            ('bottom_right', _('Bottom Right')),
        ],
        default='bottom_center'
    )
    
    # Advanced formatting
    first_line_indent = models.FloatField(
        default=0,
        validators=[MinValueValidator(-72), MaxValueValidator(72)]
    )
    hanging_indent = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(72)]
    )
    
    # Columns
    column_count = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(4)]
    )
    column_spacing = models.FloatField(
        default=12,
        validators=[MinValueValidator(0), MaxValueValidator(72)]
    )
    
    # Table of contents
    include_toc = models.BooleanField(default=False)
    toc_depth = models.PositiveIntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(6)]
    )
    
    # Bibliography
    include_bibliography = models.BooleanField(default=False)
    bibliography_style = models.CharField(
        max_length=50,
        choices=[
            ('apa', 'APA'),
            ('mla', 'MLA'),
            ('chicago', 'Chicago'),
            ('harvard', 'Harvard'),
        ],
        default='apa'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Formatting Configuration')
        verbose_name_plural = _('Formatting Configurations')
        
    def __str__(self):
        return f"Format Config - {self.page_size} {self.page_orientation}"
    
    def to_dict(self):
        """Convert configuration to dictionary for processing."""
        return {
            'page_setup': {
                'size': self.page_size,
                'orientation': self.page_orientation,
                'margins': {
                    'top': self.margin_top,
                    'bottom': self.margin_bottom,
                    'left': self.margin_left,
                    'right': self.margin_right,
                }
            },
            'typography': {
                'body_font': self.body_font.name,
                'body_font_size': self.body_font_size,
                'heading_font': self.heading_font.name,
                'heading_font_size': self.heading_font_size,
                'line_spacing': self.line_spacing,
                'paragraph_spacing_before': self.paragraph_spacing_before,
                'paragraph_spacing_after': self.paragraph_spacing_after,
                'text_alignment': self.text_alignment,
                'text_direction': self.text_direction,
                'first_line_indent': self.first_line_indent,
                'hanging_indent': self.hanging_indent,
            },
            'layout': {
                'column_count': self.column_count,
                'column_spacing': self.column_spacing,
            },
            'headers_footers': {
                'include_header': self.include_header,
                'header_text': self.header_text,
                'include_footer': self.include_footer,
                'footer_text': self.footer_text,
                'include_page_numbers': self.include_page_numbers,
                'page_number_position': self.page_number_position,
            },
            'features': {
                'include_toc': self.include_toc,
                'toc_depth': self.toc_depth,
                'include_bibliography': self.include_bibliography,
                'bibliography_style': self.bibliography_style,
            }
        }


class UserFormattingPreset(models.Model):
    """User's saved formatting presets for reuse."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='formatting_presets'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    formatting_config = models.OneToOneField(
        FormattingConfiguration,
        on_delete=models.CASCADE,
        related_name='user_preset'
    )
    
    is_default = models.BooleanField(
        default=False,
        help_text=_('Whether this is the user\'s default formatting preset')
    )
    usage_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('User Formatting Preset')
        verbose_name_plural = _('User Formatting Presets')
        unique_together = ['user', 'name']
        ordering = ['-is_default', '-usage_count', 'name']
        
    def __str__(self):
        return f"{self.user.email} - {self.name}"
