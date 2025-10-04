import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExpenseForm = ({ 
  formData, 
  onFormChange, 
  onSubmit, 
  onSaveDraft, 
  onCancel, 
  isSubmitting = false,
  isDraftSaving = false,
  ocrData = null,
  exchangeRates = {}
}) => {
  const [convertedAmount, setConvertedAmount] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Mock categories for expense types
  const expenseCategories = [
    { value: 'travel', label: 'Travel & Transportation' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Subscriptions' },
    { value: 'training', label: 'Training & Education' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'communication', label: 'Communication' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'other', label: 'Other' }
  ];

  // Mock currency options
  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' }
  ];

  // Calculate converted amount when currency or amount changes
  useEffect(() => {
    if (formData?.amount && formData?.currency && formData?.currency !== 'USD') {
      const rate = exchangeRates?.[formData?.currency] || 1;
      const converted = (parseFloat(formData?.amount) / rate)?.toFixed(2);
      setConvertedAmount(converted);
    } else {
      setConvertedAmount('');
    }
  }, [formData?.amount, formData?.currency, exchangeRates]);

  // Update form with OCR data when available
  useEffect(() => {
    if (ocrData) {
      const updates = {};
      if (ocrData?.amount) updates.amount = ocrData?.amount;
      if (ocrData?.date) updates.date = ocrData?.date;
      if (ocrData?.vendor) updates.vendor = ocrData?.vendor;
      
      Object.keys(updates)?.forEach(key => {
        onFormChange(key, updates?.[key]);
      });
    }
  }, [ocrData, onFormChange]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData?.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData?.description || formData?.description?.trim()?.length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }
    
    if (!formData?.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData?.currency) {
      errors.currency = 'Currency is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft();
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Icon name="Receipt" size={24} className="mr-2 text-primary" />
          Expense Details
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the expense information below. Fields marked with * are required.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Amount and Currency Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData?.amount}
            onChange={(e) => onFormChange('amount', e?.target?.value)}
            error={validationErrors?.amount}
            required
            className="font-mono"
          />
          
          <div className="space-y-2">
            <Select
              label="Currency *"
              options={currencyOptions}
              value={formData?.currency}
              onChange={(value) => onFormChange('currency', value)}
              error={validationErrors?.currency}
              required
              searchable
            />
            {convertedAmount && (
              <p className="text-xs text-muted-foreground">
                ≈ ${convertedAmount} USD
              </p>
            )}
          </div>
        </div>

        {/* Date and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Expense Date *"
            type="date"
            value={formData?.date}
            onChange={(e) => onFormChange('date', e?.target?.value)}
            error={validationErrors?.date}
            required
            max={new Date()?.toISOString()?.split('T')?.[0]}
          />
          
          <Select
            label="Category *"
            options={expenseCategories}
            value={formData?.category}
            onChange={(value) => onFormChange('category', value)}
            error={validationErrors?.category}
            required
            searchable
          />
        </div>

        {/* Vendor/Merchant */}
        <Input
          label="Vendor/Merchant"
          type="text"
          placeholder="e.g., Starbucks, Uber, Hotel Name"
          value={formData?.vendor}
          onChange={(e) => onFormChange('vendor', e?.target?.value)}
          description="Name of the business or service provider"
        />

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Description *
          </label>
          <textarea
            className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y"
            placeholder="Provide a detailed description of the expense..."
            value={formData?.description}
            onChange={(e) => onFormChange('description', e?.target?.value)}
            rows={3}
            required
          />
          {validationErrors?.description && (
            <p className="text-sm text-destructive">{validationErrors?.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData?.description?.length}/500 characters
          </p>
        </div>

        {/* Business Purpose */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Business Purpose
          </label>
          <textarea
            className="w-full min-h-20 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y"
            placeholder="Explain how this expense relates to business activities..."
            value={formData?.businessPurpose}
            onChange={(e) => onFormChange('businessPurpose', e?.target?.value)}
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Optional but recommended for faster approval
          </p>
        </div>

        {/* OCR Data Indicator */}
        {ocrData && (
          <div className="bg-success/10 border border-success/20 rounded-md p-3">
            <div className="flex items-center text-success">
              <Icon name="CheckCircle" size={16} className="mr-2" />
              <span className="text-sm font-medium">Receipt data extracted successfully</span>
            </div>
            <p className="text-xs text-success/80 mt-1">
              Please verify the extracted information and make any necessary corrections.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            className="sm:order-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            loading={isDraftSaving}
            iconName="Save"
            iconPosition="left"
            className="sm:order-1"
          >
            {isDraftSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            iconName="X"
            iconPosition="left"
            className="sm:order-3"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;