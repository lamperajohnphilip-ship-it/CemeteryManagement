'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isMobileApp, setIsMobileApp] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Load and set theme from localStorage on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('adminTheme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('adminTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Detect if running inside the mobile app webview
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator?.userAgent?.includes('CemeteryManagementMobile')) {
      setIsMobileApp(true);
    }
  }, []);

  const navItems = [
    {
      name: 'DASHBOARD', path: '/dashboard', icon: (
        <svg className={styles.navItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
        </svg>
      )
    },
    {
      name: 'INQUIRIES', path: '/inquiries', icon: (
        <svg className={styles.navItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      name: 'GRAVE MAPPING', path: '/grave-mapping', icon: (
        <svg className={styles.navItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="18"></line>
        </svg>
      )
    },
    {
      name: 'ANNOUNCEMENTS', path: '/announcements', icon: (
        <svg className={styles.navItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    },
    {
      name: 'ABOUT US', path: '/about-us', icon: (
        <svg className={styles.navItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <circle cx="12" cy="8" r="1" fill="currentColor"></circle>
        </svg>
      )
    },
    {
      name: 'ADMIN LOG', path: '/admin-log', icon: (
        <svg className={styles.navItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
          <path d="M6 20v-1a6 6 0 0 1 12 0v1"></path>
        </svg>
      )
    }
  ];

  if (pathname.startsWith('/admin') || isMobileApp) {
    return null;
  }

  return (
    <>
      <nav className={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button
            className={`${styles.menuBtn} ${isOpen ? styles.menuBtnOpen : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <span></span><span></span><span></span>
          </button>
          <div className={styles.navLogo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            ETERNAL REST
          </div>
        </div>
      </nav>

      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.sidebarOverlayShow : ''}`}
        onClick={closeSidebar}
      />

      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarBrand}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            ETERNAL REST
          </div>
          <div className={styles.sidebarTagline}>Municipality of Jasaan · Cemetery Portal</div>
        </div>
        <div className={styles.sidebarBody}>
          {navItems
            .filter((item) => !(isMobileApp && item.path === '/admin-log'))
            .map((item) => (
              <Link
                href={item.path}
                key={item.name}
                className={`${styles.sidebarNavItem} ${pathname === item.path ? styles.sidebarNavItemActive : ''}`}
                onClick={closeSidebar}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
        </div>
        <div className={styles.sidebarFooter}>
          <div className={styles.themeToggleLabel}>THEME</div>
          <div className={styles.themeToggleRow}>
            <button
              className={`${styles.themeToggleBtn} ${theme === 'dark' ? styles.themeToggleBtnActive : ''}`}
              onClick={() => handleThemeChange('dark')}
              type="button"
            >
              <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              DARK
            </button>
            <button
              className={`${styles.themeToggleBtn} ${theme === 'light' ? styles.themeToggleBtnActive : ''}`}
              onClick={() => handleThemeChange('light')}
              type="button"
            >
              <svg className={styles.toggleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              LIGHT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
