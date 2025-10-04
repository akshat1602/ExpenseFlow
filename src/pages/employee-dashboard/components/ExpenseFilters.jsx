import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ExpenseFilters = ({ isOpen, onToggle, onFiltersChange }) => {
  const [filters, setFilters] = useState({
    dateRange: '',
    category: '',
    status: '',
    amountMin: '',
    amountMax: ''
  });

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'travel', label: 'Travel & Lodging' },
    { value: 'office', label: 'Office Expenses' },
    { value: 'training', label: 'Training & Development' },
    { value: 'equipment', label: 'Equipment & Software' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'reimbursed', label: 'Reimbursed' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      dateRange: '',
      category: '',
      status: '',
      amountMin: '',
      amountMax: ''
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          iconName="Filter"
          iconPosition="left"
          fullWidth
        >
          Filters {hasActiveFilters && `(${Object.values(filters)?.filter(v => v !== '')?.length})`}
        </Button>
      </div>
      {/* Mobile Filter Panel */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-200">
          <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border expense-shadow-lg animate-slide-in-right">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  iconName="X"
                />
              </div>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto h-full pb-20">
              <FilterContent
                filters={filters}
                dateRangeOptions={dateRangeOptions}
                categoryOptions={categoryOptions}
                statusOptions={statusOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </div>
      )}
      {/* Desktop Filter Panel */}
      <div className="hidden md:block bg-card border border-border rounded-lg p-6 expense-shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear All
            </Button>
          )}
        </div>
        <FilterContent
          filters={filters}
          dateRangeOptions={dateRangeOptions}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          isDesktop
        />
      </div>
    </>
  );
};

const FilterContent = ({ 
  filters, 
  dateRangeOptions, 
  categoryOptions, 
  statusOptions, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters,
  isDesktop = false 
}) => {
  return (
    <div className={`space-y-4 ${isDesktop ? 'grid grid-cols-1 lg:grid-cols-5 gap-4' : ''}`}>
      <Select
        label="Date Range"
        options={dateRangeOptions}
        value={filters?.dateRange}
        onChange={(value) => onFilterChange('dateRange', value)}
        placeholder="Select date range"
      />
      <Select
        label="Category"
        options={categoryOptions}
        value={filters?.category}
        onChange={(value) => onFilterChange('category', value)}
        placeholder="Select category"
        searchable
      />
      <Select
        label="Status"
        options={statusOptions}
        value={filters?.status}
        onChange={(value) => onFilterChange('status', value)}
        placeholder="Select status"
      />
      <Input
        label="Min Amount"
        type="number"
        placeholder="$0.00"
        value={filters?.amountMin}
        onChange={(e) => onFilterChange('amountMin', e?.target?.value)}
        min="0"
        step="0.01"
      />
      <Input
        label="Max Amount"
        type="number"
        placeholder="$999.99"
        value={filters?.amountMax}
        onChange={(e) => onFilterChange('amountMax', e?.target?.value)}
        min="0"
        step="0.01"
      />
      {!isDesktop && hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
          fullWidth
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default ExpenseFilters;
