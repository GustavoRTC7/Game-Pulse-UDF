import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'in-game';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  status,
  className = ''
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    'in-game': 'bg-purple-500'
  };

  return (
    <div className={`relative ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`${sizeStyles[size]} rounded-full object-cover border-2 border-gray-700`} 
      />
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ${sizeStyles.xs} ${statusColors[status]} border-2 border-gray-900`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;