import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep = 1, totalSteps = 3 }) => {
  const steps = [
    { id: 1, label: 'Expense Details', icon: 'FileText' },
    { id: 2, label: 'Upload Receipt', icon: 'Upload' },
    { id: 3, label: 'Review & Submit', icon: 'CheckCircle' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'active':
        return 'bg-primary text-primary-foreground border-primary';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm p-6">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <div className="flex flex-col items-center space-y-2">
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center expense-transition
                ${getStepClasses(getStepStatus(step?.id))}
              `}>
                <Icon 
                  name={getStepStatus(step?.id) === 'completed' ? 'Check' : step?.icon} 
                  size={20} 
                />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${
                  getStepStatus(step?.id) === 'active' ?'text-primary' 
                    : getStepStatus(step?.id) === 'completed' ?'text-success' :'text-muted-foreground'
                }`}>
                  {step?.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Step {step?.id} of {totalSteps}
                </p>
              </div>
            </div>
            
            {index < steps?.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-0.5 expense-transition ${getConnectorClasses(step?.id)}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;