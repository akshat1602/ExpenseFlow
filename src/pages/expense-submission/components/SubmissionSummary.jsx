import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SubmissionSummary = ({ 
  formData, 
  uploadedFiles = [], 
  onEdit, 
  onConfirm, 
  isSubmitting = false 
}) => {
  const getCategoryLabel = (value) => {
    const categories = {
      'travel': 'Travel & Transportation',
      'meals': 'Meals & Entertainment',
      'accommodation': 'Accommodation',
      'office_supplies': 'Office Supplies',
      'software': 'Software & Subscriptions',
      'training': 'Training & Education',
      'marketing': 'Marketing & Advertising',
      'communication': 'Communication',
      'utilities': 'Utilities',
      'other': 'Other'
    };
    return categories?.[value] || value;
  };

  const formatCurrency = (amount, currency) => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥'
    };
    
    const symbol = symbols?.[currency] || currency;
    return `${symbol}${parseFloat(amount || 0)?.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="FileCheck" size={24} className="mr-2 text-primary" />
          Submission Summary
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your expense details before submitting for approval.
        </p>
      </div>
      <div className="p-6 space-y-6">
        {/* Expense Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Amount</label>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(formData?.amount, formData?.currency)}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <p className="text-foreground">{formatDate(formData?.date)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <p className="text-foreground">{getCategoryLabel(formData?.category)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Currency</label>
              <p className="text-foreground">{formData?.currency}</p>
            </div>
            
            {formData?.vendor && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                <p className="text-foreground">{formData?.vendor}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
                <span className="text-sm text-foreground">Ready for Submission</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <p className="text-foreground mt-1 p-3 bg-muted rounded-md">
            {formData?.description || 'No description provided'}
          </p>
        </div>

        {/* Business Purpose */}
        {formData?.businessPurpose && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Business Purpose</label>
            <p className="text-foreground mt-1 p-3 bg-muted rounded-md">
              {formData?.businessPurpose}
            </p>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles?.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Attached Receipts ({uploadedFiles?.length})
            </label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {uploadedFiles?.map((file, index) => (
                <div key={index} className="bg-muted rounded-lg p-3 text-center">
                  <Icon name="FileImage" size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-foreground truncate">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file?.size / 1024)?.toFixed(1)} KB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approval Workflow Info */}
        <div className="bg-accent/10 border border-accent/20 rounded-md p-4">
          <div className="flex items-start">
            <Icon name="Info" size={20} className="text-accent mr-3 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Approval Process</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  <span>Step 1: Manager Review (Sarah Johnson)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
                  <span>Step 2: Finance Approval (if &gt; $500)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
                  <span>Step 3: Final Processing</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated processing time: 2-3 business days
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={onConfirm}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            className="sm:order-2"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
            className="sm:order-1"
          >
            Edit Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;