import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoistureDataPoint {
  timestamp: string;
  moisture: number;
}

interface GraphProps {
  data: MoistureDataPoint[];
  title?: string;
}

export const Graph: React.FC<GraphProps> = ({ data, title = "Kelembapan Tanah Selama 24 Jam Terakhir" }) => {
  return (
    <div className="soil-moisture-graph-container">
      <h3 className="soil-moisture-graph-title">{title}</h3>
      <div className="soil-moisture-graph">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 70]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Moisture Level', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Moisture']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
