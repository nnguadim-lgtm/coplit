import React from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { WizardStep } from '@/types';
import { 
  Upload, 
  Settings, 
  Type, 
  Layout, 
  BookOpen, 
  Eye, 
  Download,
  Check,
  ChevronRight
} from 'lucide-react';

export const FormattingWizard: React.FC = () => {
  const { currentStep, setCurrentStep, completedSteps } = useDocumentStore();

  const steps: Array<{
    id: WizardStep;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }> = [
    {
      id: 'upload',
      title: 'Upload Document',
      description: 'Upload your Word document',
      icon: Upload,
    },
    {
      id: 'page-settings',
      title: 'Page Settings',
      description: 'Configure page size and margins',
      icon: Settings,
    },
    {
      id: 'typography',
      title: 'Typography',
      description: 'Set fonts and text options',
      icon: Type,
    },
    {
      id: 'layout',
      title: 'Layout',
      description: 'Configure columns and spacing',
      icon: Layout,
    },
    {
      id: 'headers-footers',
      title: 'Headers & Footers',
      description: 'Add headers, footers, and page numbers',
      icon: BookOpen,
    },
    {
      id: 'preview',
      title: 'Preview',
      description: 'Review your formatted document',
      icon: Eye,
    },
    {
      id: 'download',
      title: 'Download',
      description: 'Get your formatted PDF',
      icon: Download,
    },
  ];

  const getStepStatus = (stepId: WizardStep) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'inactive';
  };

  const getStepClasses = (status: string) => {
    const baseClasses = 'wizard-step cursor-pointer';
    switch (status) {
      case 'completed':
        return `${baseClasses} completed`;
      case 'active':
        return `${baseClasses} active`;
      default:
        return `${baseClasses} inactive`;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return <UploadStep />;
      case 'page-settings':
        return <PageSettingsStep />;
      case 'typography':
        return <TypographyStep />;
      case 'layout':
        return <LayoutStep />;
      case 'headers-footers':
        return <HeaderFooterStep />;
      case 'preview':
        return <PreviewStep />;
      case 'download':
        return <DownloadStep />;
      default:
        return <UploadStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-responsive max-w-7xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Formatting Wizard</h1>
          <p className="text-gray-600">Follow the steps to format your document professionally</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Steps</h2>
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                const IconComponent = step.icon;
                
                return (
                  <div
                    key={step.id}
                    className={getStepClasses(status)}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'active' ? 'bg-primary-500' : 'bg-gray-300'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <IconComponent className={`w-4 h-4 ${
                            status === 'active' ? 'text-white' : 'text-gray-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          status === 'active' ? 'text-primary-700' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                      {status !== 'inactive' && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder step components
const UploadStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Document</h2>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center upload-area">
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Drag and drop your document</h3>
      <p className="text-gray-600 mb-4">or click to browse files</p>
      <p className="text-sm text-gray-500">Supports .docx files up to 50MB</p>
    </div>
  </div>
);

const PageSettingsStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Settings</h2>
    <p className="text-gray-600">Configure page size, orientation, and margins for your document.</p>
  </div>
);

const TypographyStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Typography</h2>
    <p className="text-gray-600">Set fonts, sizes, and text formatting options including Arabic support.</p>
  </div>
);

const LayoutStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Layout</h2>
    <p className="text-gray-600">Configure columns, spacing, and overall document layout.</p>
  </div>
);

const HeaderFooterStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Headers & Footers</h2>
    <p className="text-gray-600">Add headers, footers, and page numbers to your document.</p>
  </div>
);

const PreviewStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
    <p className="text-gray-600">Review your formatted document before generating the final PDF.</p>
  </div>
);

const DownloadStep: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Download</h2>
    <p className="text-gray-600">Your document is ready! Download your professionally formatted PDF.</p>
  </div>
);