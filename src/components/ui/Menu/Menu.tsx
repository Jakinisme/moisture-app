'use client'

import styles from "./Menu.module.css"
import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import  Button  from "../../ui/Button"

const Menu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const location = useLocation()
  
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
              <li className={styles.menuItem}>
                <Button
                  asLink={true}
                  to="/"
                  className={`${styles.menuLink} ${location.pathname === '/' ? styles.active : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.menuIcon}>🏠</span>
                  Dashboard
                </Button>
              </li>
              <li className={styles.menuItem}>
                <Button
                  asLink={true}
                  to="/history"
                  className={`${styles.menuLink} ${location.pathname === '/history' ? styles.active : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.menuIcon}>ℹ️</span>
                  History
                </Button>
              </li>
            </ul>
          </div>
        </div>
    )
}

export default Menu
