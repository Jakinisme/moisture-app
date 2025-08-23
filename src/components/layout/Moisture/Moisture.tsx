import React, { useState, useEffect } from 'react';
import Graph from '../../ui/Graph';
import Gauge from '../../ui/Gauge';
import styles from './Moisture.module.css';

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
    if (moisture < 20) return styles.statusBadgeVeryDry;
    if (moisture < 40) return styles.statusBadgeDry;
    if (moisture < 60) return styles.statusBadgeGood;
    return styles.statusBadgeWet;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Monitor Kelembapan Tanah</h1>
          <p className={styles.subtitle}>Memantau kelembapan tanah secara real-time</p>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.gaugeContainer}>
            <Gauge 
              value={currentMoisture}
              title="Kelembapan Saat Ini"
              size={250}
            />
          </div>

          <div className={styles.statusCard}>
            <h3 className={styles.statusTitle}>
              Status Kelembapan
            </h3>
            <div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Kelembapan Saat Ini:</span>
                <span className={styles.statusValue}>{currentMoisture}%</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Status Kelembapan:</span>
                <span className={`${styles.statusBadge} ${getStatusClass(currentMoisture)}`}>
                  {currentMoisture < 20 ? 'Sangat Kering' :
                   currentMoisture < 40 ? 'Kering' :
                   currentMoisture < 60 ? 'Baik' : 'lembab'}
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Terakhir Diperbarui:</span>
                <span className={styles.timestamp}>
                  {timeString}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Graph 
          data={moistureData}
        />

        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>
            Klasifikasi Kelembapan Tanah
          </h3>
          <div className={styles.guideGrid}>
            <div className={styles.guideItem}>
              <div className={`${styles.guideColor} ${styles.guideColorRed}`}></div>
              <div className={`${styles.guideRange} ${styles.guideRangeRed}`}>0-19%</div>
              <div className={styles.guideStatus}>Sangat Kering</div>
            </div>
            <div className={styles.guideItem}>
              <div className={`${styles.guideColor} ${styles.guideColorYellow}`}></div>
              <div className={`${styles.guideRange} ${styles.guideRangeYellow}`}>20-39%</div>
              <div className={styles.guideStatus}>Kering</div>
            </div>
            <div className={styles.guideItem}>
              <div className={`${styles.guideColor} ${styles.guideColorGreen}`}></div>
              <div className={`${styles.guideRange} ${styles.guideRangeGreen}`}>40-59%</div>
              <div className={styles.guideStatus}>Baik</div>
            </div>
            <div className={styles.guideItem}>
              <div className={`${styles.guideColor} ${styles.guideColorBlue}`}></div>
              <div className={`${styles.guideRange} ${styles.guideRangeBlue}`}>60-70%</div>
              <div className={styles.guideStatus}>Lembab</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
