import React from 'react';

/**
 * LoadingSpinner - Animated loading indicator
 */
const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'min-h-screen bg-dark-900 flex items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-dark-700 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 text-dark-400 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
