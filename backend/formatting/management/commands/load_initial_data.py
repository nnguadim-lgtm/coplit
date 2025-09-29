from django.core.management.base import BaseCommand
from formatting.models import FontFamily, FormattingTemplate


class Command(BaseCommand):
    help = 'Load initial data for fonts and templates'

    def handle(self, *args, **options):
        self.stdout.write('Loading initial data...')
        
        # Create font families
        fonts = [
            {
                'name': 'Inter',
                'display_name': 'Inter',
                'font_type': 'latin',
                'supports_rtl': False,
                'is_system_font': True,
            },
            {
                'name': 'Amiri',
                'display_name': 'Amiri',
                'font_type': 'arabic',
                'supports_rtl': True,
                'is_system_font': True,
            },
            {
                'name': 'Noto Naskh Arabic',
                'display_name': 'Noto Naskh Arabic',
                'font_type': 'arabic',
                'supports_rtl': True,
                'is_system_font': True,
            },
            {
                'name': 'Times New Roman',
                'display_name': 'Times New Roman',
                'font_type': 'latin',
                'supports_rtl': False,
                'is_system_font': True,
            },
            {
                'name': 'Arial',
                'display_name': 'Arial',
                'font_type': 'latin',
                'supports_rtl': False,
                'is_system_font': True,
            },
        ]
        
        for font_data in fonts:
            font, created = FontFamily.objects.get_or_create(
                name=font_data['name'],
                defaults=font_data
            )
            if created:
                self.stdout.write(f'Created font: {font.display_name}')
        
        # Create formatting templates
        templates = [
            {
                'name': 'Academic Paper',
                'description': 'Standard academic paper formatting with proper margins and spacing',
                'category': 'academic',
                'config': {
                    'page_size': 'A4',
                    'page_orientation': 'portrait',
                    'margin_top': 72,
                    'margin_bottom': 72,
                    'margin_left': 72,
                    'margin_right': 72,
                    'body_font_size': 12,
                    'heading_font_size': 14,
                    'line_spacing': 2.0,
                    'text_alignment': 'justify',
                    'text_direction': 'auto',
                    'include_page_numbers': True,
                    'page_number_position': 'bottom_center',
                },
                'is_premium': False,
            },
            {
                'name': 'Business Report',
                'description': 'Professional business report format with clean layout',
                'category': 'business',
                'config': {
                    'page_size': 'A4',
                    'page_orientation': 'portrait',
                    'margin_top': 72,
                    'margin_bottom': 72,
                    'margin_left': 54,
                    'margin_right': 54,
                    'body_font_size': 11,
                    'heading_font_size': 16,
                    'line_spacing': 1.5,
                    'text_alignment': 'left',
                    'text_direction': 'auto',
                    'include_header': True,
                    'include_page_numbers': True,
                    'page_number_position': 'top_right',
                },
                'is_premium': False,
            },
            {
                'name': 'Arabic Document',
                'description': 'Optimized for Arabic text with RTL support',
                'category': 'academic',
                'config': {
                    'page_size': 'A4',
                    'page_orientation': 'portrait',
                    'margin_top': 72,
                    'margin_bottom': 72,
                    'margin_left': 72,
                    'margin_right': 72,
                    'body_font_size': 14,
                    'heading_font_size': 18,
                    'line_spacing': 1.8,
                    'text_alignment': 'right',
                    'text_direction': 'rtl',
                    'include_page_numbers': True,
                    'page_number_position': 'bottom_center',
                },
                'is_premium': False,
            },
        ]
        
        for template_data in templates:
            template, created = FormattingTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            if created:
                self.stdout.write(f'Created template: {template.name}')
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded initial data!'))