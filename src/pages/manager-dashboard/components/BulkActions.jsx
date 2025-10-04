import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedExpenses, onBulkAction, totalExpenses }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const actionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'approve', label: 'Approve Selected' },
    { value: 'reject', label: 'Reject Selected' },
    { value: 'escalate', label: 'Escalate to Director' },
    { value: 'request-info', label: 'Request More Information' },
    { value: 'export', label: 'Export Selected' }
  ];

  const handleBulkAction = async () => {
    if (!selectedAction || selectedExpenses?.length === 0) return;

    setIsProcessing(true);
    try {
      await onBulkAction(selectedAction, selectedExpenses);
      setSelectedAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action) => {
    const iconMap = {
      approve: 'Check',
      reject: 'X',
      escalate: 'ArrowUp',
      'request-info': 'MessageCircle',
      export: 'Download'
    };
    return iconMap?.[action] || 'Settings';
  };

  const getActionVariant = (action) => {
    const variantMap = {
      approve: 'success',
      reject: 'destructive',
      escalate: 'outline',
      'request-info': 'secondary',
      export: 'outline'
    };
    return variantMap?.[action] || 'default';
  };

  if (selectedExpenses?.length === 0) {
    return (
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Icon name="MousePointer" size={20} />
          <span className="text-sm">Select expenses to perform bulk actions</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Bulk Actions</h3>
              <p className="text-sm text-muted-foreground">
                {selectedExpenses?.length} of {totalExpenses} expenses selected
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Total: ${selectedExpenses?.reduce((sum, expense) => sum + (expense?.amount || 0), 0)?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex-1">
            <Select
              options={actionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Choose an action..."
            />
          </div>
          <Button
            variant={selectedAction ? getActionVariant(selectedAction) : 'outline'}
            onClick={handleBulkAction}
            disabled={!selectedAction || isProcessing}
            loading={isProcessing}
            iconName={selectedAction ? getActionIcon(selectedAction) : 'Play'}
            iconPosition="left"
          >
            {isProcessing ? 'Processing...' : 'Execute Action'}
          </Button>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          <Select
            options={actionOptions}
            value={selectedAction}
            onChange={setSelectedAction}
            placeholder="Choose an action..."
          />
          <Button
            variant={selectedAction ? getActionVariant(selectedAction) : 'outline'}
            onClick={handleBulkAction}
            disabled={!selectedAction || isProcessing}
            loading={isProcessing}
            iconName={selectedAction ? getActionIcon(selectedAction) : 'Play'}
            iconPosition="left"
            fullWidth
          >
            {isProcessing ? 'Processing...' : 'Execute Action'}
          </Button>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAction('approve');
                handleBulkAction();
              }}
              iconName="Check"
              iconPosition="left"
              className="text-success hover:bg-success/10"
            >
              Quick Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAction('reject');
                handleBulkAction();
              }}
              iconName="X"
              iconPosition="left"
              className="text-error hover:bg-error/10"
            >
              Quick Reject
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAction('export');
                handleBulkAction();
              }}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;