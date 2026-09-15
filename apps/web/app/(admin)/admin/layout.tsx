'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [adminProfile, setAdminProfile] = useState<{ name?: string; role?: string; avatar?: string } | null>(null);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // ── Server-Verified Auth Guard & Inactivity Monitor ─────
  useEffect(() => {
    let isMounted = true;
    import('../../actions/auth')
      .then(({ getAdminSessionProfile }) => getAdminSessionProfile())
      .then((prof) => {
        if (!isMounted) return;
        if (prof) {
          setAdminProfile(prof);
          setAuthChecked(true);
        } else {
          router.replace('/admin-log');
        }
      })
      .catch(() => {
        if (isMounted) router.replace('/admin-log');
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    let timeoutMinutes = 60;
    let lastActivity = Date.now();
    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      if (elapsed > timeoutMinutes * 60 * 1000) {
        handleLogout();
      }
    }, 30000);

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, updateActivity, { passive: true }));

    return () => {
      clearInterval(interval);
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
    };
  }, [authChecked]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSuperAdmin = !adminProfile?.role || adminProfile.role.toLowerCase() === 'super administrator';

  const menuItems = [
    { name: 'CEMETERY OVERVIEW', path: '/admin/cemetery-overview', icon: '⊞' },
    { name: 'DECEASED INFORMATION', path: '/admin/deceased-information', icon: '📋' },
    { name: 'INQUIRIES', path: '/admin/inquiries', icon: '📅' },
    { name: 'GRAVE MAP', path: '/admin/grave-mapping', icon: '🗺' },
    { name: 'SMS NOTIFICATIONS', path: '/admin/sms', icon: '💬' },
    { name: 'ANNOUNCEMENTS', path: '/admin/announcements', icon: '📣' },
    { name: 'PAYMENT RECORDS', path: '/admin/payment-records', icon: '💰' },
    { name: 'USER FEEDBACK', path: '/admin/reports', icon: '💭' },
    { name: 'ARCHIVE', path: '/admin/archive', icon: '📦' },
    ...(isSuperAdmin ? [{ name: 'SETTINGS', path: '/admin/settings', icon: '⚙️' }] : [])
  ];

  const handleLogout = async () => {
    localStorage.removeItem('adminProfile');
    try {
      const { logoutAdmin } = await import('../../actions/auth');
      await logoutAdmin();
    } catch (e) {}
    router.replace('/admin-log');
  };

  // Don't render children until server auth is confirmed
  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0A0800', color: '#7A7570',
        fontSize: '0.85rem', fontFamily: 'Jost, sans-serif'
      }}>
        <span style={{ opacity: 0.5 }}>Verifying session…</span>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <div className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sbLogo}>
          <div className={styles.sbSeal}>⚱</div>
          <div className={styles.sbTitle}>
            <h3>CemeteryMS</h3>
            <p>Jasaan Admin Portal</p>
          </div>
          <div className={styles.sidebarToggle} onClick={toggleSidebar}>
            {collapsed ? '▶' : '◀'}
          </div>
        </div>

        <nav className={styles.sbNav}>
          <div className={styles.navLabel}>MANAGEMENT</div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sbBottom}>
          {showLogout && (
            <div className={styles.logoutMenu}>
              <div className={styles.logoutItem} onClick={handleLogout}>
                <span>⏻</span> Sign out
              </div>
            </div>
          )}
          <div className={styles.sbProfile} onClick={() => setShowLogout(!showLogout)}>
            <div className={styles.sbAvatar}>
              {adminProfile?.name
                ? adminProfile.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'AD'}
            </div>
            <div className={styles.sbPinfo}>
              <p>{adminProfile?.name || 'Admin Jasaan'}</p>
              <span>{adminProfile?.role || 'Super Administrator'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.mainContent} ${collapsed ? styles.mainExpanded : ''}`}>
        <div className={styles.topbar}>
          <div className={styles.mobileMenuBtn} onClick={toggleMobile}>☰</div>
          <div className={styles.topbarTitle}>
            <h2>Jasaan Public Cemetery</h2>
          </div>
          <div className={styles.topbarSearch}>
            <span className={styles.searchIcon}>⌕</span>
            <input type="text" placeholder="Search grave, records..." />
          </div>
          <div className={styles.tbBtn}>🔔<span className={styles.notifPip}></span></div>
        </div>

        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}
