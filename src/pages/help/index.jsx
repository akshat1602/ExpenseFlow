import React from 'react';
import Icon from '../../components/AppIcon';

const HelpSupport = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold flex items-center space-x-3">
        <Icon name="HelpCircle" size={24} />
        <span>Help & Support</span>
      </h1>
      <p className="mt-4 text-muted-foreground">Find documentation and contact support.</p>
      {/* Add links and contact info here */}
    </div>
  );
};

export default HelpSupport;
