import { useState, useMemo, useCallback, useEffect } from 'react';
import Button from '../../ui/Button';
import HandleHistory from '../../../hooks/HandleHistory';

import type { FilterPeriod, DailyMoistureData, WeeklyMoistureData } from '../../../types/moisture';

import useIntersectionObserver from '../../../hooks/intersectionObserver';

import styles from './History.module.css';

const History = () => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('day');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { dailyData, loading, errors } = HandleHistory(filterPeriod, selectedMonth, selectedYear);

  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
      threshold: 0.4,
      rootMargin: '50px'
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const selectButton = [
    { key: 'day', label: 'Harian' },
    { key: 'week', label: 'Mingguan' },
    { key: 'month', label: 'Bulanan' }
  ]

  const months = useMemo(
    () => [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ],
    []
  );

  const processWeeklyData = useCallback((dailyData: DailyMoistureData[]): WeeklyMoistureData[] => {
    if (dailyData.length === 0) return [];

    const sortedData = dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const weeklyData: WeeklyMoistureData[] = [];
    const daysPerWeek = 7;
    
    // Hitung jumlah minggu berdasarkan jumlah hari
    const totalWeeks = Math.ceil(sortedData.length / daysPerWeek);
    
    for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
      const startIndex = weekIndex * daysPerWeek;
      const endIndex = Math.min(startIndex + daysPerWeek, sortedData.length);
      const weekDays = sortedData.slice(startIndex, endIndex);
      
      if (weekDays.length === 0) continue;
      
      const allReadings = weekDays.flatMap(day => day.readings);
      const moistureValues = allReadings.map(r => r.moisture);
      const averageMoisture = moistureValues.reduce((sum, val) => sum + val, 0) / moistureValues.length;
      const minMoisture = Math.min(...moistureValues);
      const maxMoisture = Math.max(...moistureValues);
      
      const startDate = new Date(weekDays[0].date);
      const endDate = new Date(weekDays[weekDays.length - 1].date);
      
      const startDay = startDate.getDate();
      const endDay = endDate.getDate();
      const monthName = months[selectedMonth - 1];
      const weekNumber = weekIndex + 1;

      weeklyData.push({
        date: `Minggu ${weekNumber} (${startDay}-${endDay} ${monthName})`,
        averageMoisture: Math.round(averageMoisture * 100) / 100,
        minMoisture: Math.round(minMoisture * 100) / 100,
        maxMoisture: Math.round(maxMoisture * 100) / 100,
        readings: allReadings.sort((a, b) => a.timestamp - b.timestamp),
        weekNumber
      });
    }
    
    return weeklyData;
  }, [selectedMonth, months]);

  const processMonthlyData = useCallback((dailyData: DailyMoistureData[]): DailyMoistureData[] => {
    if (dailyData.length === 0) return [];

    const allReadings = dailyData.flatMap(day => day.readings);
    const moistureValues = allReadings.map(r => r.moisture);
    const averageMoisture = moistureValues.reduce((sum, val) => sum + val, 0) / moistureValues.length;
    const minMoisture = Math.min(...moistureValues);
    const maxMoisture = Math.max(...moistureValues);

    const monthName = months[selectedMonth - 1];
    const year = selectedYear;

    return [{
      date: `${monthName} ${year}`,
      averageMoisture: Math.round(averageMoisture * 100) / 100,
      minMoisture: Math.round(minMoisture * 100) / 100,
      maxMoisture: Math.round(maxMoisture * 100) / 100,
      readings: allReadings.sort((a, b) => a.timestamp - b.timestamp)
    }];
  }, [selectedMonth, selectedYear, months]);

  const filteredData = useMemo((): (DailyMoistureData | WeeklyMoistureData)[] => {
    // Filter data berdasarkan bulan dan tahun yang dipilih
    const dataFilteredByMonthYear = dailyData.filter(item => {
      const itemDate = new Date(item.date);
      const itemMonth = itemDate.getMonth() + 1;
      const itemYear = itemDate.getFullYear();
      return itemMonth === selectedMonth && itemYear === selectedYear;
    });

    switch (filterPeriod) {
      case 'day':
        return dataFilteredByMonthYear;
      
      case 'week': {
        return processWeeklyData(dataFilteredByMonthYear);
      }
      
      case 'month': {
        return processMonthlyData(dataFilteredByMonthYear);
      }
      
      default:
        return dataFilteredByMonthYear;
    }
  }, [dailyData, filterPeriod, selectedMonth, selectedYear, processWeeklyData, processMonthlyData]);

  const availableMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();
    dailyData.forEach(item => {
      const date = new Date(item.date);
      yearSet.add(date.getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [dailyData]);

  useEffect(() => {
    if (availableYears.length && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  return (
    <main>
    <div className={styles.historyContainer}>
      <div 
      className={styles.filterSection}
      ref={ref}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateX(0)' : 'translateX(-50px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
      }}
      >
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Periode:</span>
          <div className={styles.buttonGroup}>
            {selectButton.map(({ key, label }) => (
              <Button
                key={key}
                className={`${styles.filterButton} ${filterPeriod === key ? styles.active : ''}`}
                onClick={() => setFilterPeriod(key as FilterPeriod)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Bulan:</label>
          <select
            className={styles.select}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {availableMonths.map((monthNumber) => (
              <option key={monthNumber} value={monthNumber}>
                {months[monthNumber - 1]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Tahun:</span>
          <select
            className={styles.select}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
       className={styles.dataSection}
       ref={ref}
       style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateX(0)' : 'translateX(-50px)',
        transition: 'opacity 0.8s ease-out, transform 0.4s ease-out'
      }}
       >
        {loading ? (
          <div className={styles.loading}>
            <p>Memuat data kelembapan...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className={styles.noData}>
            <p>Tidak ada data kelembapan untuk periode yang dipilih.</p>
          </div>
        ) : (
          <>
            <div className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>
                {filterPeriod === 'day' && `Data Harian - ${months[selectedMonth - 1]} ${selectedYear}`}
                {filterPeriod === 'week' && `Data Mingguan - ${months[selectedMonth - 1]} ${selectedYear}`}
                {filterPeriod === 'month' && `Data Bulanan - ${months[selectedMonth - 1]} ${selectedYear}`}
              </h3>
              <p className={styles.summarySubtitle}>
                {filterPeriod === 'day' && `Menampilkan ${filteredData.length} hari dengan rata-rata kelembapan per hari`}
                {filterPeriod === 'week' && `Menampilkan ${filteredData.length} minggu dengan rata-rata kelembapan`}
                {filterPeriod === 'month' && `Menampilkan rata-rata kelembapan untuk satu bulan`}
              </p>
              {errors.length > 0 && (
                <div className={styles.errorSection}>
                  <h4>Error yang ditemukan:</h4>
                  {errors.map((error, index) => (
                    <div key={index} className={styles.errorItem}>
                      <strong>{error.date}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.historyList}>
              {filteredData.map((item) => {
                const moistureStatus = item.status || { 
                  status: item.averageMoisture < 30 ? 'Sangat Kering' : 
                         item.averageMoisture < 50 ? 'Kering' : 
                         item.averageMoisture < 80 ? 'Baik' : 'Lembab',
                  color: item.averageMoisture < 30 ? '#ef4444' : 
                         item.averageMoisture < 50 ? '#f97316' : 
                         item.averageMoisture < 80 ? '#22c55e' : '#3b82f6'
                };
                
                return (
                  <div key={item.date} className={styles.historyItem}>
                    <div className={styles.dateInfo}>
                      <h3 className={styles.dateTitle}>{'weekNumber' in item ? item.date : formatDate(item.date)}</h3>
                      <div className={styles.moistureStats}>
                        {[
                          { label: 'Rata-rata', value: item.averageMoisture },
                          { label: 'Min', value: item.minMoisture },
                          { label: 'Max', value: item.maxMoisture }
                        ].map(({ label, value }) => (
                          <div key={label + value} className={styles.statItem}>
                            <span className={styles.statLabel}>{label}:</span>
                            <span className={styles.statValue}>{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.statusInfo}>
                      <div 
                        className={styles.statusBadge}
                        style={{ backgroundColor: moistureStatus.color }}
                      >
                        {moistureStatus.status}
                      </div>
                      <div className={styles.readingCount}>
                        {filterPeriod === 'week' && 'weekNumber' in item && `Minggu ${item.weekNumber}`}
                        {filterPeriod === 'month' && `${item.readings.length} pembacaan`}
                        {filterPeriod === 'day' && `${item.readings.length} pembacaan`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
    </main>
  );
};

export default History;