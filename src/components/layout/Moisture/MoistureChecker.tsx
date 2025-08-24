
import HandleMoisture from '../../../hooks/HandleMoisture';
import Graph from '../../ui/Graph';
import Gauge from '../../ui/Gauge';
import MoistureGuide from '../../../constants/MoistureGuide/Index';

import styles from './Moisture.module.css';

export const MoistureChecker: React.FC = () => {
  const { currentMoisture, moistureData, lastUpdate } = HandleMoisture();

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
          <h1 className={styles.title}>EcoFarmX</h1>
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
                  {lastUpdate}
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
          <MoistureGuide/>
        </div>
      </div>
    </div>
  );
};
