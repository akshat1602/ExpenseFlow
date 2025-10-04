import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ExpenseHeader from './components/ExpenseHeader';
import ExpenseInformation from './components/ExpenseInformation';
import ReceiptViewer from './components/ReceiptViewer';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import CommentsSection from './components/CommentsSection';
import ActionButtons from './components/ActionButtons';
import AuditLog from './components/AuditLog';

const ExpenseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('manager');
  const [isLoading, setIsLoading] = useState(true);

  // Mock current user data
  const currentUser = {
    id: 'user_002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Manager'
  };

  // Mock expense data
  const [expense] = useState({
    id: 'EXP-2024-001',
    amount: 1250.00,
    originalCurrency: 'EUR',
    convertedAmount: '1,125.50',
    expenseDate: '2024-10-01',
    submissionDate: '2024-10-02',
    category: 'Travel',
    department: 'Engineering',
    status: 'Under Review',
    priority: 'Medium',
    description: 'Flight tickets for client meeting in Berlin - Q4 product roadmap discussion with key stakeholders',
    businessPurpose: `Attended quarterly business review meeting with our largest European client to discuss:\n• Q4 product roadmap alignment\n• Technical integration requirements\n• Contract renewal negotiations\n• Strategic partnership opportunities`,
    employeeName: 'John Smith',
    employeeEmail: 'john.smith@company.com',
    employeeId: 'EMP-001',
    employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    managerName: 'Sarah Johnson',
    managerEmail: 'sarah.johnson@company.com',
    managerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    location: 'Berlin, Germany',
    paymentMethod: 'Corporate Card',
    vendor: 'Lufthansa Airlines',
    projectCode: 'PROJ-2024-Q4',
    projectName: 'European Market Expansion'
  });

  // Mock receipt data
  const receipts = [
    {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=800&fit=crop',
      name: 'Flight Receipt'
    }
  ];

  const ocrData = {
    amount: '1,250.00',
    date: '2024-10-01',
    vendor: 'Lufthansa Airlines',
    tax: '187.50',
    paymentMethod: 'Credit Card',
    confidence: 94
  };

  // Mock workflow data
  const workflow = [
    {
      title: 'Employee Submission',
      description: 'Expense submitted by employee with receipt and documentation',
      status: 'completed',
      approver: {
        name: 'John Smith',
        role: 'Employee',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      approvedAt: '2024-10-02 09:15 AM',
      comment: 'Submitted expense for client meeting travel with all required documentation.'
    },
    {
      title: 'Manager Review',
      description: 'Direct manager review for policy compliance and business justification',
      status: 'current',
      approver: {
        name: 'Sarah Johnson',
        role: 'Manager',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      assignedAt: '2024-10-02 10:30 AM',
      requiredActions: [
        'Verify business purpose alignment',
        'Check policy compliance',
        'Validate receipt authenticity'
      ]
    },
    {
      title: 'Finance Approval',
      description: 'Finance team review for budget allocation and accounting verification',
      approver: {
        name: 'Michael Chen',
        role: 'Finance Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      title: 'Final Approval',
      description: 'Director approval for expenses above $1000 threshold',
      approver: {
        name: 'Emily Rodriguez',
        role: 'Director',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    }
  ];

  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: 'comment_001',
      author: {
        id: 'user_001',
        name: 'John Smith',
        role: 'Employee',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      content: 'This expense was for the quarterly business review meeting with our key European client. The meeting was essential for finalizing Q4 deliverables and securing contract renewal.',
      timestamp: '2024-10-02 09:20 AM',
      type: 'comment'
    },
    {
      id: 'comment_002',
      author: {
        id: 'user_003',
        name: 'Michael Chen',
        role: 'Finance Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      content: 'Please confirm if this expense should be allocated to the European Expansion project budget or general travel budget.',
      timestamp: '2024-10-02 11:45 AM',
      type: 'clarification'
    }
  ]);

  // Mock audit log data
  const auditEntries = [
    {
      id: 'audit_001',
      action: 'Created',
      description: 'Expense record created in the system',
      timestamp: '2024-10-02 09:10 AM',
      user: {
        id: 'user_001',
        name: 'John Smith',
        role: 'Employee',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      metadata: {
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/118.0'
      }
    },
    {
      id: 'audit_002',
      action: 'Submitted',
      description: 'Expense submitted for approval workflow',
      timestamp: '2024-10-02 09:15 AM',
      user: {
        id: 'user_001',
        name: 'John Smith',
        role: 'Employee',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      details: {
        'Workflow Stage': 'Manager Review',
        'Amount': '$1,250.00',
        'Category': 'Travel'
      }
    },
    {
      id: 'audit_003',
      action: 'Viewed',
      description: 'Expense details viewed by manager',
      timestamp: '2024-10-02 10:30 AM',
      user: {
        id: 'user_002',
        name: 'Sarah Johnson',
        role: 'Manager',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    },
    {
      id: 'audit_004',
      action: 'Commented',
      description: 'Comment added requesting budget allocation clarification',
      timestamp: '2024-10-02 11:45 AM',
      user: {
        id: 'user_003',
        name: 'Michael Chen',
        role: 'Finance Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    const from = location?.state?.from;
    if (from) {
      navigate(from);
    } else {
      // Default navigation based on user role
      switch (userRole) {
        case 'admin': navigate('/admin-dashboard');
          break;
        case 'manager': navigate('/manager-dashboard');
          break;
        default:
          navigate('/employee-dashboard');
      }
    }
  };

  const handleEdit = () => {
    navigate('/expense-submission', { 
      state: { 
        editMode: true, 
        expenseId: expense?.id,
        expenseData: expense 
      } 
    });
  };

  const handleApprove = async () => {
    console.log('Approving expense:', expense?.id);
    // In real app, make API call to approve expense
    // Update local state or refetch data
  };

  const handleReject = async (reason) => {
    console.log('Rejecting expense:', expense?.id, 'Reason:', reason);
    // In real app, make API call to reject expense
  };

  const handleRequestClarification = async (message) => {
    console.log('Requesting clarification:', expense?.id, 'Message:', message);
    // In real app, make API call to request clarification
  };

  const handleEscalate = async () => {
    console.log('Escalating expense:', expense?.id);
    // In real app, make API call to escalate expense
  };

  const handleAddComment = async (comment) => {
    const newComment = {
      id: `comment_${Date.now()}`,
      author: currentUser,
      content: comment,
      timestamp: new Date()?.toLocaleString(),
      type: 'comment'
    };
    setComments(prev => [...prev, newComment]);
  };

  // Determine user permissions
  const canEdit = userRole === 'employee' && expense?.status === 'draft';
  const canApprove = (userRole === 'manager' || userRole === 'admin') && expense?.status !== 'approved';
  const canReject = (userRole === 'manager' || userRole === 'admin') && expense?.status !== 'rejected';
  const canEscalate = userRole === 'manager' && expense?.status === 'under review';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedSidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={userRole}
        />
        <main className={`expense-transition-layout ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
          <div className="p-6">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading expense details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      
      <main className={`expense-transition-layout ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <div className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <ExpenseHeader
            expense={expense}
            onBack={handleBack}
            onEdit={handleEdit}
            canEdit={canEdit}
            userRole={userRole}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Expense Information */}
              <ExpenseInformation expense={expense} />

              {/* Receipt Viewer */}
              <ReceiptViewer receipts={receipts} ocrData={ocrData} />

              {/* Comments Section */}
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                userRole={userRole}
                currentUser={currentUser}
              />
            </div>

            {/* Right Column - Workflow & Actions */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <ActionButtons
                expense={expense}
                userRole={userRole}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestClarification={handleRequestClarification}
                onEscalate={handleEscalate}
                canApprove={canApprove}
                canReject={canReject}
                canEscalate={canEscalate}
              />

              {/* Approval Workflow */}
              <ApprovalWorkflow workflow={workflow} currentStep={1} />

              {/* Audit Log */}
              <AuditLog auditEntries={auditEntries} />
            </div>
          </div>
        </div>
      </main>

      {/* Quick Action Button */}
      <QuickActionButton userRole={userRole} />
    </div>
  );
};

export default ExpenseDetails;