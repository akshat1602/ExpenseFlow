import React from 'react';
import Icon from '../../components/AppIcon';

const NotificationPreferences = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold flex items-center space-x-3">
        <Icon name="Bell" size={24} />
        <span>Notification Preferences</span>
      </h1>
      <p className="mt-4 text-muted-foreground">Control how you receive notifications from the platform.</p>
      {/* Add toggles and settings here */}
    </div>
  );
};

export default NotificationPreferences;
