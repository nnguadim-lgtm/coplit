import { api, handleApiResponse } from './api';
import { FormattingConfig, FormattingTemplate, FontFamily } from '../types';

export interface ProcessDocumentRequest {
  document_id: string;
  formatting_config: FormattingConfig;
}

export const formattingService = {
  // Get available font families
  getFonts: async (): Promise<FontFamily[]> => {
    const response = await api.get('formatting/fonts/');
    return handleApiResponse(response);
  },

  // Get formatting templates
  getTemplates: async (category?: string): Promise<FormattingTemplate[]> => {
    const params = category ? `?category=${category}` : '';
    const response = await api.get(`formatting/templates/${params}`);
    return handleApiResponse(response);
  },

  // Get specific template
  getTemplate: async (id: string): Promise<FormattingTemplate> => {
    const response = await api.get(`formatting/templates/${id}/`);
    return handleApiResponse(response);
  },

  // Create custom formatting configuration
  createFormattingConfig: async (config: FormattingConfig): Promise<{
    id: string;
    config: FormattingConfig;
  }> => {
    const response = await api.post('formatting/configurations/', { config });
    return handleApiResponse(response);
  },

  // Update formatting configuration
  updateFormattingConfig: async (
    id: string,
    config: FormattingConfig
  ): Promise<{
    id: string;
    config: FormattingConfig;
  }> => {
    const response = await api.patch(`formatting/configurations/${id}/`, { config });
    return handleApiResponse(response);
  },

  // Process document with formatting
  processDocument: async (request: ProcessDocumentRequest): Promise<{
    task_id: string;
    status: string;
    estimated_completion: string;
  }> => {
    const response = await api.post('formatting/process/', request);
    return handleApiResponse(response);
  },

  // Generate preview
  generatePreview: async (request: ProcessDocumentRequest): Promise<{
    preview_url: string;
    preview_image: string;
  }> => {
    const response = await api.post('formatting/preview/', request);
    return handleApiResponse(response);
  },

  // Get processing task status
  getTaskStatus: async (taskId: string): Promise<{
    task_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    result?: any;
    error?: string;
    estimated_completion?: string;
  }> => {
    const response = await api.get(`formatting/tasks/${taskId}/`);
    return handleApiResponse(response);
  },

  // Save user formatting preset
  savePreset: async (preset: {
    name: string;
    description?: string;
    formatting_config: FormattingConfig;
    is_default?: boolean;
  }): Promise<{
    id: string;
    name: string;
    description: string;
    formatting_config: FormattingConfig;
    is_default: boolean;
    usage_count: number;
    created_at: string;
  }> => {
    const response = await api.post('formatting/presets/', preset);
    return handleApiResponse(response);
  },

  // Get user presets
  getUserPresets: async (): Promise<Array<{
    id: string;
    name: string;
    description: string;
    formatting_config: FormattingConfig;
    is_default: boolean;
    usage_count: number;
    created_at: string;
    updated_at: string;
  }>> => {
    const response = await api.get('formatting/presets/');
    return handleApiResponse(response);
  },

  // Update user preset
  updatePreset: async (
    id: string,
    updates: {
      name?: string;
      description?: string;
      formatting_config?: FormattingConfig;
      is_default?: boolean;
    }
  ): Promise<{
    id: string;
    name: string;
    description: string;
    formatting_config: FormattingConfig;
    is_default: boolean;
    usage_count: number;
    updated_at: string;
  }> => {
    const response = await api.patch(`formatting/presets/${id}/`, updates);
    return handleApiResponse(response);
  },

  // Delete user preset
  deletePreset: async (id: string): Promise<void> => {
    await api.delete(`formatting/presets/${id}/`);
  },

  // Validate formatting configuration
  validateConfig: async (config: FormattingConfig): Promise<{
    is_valid: boolean;
    errors?: Record<string, string[]>;
    warnings?: Record<string, string[]>;
  }> => {
    const response = await api.post('formatting/validate/', { config });
    return handleApiResponse(response);
  },

  // Get formatting suggestions based on document content
  getFormattingSuggestions: async (documentId: string): Promise<{
    suggested_templates: FormattingTemplate[];
    detected_language: 'en' | 'ar' | 'mixed';
    document_type: string;
    confidence_score: number;
    recommendations: Array<{
      field: string;
      current_value: any;
      suggested_value: any;
      reason: string;
    }>;
  }> => {
    const response = await api.get(`formatting/suggestions/${documentId}/`);
    return handleApiResponse(response);
  },
};