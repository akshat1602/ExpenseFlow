import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ApprovalWorkflow = ({ workflow, currentStep }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'current': return 'Clock';
      case 'rejected': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'current': return 'text-warning';
      case 'rejected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center space-x-2">
        <Icon name="GitBranch" size={20} className="text-primary" />
        <span>Approval Workflow</span>
      </h2>
      <div className="space-y-6">
        {workflow?.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === workflow?.length - 1;

          return (
            <div key={index} className="relative">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
              )}
              <div className="flex items-start space-x-4">
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center expense-transition ${
                  status === 'completed' 
                    ? 'bg-success border-success' 
                    : status === 'current' ?'bg-warning border-warning'
                    : status === 'rejected' ?'bg-error border-error' :'bg-muted border-border'
                }`}>
                  <Icon 
                    name={getStatusIcon(step?.status || status)} 
                    size={20} 
                    className={status === 'completed' || status === 'current' || status === 'rejected' ? 'text-white' : 'text-muted-foreground'}
                  />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">{step?.title}</h3>
                    <span className={`text-sm font-medium ${getStatusColor(step?.status || status)}`}>
                      {step?.status || status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {step?.description}
                  </p>

                  {/* Approver Info */}
                  <div className="flex items-center space-x-3 bg-muted/30 p-3 rounded-md">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                      <Image
                        src={step?.approver?.avatar}
                        alt={step?.approver?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{step?.approver?.name}</p>
                      <p className="text-xs text-muted-foreground">{step?.approver?.role}</p>
                    </div>
                    {step?.approvedAt && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Approved</p>
                        <p className="text-xs font-medium text-foreground">{step?.approvedAt}</p>
                      </div>
                    )}
                    {step?.status === 'current' && (
                      <div className="text-right">
                        <p className="text-xs text-warning">Pending</p>
                        <p className="text-xs text-muted-foreground">Since {step?.assignedAt}</p>
                      </div>
                    )}
                  </div>

                  {/* Step Comments */}
                  {step?.comment && (
                    <div className="mt-3 bg-accent/10 border border-accent/20 p-3 rounded-md">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="MessageSquare" size={14} className="text-accent" />
                        <span className="text-xs font-medium text-accent">Comment</span>
                      </div>
                      <p className="text-sm text-foreground">{step?.comment}</p>
                    </div>
                  )}

                  {/* Required Actions */}
                  {step?.status === 'current' && step?.requiredActions && (
                    <div className="mt-3 bg-warning/10 border border-warning/20 p-3 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="AlertTriangle" size={14} className="text-warning" />
                        <span className="text-xs font-medium text-warning">Required Actions</span>
                      </div>
                      <ul className="text-sm text-foreground space-y-1">
                        {step?.requiredActions?.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-center space-x-2">
                            <Icon name="ArrowRight" size={12} className="text-warning" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Workflow Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {workflow?.filter(step => step?.status === 'completed')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {workflow?.filter(step => step?.status === 'current' || (!step?.status && getStepStatus(workflow?.indexOf(step)) === 'current'))?.length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground mb-1">
              {workflow?.filter(step => !step?.status && getStepStatus(workflow?.indexOf(step)) === 'pending')?.length}
            </div>
            <div className="text-sm text-muted-foreground">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflow;