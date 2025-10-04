import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ManagerDashboard from './pages/manager-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import ExpenseDetails from './pages/expense-details';
import ExpenseSubmission from './pages/expense-submission';
import LoginPage from './pages/login';
import EmployeeDashboard from './pages/employee-dashboard';
import ProfileSettings from './pages/profile';
import NotificationPreferences from './pages/notifications';
import HelpSupport from './pages/help';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/expense-details" element={<ExpenseDetails />} />
        <Route path="/expense-submission" element={<ExpenseSubmission />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
  <Route path="/profile" element={<ProfileSettings />} />
  <Route path="/notifications" element={<NotificationPreferences />} />
  <Route path="/help" element={<HelpSupport />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
