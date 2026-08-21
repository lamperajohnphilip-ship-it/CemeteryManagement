'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getAnnouncements } from '../../actions/announcements';

interface Announcement {
  id: number;
  title: string;
  category: string;
  badge?: string | null;
  date: string;
  content: string;
  status?: string;
  visibility?: string;
  validFrom?: string | null;
  validUntil?: string | null;
  views?: number;
}

export default function AnnouncementsPage() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async (incrementViews: boolean = false) => {
    try {
      const res = await getAnnouncements(incrementViews);
      if (res.success && res.announcements) {
        setAnnouncements(res.announcements as any);
      }
    } catch (e) {
      console.error("Error loading announcements:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements(true);

    const intervalId = setInterval(() => {
      loadAnnouncements(false);
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  const formatSchedule = (from?: string | null, until?: string | null) => {
    if (!from && !until) return null;
    const opt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    if (from && until) {
      return `${new Date(from).toLocaleDateString('en-US', opt)} – ${new Date(until).toLocaleDateString('en-US', opt)}`;
    }
    if (from) return `Starting ${new Date(from).toLocaleDateString('en-US', opt)}`;
    if (until) return `Until ${new Date(until).toLocaleDateString('en-US', opt)}`;
    return null;
  };

  const normalizeCat = (cat: string) => {
    if (!cat) return 'general';
    const c = cat.toLowerCase().trim();
    if (c.startsWith('event')) return 'event';
    if (c.startsWith('holiday')) return 'holiday';
    if (c.startsWith('notice')) return 'notice';
    if (c.startsWith('maint')) return 'maintenance';
    if (c.startsWith('emerg')) return 'emergency';
    if (c.startsWith('general') || c.startsWith('info')) return 'general';
    return c;
  };

  const getCategoryBadge = (category: string, badge?: string | null) => {
    const norm = normalizeCat(category);
    switch (norm) {
      case 'event':
        return <span className={`${styles.announcementBadge} ${styles.badgeEvent}`}>🎟️ EVENT</span>;
      case 'holiday':
        return <span className={`${styles.announcementBadge} ${styles.badgeHoliday}`}>🕯️ HOLIDAY</span>;
      case 'maintenance':
        return <span className={`${styles.announcementBadge} ${styles.badgeMaintenance}`}>🛠️ MAINTENANCE</span>;
      case 'emergency':
        return <span className={`${styles.announcementBadge} ${styles.badgeEmergency}`}>🚨 EMERGENCY</span>;
      case 'notice':
        return <span className={`${styles.announcementBadge} ${styles.badgeNotice}`}>📢 NOTICE</span>;
      default:
        return <span className={`${styles.announcementBadge} ${styles.badgeGeneral}`}>📌 {badge || 'ANNOUNCEMENT'}</span>;
    }
  };

  // Only show active public announcements
  const publicAnnouncements = announcements.filter(a => {
    const statusClean = (a.status || 'active').toLowerCase();
    return statusClean === 'active';
  });

  // Dynamic filter tabs
  const availableCategories = ['all'];
  const categoryCounts: Record<string, number> = { all: publicAnnouncements.length };

  publicAnnouncements.forEach(a => {
    const norm = normalizeCat(a.category);
    categoryCounts[norm] = (categoryCounts[norm] || 0) + 1;
    if (!availableCategories.includes(norm)) {
      availableCategories.push(norm);
    }
  });

  const filteredAnnouncements = publicAnnouncements.filter(a => {
    if (currentFilter === 'all') return true;
    return normalizeCat(a.category) === currentFilter;
  });

  const getTabLabel = (filterKey: string) => {
    switch (filterKey) {
      case 'all': return 'ALL POSTS';
      case 'event': return '🎟️ EVENTS';
      case 'notice': return '📢 NOTICES';
      case 'holiday': return '🕯️ HOLIDAYS';
      case 'maintenance': return '🛠️ MAINTENANCE';
      case 'emergency': return '🚨 EMERGENCIES';
      case 'general': return '📌 GENERAL';
      default: return filterKey.toUpperCase();
    }
  };

  return (
    <div className={styles.announcementsPage}>
      <div className={styles.annHeader}>
        <div className={styles.subhead}>MUNICIPALITY OF JASAAN · CEMETERY OFFICE</div>
        <h1>ANNOUNCEMENTS &amp; EVENTS</h1>
        <div className={styles.description}>Official notices, scheduled events &amp; updates from the cemetery administration office</div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {availableCategories.map(filter => (
          <button
            key={filter}
            className={`${styles.filterTab} ${currentFilter === filter ? styles.filterTabActive : ''}`}
            onClick={() => setCurrentFilter(filter)}
          >
            {getTabLabel(filter)} ({categoryCounts[filter] || 0})
          </button>
        ))}
      </div>

      <div className={styles.annBody}>
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.waitingIcon}>⏳</div>
            <h3>Loading Announcements…</h3>
          </div>
        ) : publicAnnouncements.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.waitingIcon}>⏳</div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              <circle cx="18" cy="5" r="2" fill="currentColor" stroke="none" opacity="0.4" />
            </svg>
            <h3>No Announcements Yet</h3>
            <p>The cemetery office hasn&apos;t posted any announcements.<br />Please check back later for updates.</p>
            <div className={styles.adminBadge}>
              <span className={styles.loadingSpinner}></span>
              <span>Waiting for admin to post announcements</span>
            </div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h3>No posts found in this category</h3>
            <p>There are currently no announcements matching this filter.<br />Please check All Posts.</p>
            <button className={styles.adminBadge} onClick={() => setCurrentFilter('all')} style={{ background: 'transparent', cursor: 'pointer' }}>
              <span>←</span> View all announcements
            </button>
          </div>
        ) : (
          filteredAnnouncements.map(ann => {
            const schedule = formatSchedule(ann.validFrom, ann.validUntil);
            return (
              <div key={ann.id} className={styles.announcementCard}>
                <div className={styles.announcementHeader}>
                  <div style={{ flex: 1 }}>
                    <h2 className={styles.announcementTitle}>{ann.title}</h2>
                    <div className={styles.announcementMeta}>
                      {getCategoryBadge(ann.category, ann.badge)}
                      <span className={styles.announcementDate}>
                        <span>📅</span> Posted: {formatDate(ann.date)}
                      </span>
                    </div>

                    {schedule && (
                      <div className={styles.scheduleBadge}>
                        <span>🗓️</span>
                        <strong>Schedule / Event Period:</strong> {schedule}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.announcementContent} dangerouslySetInnerHTML={{ __html: ann.content }}></div>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.annFooter}>
        <span>© 2026 Municipality of Jasaan · Cemetery Office</span>
        <div className={styles.footerLinks}>
          <Link href="/">Home Portal</Link>
          <Link href="/inquiries">Book Inquiry</Link>
          <Link href="/grave-mapping">Grave Map</Link>
        </div>
      </div>
    </div>
  );
}
