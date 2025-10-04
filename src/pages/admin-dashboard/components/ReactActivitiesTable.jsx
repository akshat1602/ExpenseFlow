import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const RecentActivitiesTable = () => {
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const activities = [
    {
      id: 1,
      employee: "Sarah Johnson",
      department: "Engineering",
      amount: 1250.00,
      category: "Travel",
      status: "approved",
      date: "2025-10-03",
      approver: "Michael Chen",
      description: "Flight tickets for client meeting"
    },
    {
      id: 2,
      employee: "David Wilson",
      department: "Sales",
      amount: 89.50,
      category: "Meals",
      status: "pending",
      date: "2025-10-03",
      approver: "Lisa Rodriguez",
      description: "Client lunch meeting"
    },
    {
      id: 3,
      employee: "Emily Davis",
      department: "Marketing",
      amount: 450.00,
      category: "Software",
      status: "rejected",
      date: "2025-10-02",
      approver: "John Smith",
      description: "Design software subscription"
    },
    {
      id: 4,
      employee: "Robert Brown",
      department: "HR",
      amount: 320.75,
      category: "Office Supplies",
      status: "approved",
      date: "2025-10-02",
      approver: "Michael Chen",
      description: "Office equipment purchase"
    },
    {
      id: 5,
      employee: "Jennifer Lee",
      department: "Finance",
      amount: 2100.00,
      category: "Training",
      status: "pending",
      date: "2025-10-01",
      approver: "Sarah Johnson",
      description: "Professional certification course"
    },
    {
      id: 6,
      employee: "Mark Taylor",
      department: "Operations",
      amount: 75.25,
      category: "Transportation",
      status: "approved",
      date: "2025-10-01",
      approver: "Lisa Rodriguez",
      description: "Taxi fare for site visit"
    },
    {
      id: 7,
      employee: "Amanda White",
      department: "Engineering",
      amount: 890.00,
      category: "Equipment",
      status: "violation",
      date: "2025-09-30",
      approver: "Michael Chen",
      description: "Hardware purchase exceeding limit"
    },
    {
      id: 8,
      employee: "Chris Anderson",
      department: "Sales",
      amount: 156.80,
      category: "Entertainment",
      status: "pending",
      date: "2025-09-30",
      approver: "John Smith",
      description: "Team dinner expenses"
    },
    {
      id: 9,
      employee: "Michelle Garcia",
      department: "Marketing",
      amount: 675.00,
      category: "Advertising",
      status: "approved",
      date: "2025-09-29",
      approver: "Lisa Rodriguez",
      description: "Social media campaign costs"
    },
    {
      id: 10,
      employee: "Kevin Martinez",
      department: "HR",
      amount: 245.50,
      category: "Recruitment",
      status: "rejected",
      date: "2025-09-29",
      approver: "Sarah Johnson",
      description: "Job posting fees"
    }
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'HR', label: 'HR' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'violation', label: 'Policy Violation' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-success text-success-foreground', icon: 'CheckCircle', label: 'Approved' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock', label: 'Pending' },
      rejected: { color: 'bg-error text-error-foreground', icon: 'XCircle', label: 'Rejected' },
      violation: { color: 'bg-destructive text-destructive-foreground', icon: 'AlertTriangle', label: 'Violation' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span>{config?.label}</span>
      </span>
    );
  };

  const filteredActivities = activities?.filter(activity => {
    const matchesDepartment = !filterDepartment || activity?.department === filterDepartment;
    const matchesStatus = !filterStatus || activity?.status === filterStatus;
    const matchesSearch = !searchTerm || 
      activity?.employee?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      activity?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredActivities?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Recent Activities</h2>
            <p className="text-sm text-muted-foreground">All expense transactions across the organization</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Input
              type="search"
              placeholder="Search employees or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            
            <Select
              options={departmentOptions}
              value={filterDepartment}
              onChange={setFilterDepartment}
              placeholder="Department"
              className="w-full sm:w-40"
            />
            
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Status"
              className="w-full sm:w-32"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivities?.map((activity) => (
              <tr key={activity?.id} className="border-b border-border hover:bg-muted/50 expense-transition">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{activity?.employee}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-48">{activity?.description}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{activity?.department}</span>
                </td>
                <td className="p-4">
                  <span className="font-medium text-foreground">${activity?.amount?.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{activity?.category}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(activity?.status)}
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{activity?.date}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      className="h-8 w-8 p-0"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredActivities?.length)} of {filteredActivities?.length} results
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              className="h-8 w-8 p-0"
            />
            
            <span className="text-sm text-foreground px-3 py-1">
              {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              className="h-8 w-8 p-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivitiesTable;