'use client';

import { useState } from 'react';
import Link from 'next/link';

// Define the type for our form data
interface FormDataState {
  name: string;
  email: string;
  projectName: string;
  file3D: File | null;
  file2D: File | null;
  material: string;
  quantity: string;
  surfaceTreatment: string;
  tolerance: string;
  deliveryDate: string;
  destination: string;
  additionalNotes: string;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const initialFormData: FormDataState = {
  name: '',
  email: '',
  projectName: '',
  file3D: null,
  file2D: null,
  material: '',
  quantity: '',
  surfaceTreatment: '',
  tolerance: '',
  deliveryDate: '',
  destination: '',
  additionalNotes: '',
};

export default function SubmitProjectPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: null }));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate required fields for step 1
      if (!formData.name?.trim() || !formData.email?.trim() || !formData.projectName?.trim()) {
        alert('Please fill in all required fields (Name, Email, Project Name)');
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        alert('Please enter a valid email address');
        return;
      }
    }
    
    if (step === 2) {
      // Validate required fields for step 2
      if (!formData.material?.trim() || !formData.quantity?.trim()) {
        alert('Please select material and enter quantity');
        return;
      }
    }
    
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('submitting');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch('/api/submit-project', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      setSubmissionStatus('success');
      setStep(1);
      setFormData(initialFormData);

    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error');
    }
  };

  if (submissionStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-green-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl text-center border border-white/20">
          {/* Success Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-400/30 rounded-full animate-ping"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Submission Successful!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Thank you for submitting your project. Our global network coordinators will review your specifications through our vetted supply chain and respond within 24 hours.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                🔒 Your files and project details are secure and protected under our NDA.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => setSubmissionStatus('idle')}
              className="w-full inline-flex justify-center items-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Submit Another Project
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <Link 
              href="/"
              className="w-full inline-flex justify-center items-center gap-2 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div key="step1" className="space-y-6">
            <div className="text-center pb-4 sm:pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Project and Contact Information</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Let's start with the basics to get your project moving.</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name || ''} 
                  onChange={handleChange} 
                  required 
                  className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Work Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={formData.email || ''} 
                  onChange={handleChange} 
                  required 
                  className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project Name *</label>
                <input 
                  type="text" 
                  name="projectName" 
                  id="projectName" 
                  value={formData.projectName || ''} 
                  onChange={handleChange} 
                  required 
                  className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Give your project a descriptive name"
                />
              </div>
            </div>
            
            <div className="pt-6">
              <button 
                type="button"
                onClick={nextStep} 
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Specifications
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div key="step2" className="space-y-6">
            <div className="text-center pb-4 sm:pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Technical Specifications</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Upload your files and specify material requirements.</p>
            </div>
            
            <div className="space-y-6">
              {/* File Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <label htmlFor="file3D" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    3D File * <span className="text-red-500">Required</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="file3D" 
                      id="file3D" 
                      onChange={handleFileChange} 
                      required 
                      accept=".step,.stp,.igs,.iges,.dwg,.dxf,.stl,.obj,.3mf"
                      className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800 file:transition-colors file:cursor-pointer cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {!formData.file3D && (
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload 3D file</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      🔒 Your intellectual property is protected under our NDA.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="file2D" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    2D Drawing <span className="text-gray-500">(Recommended)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="file2D" 
                      id="file2D" 
                      onChange={handleFileChange} 
                      accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                      className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-100 dark:hover:file:bg-gray-700 file:transition-colors file:cursor-pointer cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {!formData.file2D && (
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm text-gray-500">Click to upload 2D drawing</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Technical Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="material" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Material *</label>
                  <select 
                    name="material" 
                    id="material" 
                    value={formData.material || ''} 
                    onChange={handleChange} 
                    required 
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    <option value="">Select Material</option>
                    <option value="aluminum">Aluminum (6061, 7075)</option>
                    <option value="steel">Steel (Stainless, Carbon)</option>
                    <option value="plastic">Plastic (ABS, PC, PEEK)</option>
                    <option value="titanium">Titanium</option>
                    <option value="copper">Copper/Brass</option>
                    <option value="other">Other (specify in notes)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity *</label>
                  <input 
                    type="number" 
                    name="quantity" 
                    id="quantity" 
                    value={formData.quantity || ''} 
                    onChange={handleChange} 
                    required 
                    min="1" 
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Enter quantity needed"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="surfaceTreatment" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Surface Treatment</label>
                  <select 
                    name="surfaceTreatment" 
                    id="surfaceTreatment" 
                    value={formData.surfaceTreatment || ''} 
                    onChange={handleChange} 
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    <option value="">Select Surface Treatment</option>
                    <option value="anodizing">Anodizing (Type II/III)</option>
                    <option value="powder_coating">Powder Coating</option>
                    <option value="painting">Painting</option>
                    <option value="passivation">Passivation</option>
                    <option value="plating">Plating (Chrome, Nickel)</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="tolerance" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Tolerances</label>
                  <input 
                    type="text" 
                    name="tolerance" 
                    id="tolerance" 
                    value={formData.tolerance || ''} 
                    onChange={handleChange} 
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                    placeholder="e.g. ±0.005mm on critical dimensions"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button 
                type="button"
                onClick={prevStep} 
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Previous
              </button>
              <button 
                type="button"
                onClick={nextStep} 
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                Continue to Requirements
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div key="step3" className="space-y-6">
            <div className="text-center pb-4 sm:pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Requirements & Terms</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Final details to complete your project submission.</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="deliveryDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Delivery Date</label>
                  <input 
                    type="date" 
                    name="deliveryDate" 
                    id="deliveryDate" 
                    value={formData.deliveryDate || ''} 
                    onChange={handleChange} 
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                  <input 
                    type="text" 
                    name="destination" 
                    id="destination" 
                    value={formData.destination || ''} 
                    onChange={handleChange} 
                    className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                    placeholder="City, State/Province, Country"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Additional Notes</label>
                <textarea 
                  name="additionalNotes" 
                  id="additionalNotes" 
                  rows={4} 
                  value={formData.additionalNotes || ''} 
                  onChange={handleChange} 
                  className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Special requirements, coating colors, packaging instructions, or any other details..."
                ></textarea>
              </div>
              
              {/* Terms Agreement */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Legal Agreements
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center h-6 mt-1">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2 transition-colors"
                      />
                    </div>
                    <div className="text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                        I have read, understood, and agree to be bound by the terms of the{' '}
                        <Link 
                          href="/legal/msa" 
                          target="_blank" 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all"
                        >
                          Master Service Agreement (MSA)
                        </Link>{' '}
                        and the{' '}
                        <Link 
                          href="/legal/nda" 
                          target="_blank" 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all"
                        >
                          Mutual Non-Disclosure Agreement (NDA)
                        </Link>
                        .
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium text-green-700 dark:text-green-400">Your IP is Protected</p>
                        <p>All project files and information are covered under our strict confidentiality agreements.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button 
                type="button"
                onClick={prevStep} 
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Previous
              </button>
              <button 
                type="submit" 
                disabled={submissionStatus === 'submitting' || !agreedToTerms} 
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {submissionStatus === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Project
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-slate-200/60 dark:bg-grid-slate-800/40 bg-[size:20px_20px] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
      
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full space-y-4 sm:space-y-8 p-4 sm:p-8 lg:p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2h6a1 1 0 110 2H7a1 1 0 110-2zM7 8a1 1 0 100 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h3a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Project Submission
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-gray-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Submit Your Project
            </h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Connect with our global manufacturing network for precision quotes. Your IP is protected through our vetted supply chain protocols.
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Step {step} of 3</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            {/* Step Labels */}
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className={`py-2 px-3 rounded-lg transition-colors ${step >= 1 ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-gray-600'}`}>
                Contact Info
              </div>
              <div className={`py-2 px-3 rounded-lg transition-colors ${step >= 2 ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-gray-600'}`}>
                Specifications
              </div>
              <div className={`py-2 px-3 rounded-lg transition-colors ${step >= 3 ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-400 dark:text-gray-600'}`}>
                Requirements
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-8">
            <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
              {renderStep()}
            </div>
            
            {submissionStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 000 2v4a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300 font-medium">
                    Submission failed. Please check your connection and try again.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}