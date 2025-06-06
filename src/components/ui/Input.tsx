import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const widthStyles = fullWidth ? 'w-full' : '';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-600 focus:ring-purple-500 focus:border-purple-500';
  
  return (
    <div className={widthStyles}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            bg-gray-800 text-gray-100 rounded-lg border 
            ${errorStyles}
            ${leftIcon ? 'pl-10' : 'pl-4'} 
            ${rightIcon ? 'pr-10' : 'pr-4'} 
            py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;