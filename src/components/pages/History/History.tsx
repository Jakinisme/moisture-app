import { useState, useMemo, useEffect, useCallback } from 'react';
import Button from '../../ui/Button';
import HandleHistory from '../../../hooks/HandleHistory';
import type { FilterPeriod, DailyMoistureData, WeeklyMoistureData } from '../../../types/moisture';
import styles from './History.module.css';

const History = () => {
  const { dailyData, loading } = HandleHistory();
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('day');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 20) return { status: ' Sangat Kering', color: '#ef4444' };
    if (moisture < 40) return { status: 'Kering', color: '#f97316' };
    if (moisture < 60) return { status: 'Baik', color: '#22c55e' };
    return { status: 'Lembab', color: '#3b82f6' };
  };

  const processWeeklyData = useCallback((dailyData: DailyMoistureData[]): WeeklyMoistureData[] => {
    const weeklyMap = new Map<number, DailyMoistureData[]>();
    
    dailyData.forEach(day => {
      const date = new Date(day.date);
      const weekNumber = Math.ceil(date.getDate() / 7);
      
      if (!weeklyMap.has(weekNumber)) {
        weeklyMap.set(weekNumber, []);
      }
      weeklyMap.get(weekNumber)!.push(day);
    });

    return Array.from(weeklyMap.entries()).map(([weekNumber, days]) => {
      const allReadings = days.flatMap(day => day.readings);
      const moistureValues = allReadings.map(r => r.moisture);
      const averageMoisture = moistureValues.reduce((sum, val) => sum + val, 0) / moistureValues.length;
      const minMoisture = Math.min(...moistureValues);
      const maxMoisture = Math.max(...moistureValues);

      return {
        date: `Minggu ${weekNumber}`,
        averageMoisture: Math.round(averageMoisture * 100) / 100,
        minMoisture: Math.round(minMoisture * 100) / 100,
        maxMoisture: Math.round(maxMoisture * 100) / 100,
        readings: allReadings.sort((a, b) => a.timestamp - b.timestamp),
        weekNumber
      };
    }).sort((a, b) => a.weekNumber - b.weekNumber);
  }, []);

    const months = useMemo(
  () => [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
  []
);

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
    const monthYearData = dailyData.filter(item => {
      const itemDate = new Date(item.date);
      const itemMonth = itemDate.getMonth() + 1;
      const itemYear = itemDate.getFullYear();
      return itemMonth === selectedMonth && itemYear === selectedYear;
    });

    switch (filterPeriod) {
      case 'day':
        return monthYearData;
      
      case 'week':
        return processWeeklyData(monthYearData);
      
      case 'month':
        return processMonthlyData(monthYearData)
      
      default:
        return monthYearData;
    }
  }, [dailyData, filterPeriod, selectedMonth, selectedYear, processWeeklyData, processMonthlyData]);

  const availableMonths = useMemo(() => {
    const monthSet = new Set<number>();
    dailyData.forEach(item => {
      const date = new Date(item.date);
      monthSet.add(date.getMonth() + 1);
    });
    return Array.from(monthSet).sort((a, b) => a - b);
  }, [dailyData]);

  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();
    dailyData.forEach(item => {
      const date = new Date(item.date);
      yearSet.add(date.getFullYear());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [dailyData]);


  useEffect(() => {
    if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths.at(-1)!);
    }
    if (availableYears.length && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableMonths, availableYears, selectedMonth, selectedYear]);

  return (
    <div className={styles.historyContainer}>
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Periode:</label>
          <div className={styles.buttonGroup}>
            {[
              { key: 'day', label: 'Harian' },
              { key: 'week', label: 'Mingguan' },
              { key: 'month', label: 'Bulanan' }
            ].map(({ key, label }) => (
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
          <label className={styles.filterLabel}>Tahun:</label>
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

      <div className={styles.dataSection}>
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
                {filterPeriod === 'day' && `Menampilkan ${filteredData.length} hari dengan data kelembapan`}
                {filterPeriod === 'week' && `Menampilkan ${filteredData.length} minggu dengan rata-rata kelembapan`}
                {filterPeriod === 'month' && `Menampilkan rata-rata kelembapan untuk satu bulan`}
              </p>
            </div>
          <div className={styles.historyList}>
            {filteredData.map((item) => {
              const moistureStatus = getMoistureStatus(item.averageMoisture);
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
                        <div key={label} className={styles.statItem}>
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
                      {item.readings.length} pembacaan
                      {filterPeriod === 'week' && 'weekNumber' in item && ` (Minggu ${item.weekNumber})`}
                    </div>
                  </div>

                  <div className={styles.readingsDetail}>
                    <h4 className={styles.readingsTitle}>Pembacaan Detail:</h4>
                    <div className={styles.readingsList}>
                      {item.readings.map((reading, index) => (
                        <div key={`${reading.timestamp}-${index}`} className={styles.readingItem}>
                          <span className={styles.readingTime}>
                            {new Date(reading.timestamp).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className={styles.readingValue}>
                            {reading.moisture}%
                          </span>
                        </div>
                      ))}
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
  );
};

export default History;