import styles from '../../components/layout/Moisture/Moisture.module.css';

const MoistureGuide = () => {
    const guideItem = [
    {
      item: 'Sangat Kering',
      rangeItem: '0-19%',
      color: `${styles.guideColor} ${styles.guideColorRed}`,
      range: `${styles.guideRange} ${styles.guideRangeRed}`,
      status: styles.guideStatus
    },
    {
      item: 'Kering',
      rangeItem: '20-39%',
      color: `${styles.guideColor} ${styles.guideColorYellow}`,
      range: `${styles.guideRange} ${styles.guideRangeYellow}`,
      status: styles.guideStatus
    },
    {
      item: 'Baik',
      rangeItem: '40-59%',
      color: `${styles.guideColor} ${styles.guideColorGreen}`,
      range: `${styles.guideRange} ${styles.guideRangeGreen}`,
      status: styles.guideStatus
    },
    {
      item: 'Lembab',
      rangeItem: '60-70',
      color: `${styles.guideColor} ${styles.guideColorBlue}`,
      range: `${styles.guideRange} ${styles.guideRangeBlue}`,
      status: styles.guideStatus
    }
  ]

  return (
        <div className={styles.guideGrid}>
            {guideItem.map((item, index) => (
              <div key={index} className={styles.guideItem}>
                <div className={item.color}></div>
                <div className={item.range}>{item.rangeItem}</div>
                <div className={styles.guideStatus}>{item.item}</div>
              </div>
            ))}
        </div>
  )
}

export default MoistureGuide