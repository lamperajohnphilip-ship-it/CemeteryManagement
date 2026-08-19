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
}

export default function AnnouncementsPage() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadAnnouncements = async (incrementViews: boolean = false) => {
    try {
      const res = await getAnnouncements(incrementViews);
      if (res.success && res.announcements) {
        setAnnouncements(res.announcements as any);
      }
    } catch (e) {
      console.error("Error loading announcements:", e);
    }
  };

  useEffect(() => {
    loadAnnouncements(true); // Increment views only on initial load

    const intervalId = setInterval(() => {
      loadAnnouncements(false);
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  const filteredAnnouncements = announcements.filter(a => {
    const isPublic = (a as any).status === 'active' && (a as any).visibility === 'Public (Visible to all)';
    if (!isPublic) return false;
    return currentFilter === 'all' || a.category === currentFilter;
  });

  return (
    <div className={styles.announcementsPage}>
      <div className={styles.annHeader}>
        <div className={styles.subhead}>MUNICIPALITY OF JASAAN · CEMETERY OFFICE</div>
        <h1>ANNOUNCEMENTS</h1>
        <div className={styles.description}>Official notices, events &amp; updates from the cemetery office</div>
      </div>

      <div className={styles.filterTabs}>
        {['all', 'notices', 'events', 'alerts', 'info'].map(filter => (
          <button
            key={filter}
            className={`${styles.filterTab} ${currentFilter === filter ? styles.filterTabActive : ''}`}
            onClick={() => setCurrentFilter(filter)}
          >
            {filter === 'all' ? 'ALL POSTS' : filter.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.annBody}>
        {announcements.length === 0 ? (
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
            <h3>No posts found</h3>
            <p>There are currently no {currentFilter} from the cemetery office.<br />Please check back later.</p>
            <button className={styles.adminBadge} onClick={() => setCurrentFilter('all')} style={{ background: 'transparent' }}>
              <span>←</span> View all announcements
            </button>
          </div>
        ) : (
          filteredAnnouncements.map(ann => (
            <div key={ann.id} className={styles.announcementCard}>
              <div className={styles.announcementHeader}>
                <div>
                  <h2 className={styles.announcementTitle}>{ann.title}</h2>
                  <div className={styles.announcementMeta}>
                    <span className={styles.announcementBadge}>{ann.badge || ann.category.toUpperCase()}</span>
                    <span className={styles.announcementDate}>
                      <span>📅</span> {formatDate(ann.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.announcementContent} dangerouslySetInnerHTML={{ __html: ann.content }}></div>
            </div>
          ))
        )}
      </div>

      <div className={styles.annFooter}>
        <span>© 2025 Municipality of Jasaan · Cemetery Office</span>
        <div className={styles.footerLinks}>
          <Link href="/">Contact</Link>
          <Link href="/">FAQs</Link>
          <Link href="/">About</Link>
        </div>
      </div>

    </div>
  );
}
