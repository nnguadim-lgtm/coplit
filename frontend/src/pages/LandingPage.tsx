import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Zap, 
  Globe, 
  Shield, 
  Star, 
  ArrowRight,
  Upload,
  Settings,
  Download
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Seamless RTL/LTR Support',
      description: 'Perfect Arabic and English rendering with intelligent text direction handling.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time preview and instant PDF generation for immediate feedback.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with encrypted file storage and processing.',
    },
    {
      icon: FileText,
      title: 'Professional Quality',
      description: 'Publication-ready PDFs for academic, legal, and business documents.',
    },
  ];

  const steps = [
    {
      icon: Upload,
      title: 'Upload Document',
      description: 'Drop your Word document or browse to upload (.docx, up to 50MB)',
    },
    {
      icon: Settings,
      title: 'Configure Format',
      description: 'Use our intuitive wizard to set typography, layout, and Arabic options',
    },
    {
      icon: Download,
      title: 'Download PDF',
      description: 'Get your professionally formatted PDF with perfect text rendering',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Ahmed',
      role: 'Research Professor',
      content: 'Finally, a tool that handles Arabic academic papers perfectly. The formatting quality is exceptional.',
    },
    {
      name: 'Mohammad Ali',
      role: 'Legal Consultant',
      content: 'Coplit transformed our document workflow. Professional PDFs in minutes, not hours.',
    },
    {
      name: 'Fatima Hassan',
      role: 'Publishing Editor',
      content: 'The RTL support is flawless. Our bilingual publications have never looked better.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container-responsive max-w-7xl py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Document
              <span className="text-primary-600 block">Formatting Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your Word documents into publication-ready PDFs with seamless 
              Arabic/RTL support and professional formatting options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/format"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Start Formatting
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-responsive max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Coplit?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for Arabic and English documents with professional-grade formatting capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-responsive max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to professionally formatted documents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container-responsive max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users say about their experience with Coplit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container-responsive max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Coplit for their document formatting needs.
          </p>
          <Link
            to="/format"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Start Formatting Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};