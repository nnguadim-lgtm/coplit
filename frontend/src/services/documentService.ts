import { api, handleApiResponse } from './api';
import { Document, ProcessedDocument, UploadProgress } from '../types';

export interface DocumentUpload {
  file: File;
  document_type?: string;
}

export interface DocumentFilters {
  status?: string;
  language?: string;
  document_type?: string;
  page?: number;
  page_size?: number;
}

export const documentService = {
  // Upload a document
  uploadDocument: async (
    upload: DocumentUpload,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', upload.file);
    if (upload.document_type) {
      formData.append('document_type', upload.document_type);
    }

    const response = await api.post('documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress({
            documentId: 'uploading',
            progress,
            stage: 'uploading',
          });
        }
      },
    });

    return handleApiResponse(response);
  },

  // Get all user documents
  getDocuments: async (filters?: DocumentFilters): Promise<{
    results: Document[];
    count: number;
    next: string | null;
    previous: string | null;
  }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`documents/?${params.toString()}`);
    return handleApiResponse(response);
  },

  // Get a specific document
  getDocument: async (id: string): Promise<Document> => {
    const response = await api.get(`documents/${id}/`);
    return handleApiResponse(response);
  },

  // Update document metadata
  updateDocument: async (id: string, updates: Partial<Document>): Promise<Document> => {
    const response = await api.patch(`documents/${id}/`, updates);
    return handleApiResponse(response);
  },

  // Delete a document
  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`documents/${id}/`);
  },

  // Get processed document
  getProcessedDocument: async (documentId: string): Promise<ProcessedDocument> => {
    const response = await api.get(`documents/${documentId}/processed/`);
    return handleApiResponse(response);
  },

  // Download original document
  downloadOriginal: async (id: string): Promise<Blob> => {
    const response = await api.get(`documents/${id}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download processed PDF
  downloadPDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`documents/${id}/download-pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get document processing status
  getProcessingStatus: async (id: string): Promise<{
    status: string;
    progress: number;
    stage: string;
    estimated_completion?: string;
    error?: string;
  }> => {
    const response = await api.get(`documents/${id}/status/`);
    return handleApiResponse(response);
  },

  // Cancel document processing
  cancelProcessing: async (id: string): Promise<void> => {
    await api.post(`documents/${id}/cancel/`);
  },

  // Share document
  shareDocument: async (
    id: string,
    shareData: {
      shared_with_email: string;
      can_view: boolean;
      can_download: boolean;
      expires_at?: string;
    }
  ): Promise<{
    share_token: string;
    share_url: string;
  }> => {
    const response = await api.post(`documents/${id}/share/`, shareData);
    return handleApiResponse(response);
  },

  // Get document shares
  getDocumentShares: async (id: string): Promise<Array<{
    id: string;
    shared_with_email: string;
    share_token: string;
    can_view: boolean;
    can_download: boolean;
    expires_at?: string;
    is_active: boolean;
    created_at: string;
    accessed_at?: string;
    access_count: number;
  }>> => {
    const response = await api.get(`documents/${id}/shares/`);
    return handleApiResponse(response);
  },

  // Revoke document share
  revokeShare: async (documentId: string, shareId: string): Promise<void> => {
    await api.delete(`documents/${documentId}/shares/${shareId}/`);
  },

  // Get document analytics
  getDocumentAnalytics: async (id: string): Promise<{
    views: number;
    downloads: number;
    shares: number;
    processing_time: number;
    file_size_mb: number;
    page_count: number;
  }> => {
    const response = await api.get(`documents/${id}/analytics/`);
    return handleApiResponse(response);
  },
};