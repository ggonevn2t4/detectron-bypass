
import React from 'react';

interface PlaceholderTabProps {
  title: string;
  description: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title, description }) => {
  return (
    <div className="p-6 text-center text-muted-foreground">
      <div className="py-16">
        <h3 className="text-xl mb-4">{title}</h3>
        <p>{description}</p>
        <p className="mt-2">Switch to this tab to use the {title.toLowerCase()} features.</p>
      </div>
    </div>
  );
};

export default PlaceholderTab;
