// frontend/src/components/typing/KeyboardVisualizer.tsx
import React from 'react';

interface KeyboardVisualizerProps {
  keyPresses: Record<string, any>;
  layout: 'QWERTY' | 'AZERTY' | 'DVORAK' | 'COLEMAK' | 'QWERTZ';
}

const QWERTY_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({ keyPresses, layout }) => {
  const getKeyColor = (key: string) => {
    const data = keyPresses[key];
    if (!data) return 'bg-gray-100';
    
    const errorRate = data.errors / data.total;
    
    if (errorRate > 0.3) return 'bg-red-500';
    if (errorRate > 0.1) return 'bg-orange-300';
    if (data.total > 10) return 'bg-green-400';
    if (data.total > 0) return 'bg-blue-300';
    
    return 'bg-gray-100';
  };
  
  const getKeyIntensity = (key: string) => {
    const data = keyPresses[key];
    if (!data) return 1;
    
    return Math.min(data.total / 20, 1);
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center space-y-2">
        {QWERTY_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-1">
            {row.map((key) => {
              const intensity = getKeyIntensity(key);
              const color = getKeyColor(key);
              
              return (
                <div
                  key={key}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-md
                    transition-all duration-300
                    ${color}
                    shadow-md
                  `}
                  style={{
                    opacity: 0.5 + (intensity * 0.5),
                    transform: `scale(${0.9 + (intensity * 0.2)})`
                  }}
                >
                  <span className="font-semibold text-gray-800">
                    {key.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
            <span>Unused</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded mr-2"></div>
            <span>Used</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
            <span>Frequent</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Error-prone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardVisualizer;