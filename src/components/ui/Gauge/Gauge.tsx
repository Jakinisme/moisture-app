import React from 'react';
import  useIntersectionObserver  from '../../../hooks/intersectionObserver';
import styles from './Gauge.module.css';

interface GaugeProps {
  value: number;
  max?: number;
  title?: string;
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  max = 70, 
  title = "Current Moisture Level",
  size = 200 
}) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.3,
    rootMargin: '30px'
  });

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
    <div 
      ref={ref}
      className={styles.gauge}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      <h3 className={styles.title}>{title}</h3>
      
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} className={styles.svg}>
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
        
        <div className={styles.center}>
          <div className={styles.value}>{value}</div>
          <div className={styles.unit}>%</div>
          <div className={styles.status}>{getStatus(value)}</div>
        </div>
      </div>
    </div>
  );
};
