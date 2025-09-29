// Types for our application state
export interface User {
  id: string;
  email: string;
  username: string;
  subscription_tier: 'free' | 'pro' | 'team' | 'enterprise';
  documents_processed_this_month: number;
  preferred_language: 'en' | 'ar';
  company?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  avatar?: string;
  bio?: string;
  timezone: string;
  notification_preferences: Record<string, boolean>;
}

export interface Document {
  id: string;
  original_filename: string;
  file_size: number;
  status: 'uploaded' | 'processing' | 'completed' | 'failed' | 'cancelled';
  title?: string;
  language: 'en' | 'ar' | 'mixed';
  page_count?: number;
  word_count?: number;
  character_count?: number;
  virus_scan_status: 'pending' | 'clean' | 'infected' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ProcessedDocument {
  pdf_file?: string;
  preview_image?: string;
  formatting_config: FormattingConfig;
  processing_time_seconds?: number;
  output_page_count?: number;
  output_file_size?: number;
}

export interface FontFamily {
  id: string;
  name: string;
  display_name: string;
  font_type: 'latin' | 'arabic' | 'mixed';
  supports_rtl: boolean;
  is_active: boolean;
}

export interface FormattingConfig {
  // Page setup
  page_size: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';
  page_orientation: 'portrait' | 'landscape';
  
  // Margins
  margin_top: number;
  margin_bottom: number;
  margin_left: number;
  margin_right: number;
  
  // Typography
  body_font: string;
  body_font_size: number;
  heading_font: string;
  heading_font_size: number;
  
  // Spacing
  line_spacing: number;
  paragraph_spacing_before: number;
  paragraph_spacing_after: number;
  
  // Alignment
  text_alignment: 'left' | 'right' | 'center' | 'justify';
  text_direction: 'ltr' | 'rtl' | 'auto';
  
  // Headers and footers
  include_header: boolean;
  header_text: string;
  include_footer: boolean;
  footer_text: string;
  include_page_numbers: boolean;
  page_number_position: 'top_left' | 'top_center' | 'top_right' | 'bottom_left' | 'bottom_center' | 'bottom_right';
  
  // Advanced
  first_line_indent: number;
  hanging_indent: number;
  column_count: number;
  column_spacing: number;
  
  // Features
  include_toc: boolean;
  toc_depth: number;
  include_bibliography: boolean;
  bibliography_style: 'apa' | 'mla' | 'chicago' | 'harvard';
}

export interface FormattingTemplate {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'business' | 'legal' | 'government' | 'personal';
  config: FormattingConfig;
  preview_image?: string;
  usage_count: number;
  is_premium: boolean;
  is_active: boolean;
}

export interface UploadProgress {
  documentId: string;
  progress: number;
  stage: 'uploading' | 'virus_scan' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}