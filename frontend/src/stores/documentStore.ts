import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Document, ProcessedDocument, UploadProgress } from '../types';

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  processedDocument: ProcessedDocument | null;
  uploadProgress: UploadProgress | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  setCurrentDocument: (document: Document | null) => void;
  setProcessedDocument: (processed: ProcessedDocument | null) => void;
  setUploadProgress: (progress: UploadProgress | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentDocument: () => void;
}

export const useDocumentStore = create<DocumentState>()(
  devtools(
    (set) => ({
      documents: [],
      currentDocument: null,
      processedDocument: null,
      uploadProgress: null,
      isLoading: false,
      error: null,
      
      setDocuments: (documents) => 
        set((state) => ({
          ...state,
          documents,
        }), false, 'setDocuments'),
        
      addDocument: (document) => 
        set((state) => ({
          ...state,
          documents: [document, ...state.documents],
        }), false, 'addDocument'),
        
      updateDocument: (id, updates) => 
        set((state) => ({
          ...state,
          documents: state.documents.map(doc =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
          currentDocument: state.currentDocument?.id === id 
            ? { ...state.currentDocument, ...updates }
            : state.currentDocument,
        }), false, 'updateDocument'),
        
      setCurrentDocument: (currentDocument) => 
        set((state) => ({
          ...state,
          currentDocument,
        }), false, 'setCurrentDocument'),
        
      setProcessedDocument: (processedDocument) => 
        set((state) => ({
          ...state,
          processedDocument,
        }), false, 'setProcessedDocument'),
        
      setUploadProgress: (uploadProgress) => 
        set((state) => ({
          ...state,
          uploadProgress,
        }), false, 'setUploadProgress'),
        
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
        
      clearCurrentDocument: () => 
        set((state) => ({
          ...state,
          currentDocument: null,
          processedDocument: null,
          uploadProgress: null,
        }), false, 'clearCurrentDocument'),
    }),
    { name: 'document-store' }
  )
);