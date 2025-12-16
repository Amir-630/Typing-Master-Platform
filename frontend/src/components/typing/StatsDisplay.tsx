import React from 'react';

interface StatsDisplayProps {
  label: string;
  value: string | number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ label, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>
      <div className="text-3xl font-bold text-blue-600">{value}</div>
    </div>
  );
};

export { StatsDisplay };
export default StatsDisplay;
