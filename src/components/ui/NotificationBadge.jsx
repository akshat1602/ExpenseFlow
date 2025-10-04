import React from 'react';

const NotificationBadge = ({ count = 0, variant = 'primary', size = 'default' }) => {
  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count?.toString();

  const sizeClasses = {
    sm: 'h-4 w-4 text-xs min-w-4',
    default: 'h-5 w-5 text-xs min-w-5',
    lg: 'h-6 w-6 text-sm min-w-6'
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    error: 'bg-error text-error-foreground',
    accent: 'bg-accent text-accent-foreground'
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      rounded-full font-medium
      expense-transition
      ${sizeClasses?.[size]}
      ${variantClasses?.[variant]}
    `}>
      {displayCount}
    </span>
  );
};

export default NotificationBadge;