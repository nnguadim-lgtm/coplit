import React from 'react';
import { useParams } from 'react-router-dom';

const FormattingWizardPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Formatting Wizard</h1>
          <p className="mt-2 text-gray-600">
            Formatting document: {documentId}
          </p>
          <p className="text-gray-600">Formatting wizard coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default FormattingWizardPage;