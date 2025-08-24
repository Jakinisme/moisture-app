import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  title = "Kelembapan Tanah Selama 24 Jam Terakhir",
}) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.graph}>
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
              stroke="#0059ffff"
              strokeWidth={3}
              dot={{ fill: "#0059ffff", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "##0059ffff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
