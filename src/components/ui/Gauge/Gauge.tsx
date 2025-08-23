import React from 'react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  min = 0, 
  max = 70, 
  title = "Current Moisture Level",
  size = 200 
}) => {
  const radius = size / 2;
  const strokeWidth = size * 0.1;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const strokeDashoffset = circumference - (value / max) * circumference;
  
  const getColor = (val: number) => {
    if (val < 20) return '#ef4444'; 
    if (val < 40) return '#f59e0b'; 
    if (val < 60) return '#10b981'; 
    return '#3b82f6'; 
  };
  
  const getStatus = (val: number) => {
    if (val < 20) return 'Sangat Kering';
    if (val < 40) return 'Kering';
    if (val < 60) return 'Baik';
    return 'Lembab';
  };

  return (
    <div className="soil-moisture-gauge">
      <h3 className="soil-moisture-gauge-title">{title}</h3>
      
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} className="soil-moisture-gauge-svg">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          <circle
            stroke={getColor(value)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        <div className="soil-moisture-gauge-center">
          <div className="soil-moisture-gauge-value">{value}</div>
          <div className="soil-moisture-gauge-unit">%</div>
          <div className="soil-moisture-gauge-status">{getStatus(value)}</div>
        </div>
      </div>
      
      <div className="soil-moisture-gauge-range">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
};
