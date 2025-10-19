import styles from './MoistureGuide.module.css';
import  useIntersectionObserver  from '../../hooks/intersectionObserver';

const MoistureGuide = () => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.4,
      rootMargin: '50px'
    });
    
    const guideItem = [
    {
      item: 'Sangat Kering',
      rangeItem: '0-29%',
      color: `${styles.guideColor} ${styles.guideColorRed}`,
      range: `${styles.guideRange} ${styles.guideRangeRed}`,
      status: styles.guideStatus
    },
    {
      item: 'Kering',
      rangeItem: '30-49%',
      color: `${styles.guideColor} ${styles.guideColorYellow}`,
      range: `${styles.guideRange} ${styles.guideRangeYellow}`,
      status: styles.guideStatus
    },
    {
      item: 'Baik',
      rangeItem: '50-79%',
      color: `${styles.guideColor} ${styles.guideColorGreen}`,
      range: `${styles.guideRange} ${styles.guideRangeGreen}`,
      status: styles.guideStatus
    },
    {
      item: 'Lembab',
      rangeItem: '80-100',
      color: `${styles.guideColor} ${styles.guideColorBlue}`,
      range: `${styles.guideRange} ${styles.guideRangeBlue}`,
      status: styles.guideStatus
    }
  ]

  return (
        <div
          ref={ref}
          className={styles.guideGrid}
          style={{
            opacity: isIntersecting ? 1 : 0,
            transform: isIntersecting ? 'translateX(0)' : 'translateX(-50px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}>
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