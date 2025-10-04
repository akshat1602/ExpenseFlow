import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingOverlay = ({ isVisible, message = 'Authenticating...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-8 expense-shadow-lg max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Spinning Icon */}
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon 
              name="Loader2" 
              size={24} 
              className="text-primary animate-spin"
            />
          </div>
          
          {/* Loading Message */}
          <h3 className="text-lg font-medium text-foreground mb-2">
            {message}
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your credentials
          </p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-1 mt-4">
            {[0, 1, 2]?.map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;