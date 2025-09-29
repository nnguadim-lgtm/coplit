export interface User {
  id: string;
  email: string;
  name: string;
  subscription_tier: 'free' | 'pro' | 'team' | 'enterprise';
  documents_used: number;
  documents_limit: number;
  created_at: string;
}

export interface Document {
  id: string;
  name: string;
  original_filename: string;
  file_size: number;
  file_url: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  format_config?: FormatConfig;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FormatConfig {
  // Page settings
  page_size: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  
  // Typography
  font_family: string;
  font_size: number;
  line_height: number;
  text_align: 'left' | 'right' | 'center' | 'justify';
  
  // Arabic-specific settings
  arabic_font: 'amiri' | 'noto-naskh' | 'scheherazade' | 'traditional';
  rtl_support: boolean;
  kashida_justification: boolean;
  
  // Headings
  heading_styles: {
    h1: HeadingStyle;
    h2: HeadingStyle;
    h3: HeadingStyle;
    h4: HeadingStyle;
  };
  
  // Layout
  columns: number;
  column_gap: number;
  
  // Headers and footers
  header: {
    enabled: boolean;
    content: string;
    font_size: number;
  };
  footer: {
    enabled: boolean;
    content: string;
    font_size: number;
    page_numbers: boolean;
  };
  
  // Advanced
  hyphenation: boolean;
  widow_orphan_control: boolean;
}

export interface HeadingStyle {
  font_size: number;
  font_weight: 'normal' | 'bold';
  color: string;
  spacing_before: number;
  spacing_after: number;
  text_transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  details?: Record<string, any>;
  status_code: number;
}

// Wizard step types
export type WizardStep = 
  | 'upload'
  | 'page-settings'
  | 'typography'
  | 'layout'
  | 'headers-footers'
  | 'preview'
  | 'download';

export interface WizardStepInfo {
  id: WizardStep;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  active: boolean;
}