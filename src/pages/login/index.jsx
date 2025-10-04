import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import LoginHeader from './components/LoginHeader';
import SecurityBadges from './components/SecurityBadges';
import LoadingOverlay from './components/LoadingOverlay';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement?.classList?.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement?.classList?.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement?.classList?.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = async (formData, userRole) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock JWT token generation
      const mockToken = `jwt_token_${userRole}_${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', formData?.email);
      
      if (formData?.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Navigate based on user role
      const roleRoutes = {
        employee: '/employee-dashboard',
        manager: '/manager-dashboard',
        admin: '/admin-dashboard'
      };

      navigate(roleRoutes?.[userRole] || '/employee-dashboard');
      
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 bg-card border border-border rounded-lg expense-shadow-sm hover:bg-muted expense-transition z-10"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5 text-foreground">
          {isDarkMode ? '🌙' : '☀️'}
        </div>
      </button>
      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl expense-shadow-lg p-8">
          {/* Header */}
          <LoginHeader />

          {/* Login Form */}
          <LoginForm 
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />

          {/* Security Badges */}
          <SecurityBadges />
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact{' '}
            <button className="text-primary hover:text-primary/80 expense-transition">
              IT Support
            </button>
          </p>
        </div>
      </div>
      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={loading}
        message="Signing you in..."
      />
      {/* Footer */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date()?.getFullYear()} ExpenseFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;