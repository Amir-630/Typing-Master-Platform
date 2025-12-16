import React from 'react';

interface Stats {
  wpm: number;
  accuracy: number;
  time: number;
}

interface StatsDisplayProps {
  stats: Stats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="flex items-center justify-between gap-8 p-4 bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">
          {stats.wpm.toFixed(1)}
        </div>
        <div className="text-sm text-gray-600 mt-1">WPM</div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">
          {stats.accuracy.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600 mt-1">Accuracy</div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-600">
          {Math.floor(stats.time)}s
        </div>
        <div className="text-sm text-gray-600 mt-1">Time</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
