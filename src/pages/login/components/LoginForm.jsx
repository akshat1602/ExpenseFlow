import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Mock credentials for different user roles
  const mockCredentials = {
    employee: { email: 'john.smith@company.com', password: 'employee123' },
    manager: { email: 'sarah.johnson@company.com', password: 'manager123' },
    admin: { email: 'michael.chen@company.com', password: 'admin123' }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check against mock credentials
    let userRole = null;
    let isValidCredentials = false;

    Object.entries(mockCredentials)?.forEach(([role, credentials]) => {
      if (credentials?.email === formData?.email && credentials?.password === formData?.password) {
        userRole = role;
        isValidCredentials = true;
      }
    });

    if (!isValidCredentials) {
      setValidationErrors({
        general: 'Invalid email or password. Please try again.'
      });
      return;
    }

    // Simulate API call
    await onSubmit(formData, userRole);
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
    // In real app, navigate to forgot password page
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {(error || validationErrors?.general) && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-3">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
          <p className="text-sm text-error">{error || validationErrors?.general}</p>
        </div>
      )}
      {/* Email Field */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your work email"
        value={formData?.email}
        onChange={handleInputChange}
        error={validationErrors?.email}
        required
        disabled={loading}
        className="w-full"
      />
      {/* Password Field */}
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData?.password}
        onChange={handleInputChange}
        error={validationErrors?.password}
        required
        disabled={loading}
        className="w-full"
      />
      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={loading}
        />
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 expense-transition"
          disabled={loading}
        >
          Forgot password?
        </button>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        iconName="LogIn"
        iconPosition="left"
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
      {/* Mock Credentials Helper */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Employee:</strong> john.smith@company.com / employee123</p>
          <p><strong>Manager:</strong> sarah.johnson@company.com / manager123</p>
          <p><strong>Admin:</strong> michael.chen@company.com / admin123</p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;