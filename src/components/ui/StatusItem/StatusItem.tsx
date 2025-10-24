import HandleMoisture from '../../../hooks/HandleMoisture';
import styles from '../../layout/Moisture/Moisture.module.css';
import  useIntersectionObserver  from '../../../hooks/intersectionObserver';

const StatusItem = () => {
  const { currentMoisture, lastUpdate } = HandleMoisture();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.3,
      rootMargin: '30px'
    });


  const getStatusClass = (moisture: number) => {
    if (moisture < 30) return styles.statusBadgeVeryDry;
    if (moisture < 50) return styles.statusBadgeDry;
    if (moisture < 80) return styles.statusBadgeGood;
    return styles.statusBadgeWet;
  };

  const statusItem = [
    {
      label: `Kelembapan Saat Ini:`,
      valueClass: styles.statusValue,
      value: `${currentMoisture}%`,
    },
    {
      label: `Status Kelembapan:`,
      valueClass: `${styles.statusBadge} ${getStatusClass(currentMoisture)}`,
      value:
        currentMoisture < 30
          ? 'Sangat Kering'
          : currentMoisture < 50
          ? 'Kering'
          : currentMoisture < 80
          ? 'Baik'
          : 'Lembab',
    },
    {
      label: `Terakhir Diperbarui:`,
      valueClass: styles.timestamp,
      value: `${lastUpdate}`,
    },
  ];

  return (
    <div 
      ref={ref}
      className={styles.statusCard}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}
    >
      <h3 className={styles.statusTitle}>Status Kelembapan</h3>
      <div className={styles.statusList}>
        {statusItem.map((item, index) => (
          <div key={index} className={styles.statusItem}>
            <span className={styles.statusLabel}>{item.label}</span>
            <span className={item.valueClass}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusItem;
