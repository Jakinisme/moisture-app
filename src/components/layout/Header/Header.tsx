"use client"

import styles from "./Header.module.css"
import Menu from "../../ui/Menu"

const Header = () => {
  
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h1 className={styles.title}>EcoFarmX</h1>
          <p className={styles.subtitle}>Memantau kelembapan tanah secara real-time</p>
        </div>
        <Menu />
      </div>
    </header>
  )
}

export default Header
