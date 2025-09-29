import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, DocumentTextIcon, LanguageIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Coplit</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-500 hover:text-gray-900">Pricing</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">About</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Professional</span>{' '}
                    <span className="block text-primary-600 xl:inline">Document Formatting</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Transform your Word documents into publication-ready PDFs with perfect Arabic and English rendering. 
                    Our AI-powered formatting wizard ensures professional results every time.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                      >
                        Start Formatting
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#demo"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                      >
                        Watch Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full bg-gradient-to-r from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
              <div className="text-white text-center">
                <DocumentTextIcon className="h-24 w-24 mx-auto mb-4 opacity-80" />
                <p className="text-xl font-semibold">Upload → Format → Download</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for perfect formatting
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our platform combines advanced formatting capabilities with seamless Arabic/RTL support.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <LanguageIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Seamless RTL/LTR Support</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Perfect rendering for Arabic, English, and mixed-language documents with automatic text direction detection.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI-Powered Formatting</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Smart formatting suggestions based on document type, content analysis, and academic standards.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Preview</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    See your formatting changes instantly with our live preview system before final PDF generation.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <CheckIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Publication Ready</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Generate high-quality PDFs perfect for academic publications, legal documents, and business reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Choose the plan that's right for you
              </p>
            </div>
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
              {/* Free Plan */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Free</h3>
                  <p className="mt-4 text-sm text-gray-500">Perfect for getting started</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">$0</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <Link
                    to="/register"
                    className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                  >
                    Start free
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">5 documents per month</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">Basic formatting templates</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">PDF export</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="border border-primary-200 rounded-lg shadow-sm divide-y divide-gray-200 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary-600 text-white">
                    Most Popular
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Pro</h3>
                  <p className="mt-4 text-sm text-gray-500">For professionals and researchers</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">$29</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <Link
                    to="/register"
                    className="mt-8 block w-full bg-primary-600 border border-primary-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
                  >
                    Start Pro trial
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">Unlimited documents</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">All formatting templates</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">Real-time preview</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">Priority support</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Enterprise</h3>
                  <p className="mt-4 text-sm text-gray-500">For teams and organizations</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                  </p>
                  <a
                    href="mailto:sales@coplit.com"
                    className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                  >
                    Contact sales
                  </a>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">Everything in Pro</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">Team collaboration</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">API access</span>
                    </li>
                    <li className="flex space-x-3">
                      <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">On-premise deployment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Transform your documents today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-200">
              Join thousands of professionals who trust Coplit for their document formatting needs.
            </p>
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
            >
              Start your free trial
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://twitter.com/coplit" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 Coplit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;