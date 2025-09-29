import { create } from 'zustand';
import { Document, FormatConfig, WizardStep } from '@/types';

interface DocumentStore {
  // Current document being processed
  currentDocument: Document | null;
  setCurrentDocument: (document: Document | null) => void;

  // Format configuration
  formatConfig: FormatConfig;
  updateFormatConfig: (config: Partial<FormatConfig>) => void;

  // Wizard state
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  completedSteps: WizardStep[];
  markStepCompleted: (step: WizardStep) => void;

  // UI state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  // Language and direction
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: 'en' | 'ar') => void;

  // Reset functions
  resetWizard: () => void;
  resetFormatConfig: () => void;
}

const defaultFormatConfig: FormatConfig = {
  page_size: 'A4',
  orientation: 'portrait',
  margins: {
    top: 25.4,
    bottom: 25.4,
    left: 25.4,
    right: 25.4,
  },
  font_family: 'Times New Roman',
  font_size: 12,
  line_height: 1.5,
  text_align: 'left',
  arabic_font: 'amiri',
  rtl_support: true,
  kashida_justification: false,
  heading_styles: {
    h1: {
      font_size: 24,
      font_weight: 'bold',
      color: '#000000',
      spacing_before: 12,
      spacing_after: 6,
      text_transform: 'none',
    },
    h2: {
      font_size: 20,
      font_weight: 'bold',
      color: '#000000',
      spacing_before: 10,
      spacing_after: 5,
      text_transform: 'none',
    },
    h3: {
      font_size: 16,
      font_weight: 'bold',
      color: '#000000',
      spacing_before: 8,
      spacing_after: 4,
      text_transform: 'none',
    },
    h4: {
      font_size: 14,
      font_weight: 'bold',
      color: '#000000',
      spacing_before: 6,
      spacing_after: 3,
      text_transform: 'none',
    },
  },
  columns: 1,
  column_gap: 12.7,
  header: {
    enabled: false,
    content: '',
    font_size: 10,
  },
  footer: {
    enabled: true,
    content: '',
    font_size: 10,
    page_numbers: true,
  },
  hyphenation: true,
  widow_orphan_control: true,
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  // Document state
  currentDocument: null,
  setCurrentDocument: (document) => set({ currentDocument: document }),

  // Format configuration
  formatConfig: defaultFormatConfig,
  updateFormatConfig: (config) =>
    set((state) => ({
      formatConfig: { ...state.formatConfig, ...config },
    })),

  // Wizard state
  currentStep: 'upload',
  setCurrentStep: (step) => set({ currentStep: step }),
  completedSteps: [],
  markStepCompleted: (step) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
    })),

  // UI state
  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),

  // Language state
  language: 'en',
  direction: 'ltr',
  setLanguage: (lang) =>
    set({
      language: lang,
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    }),

  // Reset functions
  resetWizard: () =>
    set({
      currentStep: 'upload',
      completedSteps: [],
      currentDocument: null,
    }),

  resetFormatConfig: () =>
    set({
      formatConfig: defaultFormatConfig,
    }),
}));