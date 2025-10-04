import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminControls = () => {
  const [activeSection, setActiveSection] = useState('users');

  const controlSections = [
    {
      id: 'users',
      title: 'User Management',
      icon: 'Users',
      description: 'Manage user roles and permissions'
    },
    {
      id: 'workflows',
      title: 'Approval Workflows',
      icon: 'GitBranch',
      description: 'Configure approval processes'
    },
    {
      id: 'policies',
      title: 'Expense Policies',
      icon: 'FileText',
      description: 'Set spending limits and rules'
    },
    {
      id: 'reports',
      title: 'Reports & Export',
      icon: 'Download',
      description: 'Generate and export reports'
    }
  ];

  const userManagementActions = [
    { label: 'Add New User', icon: 'UserPlus', action: 'add-user', variant: 'default' },
    { label: 'Manage Roles', icon: 'Shield', action: 'manage-roles', variant: 'outline' },
    { label: 'User Permissions', icon: 'Key', action: 'permissions', variant: 'outline' },
    { label: 'Bulk Import', icon: 'Upload', action: 'bulk-import', variant: 'secondary' }
  ];

  const workflowActions = [
    { label: 'Create Workflow', icon: 'Plus', action: 'create-workflow', variant: 'default' },
    { label: 'Edit Templates', icon: 'Edit', action: 'edit-templates', variant: 'outline' },
    { label: 'Approval Rules', icon: 'Settings', action: 'approval-rules', variant: 'outline' },
    { label: 'Escalation Matrix', icon: 'TrendingUp', action: 'escalation', variant: 'secondary' }
  ];

  const policyActions = [
    { label: 'Update Policies', icon: 'FileEdit', action: 'update-policies', variant: 'default' },
    { label: 'Spending Limits', icon: 'DollarSign', action: 'spending-limits', variant: 'outline' },
    { label: 'Category Rules', icon: 'Tag', action: 'category-rules', variant: 'outline' },
    { label: 'Compliance Check', icon: 'CheckCircle', action: 'compliance', variant: 'secondary' }
  ];

  const reportActions = [
    { label: 'Generate Report', icon: 'FileText', action: 'generate-report', variant: 'default' },
    { label: 'Export Data', icon: 'Download', action: 'export-data', variant: 'outline' },
    { label: 'Schedule Reports', icon: 'Calendar', action: 'schedule-reports', variant: 'outline' },
    { label: 'Audit Trail', icon: 'Eye', action: 'audit-trail', variant: 'secondary' }
  ];

  const getActionsForSection = (sectionId) => {
    switch (sectionId) {
      case 'users':
        return userManagementActions;
      case 'workflows':
        return workflowActions;
      case 'policies':
        return policyActions;
      case 'reports':
        return reportActions;
      default:
        return [];
    }
  };

  const handleAction = (action) => {
    console.log(`Executing action: ${action}`);
    // In a real app, this would navigate to the appropriate page or open a modal
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground mb-2">Administrative Controls</h2>
        <p className="text-sm text-muted-foreground">Manage system configuration and user access</p>
      </div>
      <div className="p-6">
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {controlSections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg expense-transition ${
                activeSection === section?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <Icon name={section?.icon} size={16} />
              <span className="text-sm font-medium">{section?.title}</span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-foreground mb-1">
              {controlSections?.find(s => s?.id === activeSection)?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {controlSections?.find(s => s?.id === activeSection)?.description}
            </p>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getActionsForSection(activeSection)?.map((action) => (
              <Button
                key={action?.action}
                variant={action?.variant}
                onClick={() => handleAction(action?.action)}
                iconName={action?.icon}
                iconPosition="left"
                fullWidth
                className="justify-start h-12"
              >
                {action?.label}
              </Button>
            ))}
          </div>

          {/* Quick Stats for Active Section */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activeSection === 'users' && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">247</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">23</p>
                    <p className="text-xs text-muted-foreground">Active Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">5</p>
                    <p className="text-xs text-muted-foreground">Pending Access</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Admins</p>
                  </div>
                </>
              )}

              {activeSection === 'workflows' && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">8</p>
                    <p className="text-xs text-muted-foreground">Active Workflows</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">156</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">23</p>
                    <p className="text-xs text-muted-foreground">Escalated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">2.3</p>
                    <p className="text-xs text-muted-foreground">Avg Days</p>
                  </div>
                </>
              )}

              {activeSection === 'policies' && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">15</p>
                    <p className="text-xs text-muted-foreground">Active Policies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">94.2%</p>
                    <p className="text-xs text-muted-foreground">Compliance Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">23</p>
                    <p className="text-xs text-muted-foreground">Violations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">$5K</p>
                    <p className="text-xs text-muted-foreground">Default Limit</p>
                  </div>
                </>
              )}

              {activeSection === 'reports' && (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">45</p>
                    <p className="text-xs text-muted-foreground">Reports Generated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">12</p>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">3</p>
                    <p className="text-xs text-muted-foreground">Pending Export</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">1.2GB</p>
                    <p className="text-xs text-muted-foreground">Data Size</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;