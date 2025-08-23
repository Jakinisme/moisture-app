import React, { useState, useEffect } from 'react';
import { Graph } from '../../ui/Graph';
import { Gauge } from '../../ui/Gauge';

interface MoistureDataPoint {
  timestamp: string;
  moisture: number;
}

export const SoilMoistureChecker: React.FC = () => {
  const [moistureData, setMoistureData] = useState<MoistureDataPoint[]>([
    { timestamp: '00:00', moisture: 25 },
    { timestamp: '04:00', moisture: 28 },
    { timestamp: '08:00', moisture: 35 },
    { timestamp: '12:00', moisture: 42 },
    { timestamp: '16:00', moisture: 38 },
    { timestamp: '20:00', moisture: 31 },
    { timestamp: '23:00', moisture: 27 },
  ]);

  const [currentMoisture, setCurrentMoisture] = useState<number>(27);

  const now = new Date();
  const timeString = now.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newMoisture = Math.floor(Math.random() * 71);
      setCurrentMoisture(newMoisture);

      setMoistureData(prev => {
        const newData = [...prev, { timestamp: timeString, moisture: newMoisture }];
        return newData.slice(-24);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [timeString]);

  const getStatusClass = (moisture: number) => {
    if (moisture < 20) return 'very-dry';
    if (moisture < 40) return 'dry';
    if (moisture < 60) return 'good';
    return 'wet';
  };

  return (
    <div className="soil-moisture-container">
      <div className="soil-moisture-content">
        <div className="soil-moisture-grid">
          <div className="soil-moisture-gauge-container">
            <Gauge 
              value={currentMoisture}
              title="Kelembapan Saat Ini"
              size={250}
            />
          </div>

          <div className="soil-moisture-status-card">
            <h3 className="soil-moisture-status-title">
              Status Kelembapan
            </h3>
            <div>
              <div className="soil-moisture-status-item">
                <span className="soil-moisture-status-label">Kelembapan Saat Ini:</span>
                <span className="soil-moisture-status-value">{currentMoisture}%</span>
              </div>
              <div className="soil-moisture-status-item">
                <span className="soil-moisture-status-label">Status Kelembapan:</span>
                <span className={`soil-moisture-status-badge ${getStatusClass(currentMoisture)}`}>
                  {currentMoisture < 20 ? 'Sangat Kering' :
                   currentMoisture < 40 ? 'Kering' :
                   currentMoisture < 60 ? 'Baik' : 'lembab'}
                </span>
              </div>
              <div className="soil-moisture-status-item">
                <span className="soil-moisture-status-label">Terakhir Diperbarui:</span>
                <span className="soil-moisture-timestamp">
                  {timeString}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Graph 
          data={moistureData}
        />

        <div className="soil-moisture-info-section">
          <h3 className="soil-moisture-info-title">
            Klasifikasi Kelembapan Tanah
          </h3>
          <div className="soil-moisture-guide-grid">
            <div className="soil-moisture-guide-item">
              <div className="soil-moisture-guide-color red"></div>
              <div className="soil-moisture-guide-range red">0-19%</div>
              <div className="soil-moisture-guide-status">Sangat Kering</div>
            </div>
            <div className="soil-moisture-guide-item">
              <div className="soil-moisture-guide-color yellow"></div>
              <div className="soil-moisture-guide-range yellow">20-39%</div>
              <div className="soil-moisture-guide-status">Kering</div>
            </div>
            <div className="soil-moisture-guide-item">
              <div className="soil-moisture-guide-color green"></div>
              <div className="soil-moisture-guide-range green">40-59%</div>
              <div className="soil-moisture-guide-status">Baik</div>
            </div>
            <div className="soil-moisture-guide-item">
              <div className="soil-moisture-guide-color blue"></div>
              <div className="soil-moisture-guide-range blue">60-70%</div>
              <div className="soil-moisture-guide-status">Lembab</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
