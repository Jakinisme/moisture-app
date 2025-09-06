import HandleMoisture from '../../../hooks/HandleMoisture';
import Graph from '../../ui/Graph';
import Gauge from '../../ui/Gauge';
import MoistureGuide from '../../../constants/MoistureGuide';
import StatusItem from '../../ui/StatusItem';

import styles from './Moisture.module.css';

 const Moisture: React.FC = () => {
  const { currentMoisture, moistureData } = HandleMoisture();  

  return (
  <div className={styles.container}>
  <div className={styles.content}>
    <div className={styles.topSection}>
      <div className={styles.gaugeContainer}>
        <Gauge 
          value={currentMoisture}
          title="Kelembapan Saat Ini"
          size={250}
        />
      </div>
      <div className={styles.statusContainer}>
        <StatusItem />
      </div>
    </div>

      <Graph data={moistureData} />

    <div className={styles.infoSection}>
      <h3 className={styles.infoTitle}>Klasifikasi Kelembapan Tanah</h3>
      <MoistureGuide />
    </div>
  </div>
</div>

  );
};

export default Moisture