import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ExpenseForm from './components/ExpenseForm';
import ReceiptUpload from './components/ReceiptUpload';
import SubmissionSummary from './components/SubmissionSummary';
import ProgressIndicator from './components/ProgressIndicator';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const ExpenseSubmission = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrProgress, setOCRProgress] = useState(0);
  const [ocrData, setOcrData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Mock exchange rates - in real app, this would come from API
  const [exchangeRates, setExchangeRates] = useState({
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'JPY': 110.12,
    'CAD': 1.25,
    'AUD': 1.35,
    'CHF': 0.92,
    'CNY': 6.45
  });

  // Form data state
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    date: new Date()?.toISOString()?.split('T')?.[0],
    category: '',
    vendor: '',
    description: '',
    businessPurpose: ''
  });

  // Mock draft count
  const [draftCount] = useState(2);

  useEffect(() => {
    // Mock API call to fetch exchange rates
    const fetchExchangeRates = async () => {
      try {
        // Simulate API call
        console.log('Fetching exchange rates...');
        // In real app: const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // setExchangeRates(data.rates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
    setIsOCRProcessing(true);
    setOCRProgress(0);

    // Simulate OCR progress
    const progressInterval = setInterval(() => {
      setOCRProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsOCRProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleOCRComplete = (data) => {
    setOcrData(data);
    // Auto-advance to next step after OCR completion
    setTimeout(() => {
      if (currentStep === 2) {
        setCurrentStep(3);
      }
    }, 1000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Mock API call for submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      console.log('Expense submitted successfully:', {
        ...formData,
        files: uploadedFiles,
        submittedAt: new Date()?.toISOString(),
        status: 'pending_approval',
        submittedBy: 'john.smith@company.com'
      });

      // Show success message and redirect
      alert('Expense submitted successfully! You will be redirected to your dashboard.');
      navigate('/employee-dashboard');
      
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    
    try {
      // Mock API call for saving draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Draft saved successfully:', {
        ...formData,
        files: uploadedFiles,
        savedAt: new Date()?.toISOString(),
        status: 'draft'
      });

      alert('Draft saved successfully!');
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/employee-dashboard');
    }
  };

  const handleLoadDraft = () => {
    // Mock loading draft data
    const mockDraft = {
      amount: '125.50',
      currency: 'USD',
      date: '2025-10-02',
      category: 'meals',
      vendor: 'Restaurant ABC',
      description: 'Client dinner meeting to discuss project requirements and timeline.',
      businessPurpose: 'Building client relationship and project planning'
    };

    setFormData(mockDraft);
    setCurrentStep(1);
    alert('Draft loaded successfully!');
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditFromSummary = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="employee"
      />
      <main className={`expense-transition-layout ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      }`}>
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center">
                  <Icon name="Plus" size={32} className="mr-3 text-primary" />
                  Submit New Expense
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create a new expense report with receipt upload and automatic data extraction.
                </p>
              </div>
              <QuickActionButton userRole="employee" />
            </div>
            
            <ProgressIndicator currentStep={currentStep} totalSteps={3} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {currentStep === 1 && (
                <ExpenseForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  onSubmit={handleNextStep}
                  onSaveDraft={handleSaveDraft}
                  onCancel={handleCancel}
                  isSubmitting={false}
                  isDraftSaving={isDraftSaving}
                  ocrData={ocrData}
                  exchangeRates={exchangeRates}
                />
              )}

              {currentStep === 2 && (
                <ReceiptUpload
                  onFileUpload={handleFileUpload}
                  onOCRComplete={handleOCRComplete}
                  isProcessing={isOCRProcessing}
                  ocrProgress={ocrProgress}
                  uploadedFiles={uploadedFiles}
                />
              )}

              {currentStep === 3 && (
                <SubmissionSummary
                  formData={formData}
                  uploadedFiles={uploadedFiles}
                  onEdit={handleEditFromSummary}
                  onConfirm={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Step Navigation */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-4 py-2 rounded-md expense-transition ${
                    currentStep === 1
                      ? 'text-muted-foreground cursor-not-allowed'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  <Icon name="ChevronLeft" size={20} className="mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {[1, 2, 3]?.map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full expense-transition ${
                        step <= currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < 3 && (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center px-4 py-2 rounded-md text-primary hover:bg-primary/10 expense-transition"
                  >
                    Next
                    <Icon name="ChevronRight" size={20} className="ml-1" />
                  </button>
                )}

                {currentStep === 3 && (
                  <div className="w-20" /> // Spacer for alignment
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <QuickActions 
                onLoadDraft={handleLoadDraft}
                draftCount={draftCount}
              />

              {/* Tips Card */}
              <div className="bg-card border border-border rounded-lg expense-shadow-sm">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Icon name="HelpCircle" size={20} className="mr-2 text-accent" />
                    Submission Tips
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Upload clear receipt images for faster processing
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Provide detailed business purpose for quicker approval
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Submit expenses within 30 days of occurrence
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Save drafts to continue later if needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpenseSubmission;