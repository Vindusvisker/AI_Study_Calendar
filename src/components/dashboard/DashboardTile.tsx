import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardTileProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const DashboardTile: React.FC<DashboardTileProps> = ({ 
  title, 
  icon: Icon, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default DashboardTile;