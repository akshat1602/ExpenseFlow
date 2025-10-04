import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Policy Violation Detected',
      message: 'Amanda White submitted an expense exceeding department limit by $340',
      timestamp: '2 minutes ago',
      priority: 'high',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'approval',
      title: 'Escalated Approval Required',
      message: 'Jennifer Lee\'s training expense requires director approval ($2,100)',
      timestamp: '15 minutes ago',
      priority: 'medium',
      read: false,
      actionRequired: true
    },
    {
      id: 3,
      type: 'system',
      title: 'Monthly Report Generated',
      message: 'September expense report is ready for download',
      timestamp: '1 hour ago',
      priority: 'low',
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      type: 'budget',
      title: 'Budget Threshold Alert',
      message: 'Engineering department has reached 85% of monthly budget',
      timestamp: '2 hours ago',
      priority: 'medium',
      read: false,
      actionRequired: false
    },
    {
      id: 5,
      type: 'user',
      title: 'New User Registration',
      message: 'Alex Thompson has requested access to the expense system',
      timestamp: '3 hours ago',
      priority: 'low',
      read: true,
      actionRequired: true
    }
  ]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      alert: { name: 'AlertTriangle', color: 'text-error' },
      approval: { name: 'Clock', color: 'text-warning' },
      system: { name: 'Settings', color: 'text-primary' },
      budget: { name: 'TrendingUp', color: 'text-accent' },
      user: { name: 'User', color: 'text-success' }
    };
    return iconMap?.[type] || iconMap?.system;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-error text-error-foreground', label: 'High' },
      medium: { color: 'bg-warning text-warning-foreground', label: 'Medium' },
      low: { color: 'bg-muted text-muted-foreground', label: 'Low' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.low;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== id));
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-foreground">System Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground px-2 py-1 rounded-full text-xs font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              className="h-8 w-8 p-0"
            />
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications at this time</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications?.map((notification) => {
              const iconConfig = getNotificationIcon(notification?.type);
              
              return (
                <div 
                  key={notification?.id} 
                  className={`p-4 hover:bg-muted/50 expense-transition ${
                    !notification?.read ? 'bg-accent/5 border-l-4 border-l-accent' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${iconConfig?.color}`}>
                      <Icon name={iconConfig?.name} size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${!notification?.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification?.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(notification?.priority)}
                          {notification?.actionRequired && (
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification?.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification?.timestamp}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {!notification?.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification?.id)}
                              className="text-xs h-6 px-2"
                            >
                              Mark as read
                            </Button>
                          )}
                          
                          {notification?.actionRequired && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2"
                            >
                              Take Action
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(notification?.id)}
                            iconName="X"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {notifications?.length} total notifications
          </p>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Archive"
            iconPosition="left"
          >
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemNotifications;