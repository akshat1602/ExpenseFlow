import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      label: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      icon: 'Lock',
      label: 'SOC 2 Compliant',
      description: 'Enterprise security'
    },
    {
      icon: 'CheckCircle',
      label: 'GDPR Ready',
      description: 'Data protection'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <p className="text-center text-sm text-muted-foreground mb-4">
        Enterprise-grade security you can trust
      </p>
      <div className="flex justify-center items-center space-x-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex flex-col items-center space-y-1 group">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center group-hover:bg-success/20 expense-transition">
              <Icon 
                name={feature?.icon} 
                size={16} 
                className="text-success"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">{feature?.label}</p>
              <p className="text-xs text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadges;