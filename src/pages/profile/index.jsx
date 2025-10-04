import React from 'react';
import Icon from '../../components/AppIcon';

const ProfileSettings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold flex items-center space-x-3">
        <Icon name="User" size={24} />
        <span>Profile Settings</span>
      </h1>
      <p className="mt-4 text-muted-foreground">Manage your profile information and preferences here.</p>
      {/* Add real profile settings form here */}
    </div>
  );
};

export default ProfileSettings;
