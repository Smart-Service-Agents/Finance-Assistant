import PropTypes from 'prop-types';

export default function LoadingSpinner({
  size = 'md',
  color = 'white',
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    purple: 'border-purple-600 border-t-transparent'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-2 
          rounded-full 
          animate-spin
        `}
      />
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['white', 'blue', 'purple']),
  className: PropTypes.string
};

LoadingSpinner.defaultProps = {
  size: 'md',
  color: 'white',
  className: ''
};