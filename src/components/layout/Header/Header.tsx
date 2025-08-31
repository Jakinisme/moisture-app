"use client"

import styles from "./Header.module.css"
import { useState, useRef, useEffect } from "react"
import  Button  from "../../ui/Button"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h1 className={styles.title}>EcoFarmX</h1>
          <p className={styles.subtitle}>Memantau kelembapan tanah secara real-time</p>
        </div>

        <div className={styles.menuContainer} ref={menuRef}>
          <Button
            onClick={handleMenuToggle}
            className={`${styles.menuButton} ${isMenuOpen ? styles.active : ""}`}
            variant="secondary"
          >
            <span className={styles.menuIcon}>
              <span className={`${styles.iconLine} ${isMenuOpen ? styles.iconLineActive : ""}`}></span>
              <span className={`${styles.iconLine} ${isMenuOpen ? styles.iconLineActive : ""}`}></span>
              <span className={`${styles.iconLine} ${isMenuOpen ? styles.iconLineActive : ""}`}></span>
            </span>
            Menu
          </Button>

          <div className={`${styles.menu} ${isMenuOpen ? styles.open : ""}`}>
            <div className={styles.menuArrow}></div>
            <ul className={styles.menuList}>
              <li className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                <span className={styles.menuIcon}>🏠</span>
                Dashboard
              </li>
              <li className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                <span className={styles.menuIcon}>ℹ️</span>
                History
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
