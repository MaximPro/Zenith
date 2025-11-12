/**
 * Reusable Time Display Component
 */

import React, { memo } from 'react';
import type { TimeDisplayProps } from '../types';

const ClockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
      clipRule="evenodd"
    />
  </svg>
);

export const TimeDisplay: React.FC<TimeDisplayProps> = memo(({
  hours,
  label = 'Play time'
}) => {
  return (
    <div className="flex items-center gap-2" aria-label={`${label}: ${hours} hours`}>
      <ClockIcon className="w-5 h-5 text-orange-500" />
      <span className="text-sm font-medium text-orange-500">
        {hours.toFixed(1)}h
      </span>
    </div>
  );
});

TimeDisplay.displayName = 'TimeDisplay';
