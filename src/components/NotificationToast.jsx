import React, { useEffect, useState } from 'react';

const Toast = ({ item, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(item.id), 6000);
    return () => clearTimeout(t);
  }, [item, onClose]);

  return (
    <div className="bg-card border border-border rounded-md p-3 mb-2 shadow-md flex items-start space-x-3 animate-toast-enter">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1v11" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21H3" stroke="var(--color-muted-foreground)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">{item.title}</div>
          <div className="text-xs text-muted-foreground">Just now</div>
        </div>
        <div className="text-sm text-muted-foreground mt-1">{item.message}</div>
      </div>
    </div>
  );
};

const NotificationToastHost = ({ toasts, onRemove }) => {
  return (
    <div className="fixed right-4 bottom-4 w-96 z-60">
      {toasts.map(t => (
        <Toast key={t.id} item={t} onClose={onRemove} />
      ))}
    </div>
  );
};

export default NotificationToastHost;
