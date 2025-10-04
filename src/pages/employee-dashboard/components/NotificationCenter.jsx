import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'approval',
      title: 'Expense Approved',
      message: 'Your conference registration expense of $1,250.00 has been approved by Sarah Johnson.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      read: false,
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'rejection',
      title: 'Expense Rejected',
      message: 'Office supplies expense requires itemized receipt. Please resubmit with detailed breakdown.',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      read: false,
      icon: 'XCircle',
      color: 'text-error'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Receipt Required',
      message: 'Please upload receipt for your taxi expense of $89.25 within 48 hours.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: true,
      icon: 'AlertCircle',
      color: 'text-warning'
    },
    {
      id: 4,
      type: 'reimbursement',
      title: 'Reimbursement Processed',
      message: 'Your hotel accommodation expense of $156.75 has been reimbursed to your account.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      icon: 'CreditCard',
      color: 'text-accent'
    }
  ]);

  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;
  const displayNotifications = showAll ? notifications : notifications?.slice(0, 3);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(notification => ({ ...notification, read: true }))
    );
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm mb-6">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                iconName="CheckCheck"
                iconPosition="left"
              >
                Mark All Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Open notification settings')}
              iconName="Settings"
            />
          </div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {displayNotifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          displayNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 hover:bg-muted/50 expense-transition cursor-pointer ${
                !notification?.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => markAsRead(notification?.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${notification?.color}`}>
                  <Icon name={notification?.icon} size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${!notification?.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification?.title}
                      </h3>
                      <p className={`text-sm mt-1 ${!notification?.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification?.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification?.timestamp)}
                      </span>
                      {!notification?.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {notifications?.length > 3 && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAll(!showAll)}
            iconName={showAll ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAll ? 'Show Less' : `Show All (${notifications?.length - 3} more)`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;