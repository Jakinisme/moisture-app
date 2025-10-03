import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import  useIntersectionObserver  from '../../../hooks/intersectionObserver';
import MoistureGuide from '../../../constants/MoistureGuide';
import styles from './Graph.module.css';

interface MoistureDataPoint {
  timestamp: number;
  moisture: number;
}

interface GraphProps {
  data: MoistureDataPoint[];
  title?: string;
}

export const Graph: React.FC<GraphProps> = ({
  data,
  title = "Kelembapan Tanah Saat Ini",
}) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.4,
    rootMargin: '50px'
  });

  return (
    <div 
      ref={ref}
      className={styles.container}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateX(0)' : 'translateX(-50px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}
    >
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.graph}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(unix: number) =>
                new Date(unix).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              }
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0, 70]}
              tick={{ fontSize: 12 }}
              label={{ value: "Level Kelembapan", angle: -90, position: "insideCenter" }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Kelembapan"]}
              labelFormatter={(label: number) =>
                `Waktu: ${new Date(label).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}`
              }
            />
            <Line
              type="monotone"
              dataKey="moisture"
              stroke="#008cffff"
              strokeWidth={3}
              dot={{ fill: "#008cffc9", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#0059ff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    
        <div className={styles.infoContainer}>
          <h3 className={styles.infoTitle}>Klasifikasi Kelembapan Tanah</h3>
          <MoistureGuide />
        </div>
      </div>
    
   </div>
      );
    };