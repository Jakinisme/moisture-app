import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
                <p className={styles.content}>
                    
                    &copy; {new Date().getFullYear()} ASTRAJINGGA.
                </p>
        </footer>
    )
}

export default Footer;