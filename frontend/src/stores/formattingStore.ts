import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FormattingConfig, FormattingTemplate, FontFamily } from '../types';

interface FormattingState {
  config: FormattingConfig;
  templates: FormattingTemplate[];
  fonts: FontFamily[];
  currentStep: number;
  isPreviewMode: boolean;
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setConfig: (config: FormattingConfig) => void;
  updateConfig: (updates: Partial<FormattingConfig>) => void;
  setTemplates: (templates: FormattingTemplate[]) => void;
  setFonts: (fonts: FontFamily[]) => void;
  applyTemplate: (template: FormattingTemplate) => void;
  setCurrentStep: (step: number) => void;
  setPreviewMode: (enabled: boolean) => void;
  setPreviewUrl: (url: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetConfig: () => void;
}

// Default formatting configuration
const defaultConfig: FormattingConfig = {
  page_size: 'A4',
  page_orientation: 'portrait',
  margin_top: 72,
  margin_bottom: 72,
  margin_left: 72,
  margin_right: 72,
  body_font: 'Inter',
  body_font_size: 12,
  heading_font: 'Inter',
  heading_font_size: 16,
  line_spacing: 1.5,
  paragraph_spacing_before: 0,
  paragraph_spacing_after: 6,
  text_alignment: 'justify',
  text_direction: 'auto',
  include_header: false,
  header_text: '',
  include_footer: true,
  footer_text: '',
  include_page_numbers: true,
  page_number_position: 'bottom_center',
  first_line_indent: 0,
  hanging_indent: 0,
  column_count: 1,
  column_spacing: 12,
  include_toc: false,
  toc_depth: 3,
  include_bibliography: false,
  bibliography_style: 'apa',
};

export const useFormattingStore = create<FormattingState>()(
  devtools(
    (set) => ({
      config: defaultConfig,
      templates: [],
      fonts: [],
      currentStep: 0,
      isPreviewMode: false,
      previewUrl: null,
      isLoading: false,
      error: null,
      
      setConfig: (config) => 
        set((state) => ({
          ...state,
          config,
        }), false, 'setConfig'),
        
      updateConfig: (updates) => 
        set((state) => ({
          ...state,
          config: { ...state.config, ...updates },
        }), false, 'updateConfig'),
        
      setTemplates: (templates) => 
        set((state) => ({
          ...state,
          templates,
        }), false, 'setTemplates'),
        
      setFonts: (fonts) => 
        set((state) => ({
          ...state,
          fonts,
        }), false, 'setFonts'),
        
      applyTemplate: (template) => 
        set((state) => ({
          ...state,
          config: { ...template.config },
        }), false, 'applyTemplate'),
        
      setCurrentStep: (currentStep) => 
        set((state) => ({
          ...state,
          currentStep,
        }), false, 'setCurrentStep'),
        
      setPreviewMode: (isPreviewMode) => 
        set((state) => ({
          ...state,
          isPreviewMode,
        }), false, 'setPreviewMode'),
        
      setPreviewUrl: (previewUrl) => 
        set((state) => ({
          ...state,
          previewUrl,
        }), false, 'setPreviewUrl'),
        
      setLoading: (isLoading) => 
        set((state) => ({
          ...state,
          isLoading,
        }), false, 'setLoading'),
        
      setError: (error) => 
        set((state) => ({
          ...state,
          error,
        }), false, 'setError'),
        
      resetConfig: () => 
        set((state) => ({
          ...state,
          config: defaultConfig,
          currentStep: 0,
          isPreviewMode: false,
          previewUrl: null,
        }), false, 'resetConfig'),
    }),
    { name: 'formatting-store' }
  )
);