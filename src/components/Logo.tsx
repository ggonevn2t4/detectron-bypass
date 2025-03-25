
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
        <path d="M7.2 13.8a7 7 0 0 0 9.6 0" />
      </svg>
    </div>
  );
};

export default Logo;
