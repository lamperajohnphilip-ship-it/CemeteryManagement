'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
  getAnnouncements, 
  saveAnnouncement, 
  deleteAnnouncement, 
  toggleAnnouncementStatus
} from '../../../actions/announcements';

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  badge: string;
  visibility: string;
  status: string;
  date: string;
  validFrom: string;
  validUntil: string;
  views: number;
  reactions: { like: number; heart: number; pray: number };
  comments: any[];
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);

  // States for filter
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // States for composing/editing
  const [showCompose, setShowCompose] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formVisibility, setFormVisibility] = useState('Public (Visible to all)');
  const [formContent, setFormContent] = useState('');
  const [formValidFrom, setFormValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [formValidUntil, setFormValidUntil] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements(false);
      if (res.success && res.announcements) {
        setAnnouncements(res.announcements);
      }
    } catch (e) {
      console.error("Error loading announcements:", e);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    let result = [...announcements];

    if (filterSearch) {
      const term = filterSearch.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(term) || a.content.toLowerCase().includes(term));
    }

    if (filterStatus !== 'all') {
      result = result.filter(a => a.status === filterStatus);
    }

    if (filterDate !== 'all') {
      const days = parseInt(filterDate);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter(a => new Date(a.date) >= cutoff);
    }

    setFilteredAnnouncements(result);
  }, [announcements, filterSearch, filterStatus, filterDate]);

  const activeCount = announcements.filter(a => a.status === 'active').length;
  const archivedCount = announcements.filter(a => a.status === 'archived').length;
  const total = announcements.length;

  const totalFiltered = filteredAnnouncements.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredAnnouncements.slice(startIdx, startIdx + itemsPerPage);

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('General');
    setFormContent('');
    setFormValidFrom(new Date().toISOString().split('T')[0]);
    setFormValidUntil('');
    setEditingId(null);
  };

  const handleSave = async (status: string) => {
    if (!formTitle || !formContent) {
      alert("Title and content are required.");
      return;
    }

    const payload: any = {
      ...(editingId ? { id: editingId } : {}),
      title: formTitle,
      content: formContent,
      category: formCategory,
      badge: formCategory.toUpperCase().substring(0, 6),
      visibility: formVisibility,
      status: status,
      validFrom: formValidFrom || '',
      validUntil: formValidUntil || '',
    };

    const res = await saveAnnouncement(payload);
    if (res.success) {
      await fetchAnnouncements();
      setShowCompose(false);
      resetForm();
    } else {
      console.error('Announcement save failed:', res.error);
      alert(
        status === 'draft'
          ? 'Failed to save draft. Please try again.'
          : 'Failed to publish announcement. Please try again.'
      );
    }
  };

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setFormTitle(ann.title);
    setFormCategory(ann.category);
    setFormVisibility(ann.visibility);
    setFormContent(ann.content);
    setFormValidFrom(ann.validFrom);
    setFormValidUntil(ann.validUntil);
    setShowCompose(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStatus = async (id: number) => {
    const res = await toggleAnnouncementStatus(id);
    if (res.success) {
      await fetchAnnouncements();
    } else {
      alert("Error toggling status: " + res.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      const res = await deleteAnnouncement(id);
      if (res.success) {
        await fetchAnnouncements();
      } else {
        alert("Error deleting announcement: " + res.error);
      }
    }
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <div className={styles.pageHeader}>
        <h3>Announcements</h3>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Announcements</div>
          <div className={styles.statNumber}>{total}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statNumber}>{activeCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Archived</div>
          <div className={styles.statNumber}>{archivedCount}</div>
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.btnGroup}>
          <button className={styles.btnGold} onClick={() => { resetForm(); setShowCompose(!showCompose); }}>
            {showCompose ? 'Cancel Compose' : '+ New Announcement'}
          </button>
        </div>
      </div>

      <div className={styles.filterSection}>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Search announcements..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
        />
        <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="draft">Draft</option>
        </select>
        <select className={styles.filterSelect} value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">This year</option>
          <option value="all">All time</option>
        </select>
      </div>

      {showCompose && (
        <div className={styles.composeCard}>
          <div className={styles.composeTitle}>
            {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            <span>· All fields are required</span>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Announcement Title</label>
            <input type="text" className={styles.formInput} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select className={styles.formInput} value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                <option>General</option>
                <option>Event</option>
                <option>Holiday</option>
                <option>Maintenance</option>
                <option>Emergency</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Visibility</label>
              <input
                type="text"
                className={styles.formInput}
                value="Public"
                readOnly
                style={{ cursor: 'default', opacity: 0.7 }}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Announcement Content</label>
            <textarea className={styles.formTextarea} value={formContent} onChange={(e) => setFormContent(e.target.value)} />
            <div className={styles.charCounter}>{formContent.length} characters</div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valid From</label>
              <input type="date" className={styles.formInput} value={formValidFrom} onChange={e => setFormValidFrom(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valid Until (Optional)</label>
              <input type="date" className={styles.formInput} value={formValidUntil} onChange={e => setFormValidUntil(e.target.value)} />
            </div>
          </div>
          <div className={styles.composeActions}>
            <button className={styles.btnOutline} onClick={() => { setShowCompose(false); resetForm(); }}>Cancel</button>
            <button className={styles.btnGold} onClick={() => handleSave('active')}>Publish</button>
            <button className={styles.btnOutline} onClick={() => handleSave('draft')}>Save Draft</button>
          </div>
        </div>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h4>Recent Announcements</h4>
        </div>

        <div className={styles.announcementList}>
          {pageItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7A7570' }}>No announcements found.</div>
          ) : (
            pageItems.map(ann => (
              <div key={ann.id} className={styles.announcementItem}>
                <div className={styles.announcementHeader}>
                  <div className={styles.announcementMeta}>
                    <span className={styles.announcementBadge}>{ann.badge}</span>
                    <span className={styles.announcementTitle}>{ann.title}</span>
                  </div>
                  <div className={styles.announcementDate}>
                    {new Date(ann.date).toLocaleDateString()} · {ann.status.toUpperCase()}
                  </div>
                </div>
                <div className={styles.announcementContent}>
                  {ann.content.length > 200 ? ann.content.substring(0, 200) + '...' : ann.content}
                </div>
                <div className={styles.announcementFooter}>
                  <div className={styles.announcementStats}>
                    <span style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg> {ann.views} views
                    </span>
                  </div>
                  <div className={styles.announcementActions}>
                    <button className={styles.actionIcon} style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleEdit(ann)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.839a.5.5 0 0 1-.62-.62l.84-2.871a2 2 0 0 1 .506-.854z"/></svg> Edit
                    </button>
                    <button className={styles.actionIcon} style={{ display: 'flex', alignItems: 'center' }} onClick={() => toggleStatus(ann.id)}>
                      {ann.status === 'active' ? (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3" rx="1"/><line x1="10" x2="14" y1="12" y2="12"/></svg> Archive</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg> Activate</>
                      )}
                    </button>
                    <button className={styles.actionIcon} style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleDelete(ann.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'4px'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {totalFiltered > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + itemsPerPage, totalFiltered)} of {totalFiltered} announcements</span>
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
