import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ActionButtons = ({ 
  expense, 
  userRole, 
  onApprove, 
  onReject, 
  onRequestClarification, 
  onEscalate,
  canApprove,
  canReject,
  canEscalate 
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove();
    } catch (error) {
      console.error('Failed to approve expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason?.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReject(rejectReason?.trim());
      setShowRejectModal(false);
      setRejectReason('');
    } catch (error) {
      console.error('Failed to reject expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestClarification = async () => {
    if (!clarificationMessage?.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onRequestClarification(clarificationMessage?.trim());
      setShowClarificationModal(false);
      setClarificationMessage('');
    } catch (error) {
      console.error('Failed to request clarification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    setIsSubmitting(true);
    try {
      await onEscalate();
    } catch (error) {
      console.error('Failed to escalate expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show action buttons if expense is already approved or rejected
  if (expense?.status === 'approved' || expense?.status === 'rejected') {
    return (
      <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
        <div className="text-center py-4">
          <Icon 
            name={expense?.status === 'approved' ? 'CheckCircle' : 'XCircle'} 
            size={48} 
            className={expense?.status === 'approved' ? 'text-success' : 'text-error'} 
          />
          <p className="text-lg font-medium text-foreground mt-2">
            Expense {expense?.status === 'approved' ? 'Approved' : 'Rejected'}
          </p>
          <p className="text-sm text-muted-foreground">
            No further actions required
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <span>Actions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {canApprove && (
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={isSubmitting}
              loading={isSubmitting}
              iconName="Check"
              iconPosition="left"
              fullWidth
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Approve
            </Button>
          )}

          {canReject && (
            <Button
              variant="destructive"
              onClick={() => setShowRejectModal(true)}
              disabled={isSubmitting}
              iconName="X"
              iconPosition="left"
              fullWidth
            >
              Reject
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setShowClarificationModal(true)}
            disabled={isSubmitting}
            iconName="HelpCircle"
            iconPosition="left"
            fullWidth
          >
            Request Info
          </Button>

          {canEscalate && (
            <Button
              variant="secondary"
              onClick={handleEscalate}
              disabled={isSubmitting}
              iconName="ArrowUp"
              iconPosition="left"
              fullWidth
            >
              Escalate
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Share"
              iconPosition="left"
            >
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Flag"
              iconPosition="left"
            >
              Flag Issue
            </Button>
          </div>
        </div>
      </div>
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md expense-shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="XCircle" size={20} className="text-error" />
              <h3 className="text-lg font-semibold text-foreground">Reject Expense</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this expense. This will be visible to the employee.
            </p>

            <Input
              label="Rejection Reason"
              type="text"
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e?.target?.value)}
              required
              className="mb-4"
            />

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason?.trim() || isSubmitting}
                loading={isSubmitting}
                fullWidth
              >
                Reject Expense
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Clarification Modal */}
      {showClarificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md expense-shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="HelpCircle" size={20} className="text-warning" />
              <h3 className="text-lg font-semibold text-foreground">Request Clarification</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Ask the employee to provide additional information or clarification about this expense.
            </p>

            <Input
              label="Clarification Request"
              type="text"
              placeholder="What additional information do you need?"
              value={clarificationMessage}
              onChange={(e) => setClarificationMessage(e?.target?.value)}
              required
              className="mb-4"
            />

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowClarificationModal(false);
                  setClarificationMessage('');
                }}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleRequestClarification}
                disabled={!clarificationMessage?.trim() || isSubmitting}
                loading={isSubmitting}
                fullWidth
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;