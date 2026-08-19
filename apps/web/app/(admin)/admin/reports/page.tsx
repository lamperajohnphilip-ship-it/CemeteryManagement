'use client';

import { useState, useEffect } from 'react';
import styles from '../cemetery-overview/page.module.css';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  date: string;
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  useEffect(() => {
    loadFeedback();
    
    // Auto-update if local storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cemeteryFeedback' || e.key === 'user_feedback') {
        loadFeedback();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadFeedback = async () => {
    // Try to get from API first
    let serverFeedback: Feedback[] = [];
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success && Array.isArray(data.feedback)) {
        serverFeedback = data.feedback;
      }
    } catch (e) {
      console.error('Failed to load feedback from server API:', e);
    }

    // Try to get from cemeteryFeedback, fallback to user_feedback
    const adminData = localStorage.getItem('cemeteryFeedback');
    const userData = localStorage.getItem('user_feedback');
    
    let localFeedback: Feedback[] = [];
    if (adminData) {
      localFeedback = JSON.parse(adminData);
    } else if (userData) {
      localFeedback = JSON.parse(userData);
    }

    // Merge: server feedback is primary. Local feedbacks not on server are appended.
    const mergedMap = new Map<number, Feedback>();
    
    // Add local items
    localFeedback.forEach(item => {
      if (item && item.id) mergedMap.set(item.id, item);
    });
    
    // Add server items (they override local)
    serverFeedback.forEach(item => {
      if (item && item.id) mergedMap.set(item.id, item);
    });

    const parsed = Array.from(mergedMap.values());
    
    // Sort by newest first
    parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFeedbackList(parsed);
  };

  const avgRating = feedbackList.length > 0 
    ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
    : '0.0';

  const fiveStar = feedbackList.filter(f => f.rating === 5).length;
  const fourStar = feedbackList.filter(f => f.rating === 4).length;

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      const updated = feedbackList.filter(f => f.id !== id);
      setFeedbackList(updated);
      localStorage.setItem('cemeteryFeedback', JSON.stringify(updated));
      localStorage.setItem('user_feedback', JSON.stringify(updated));

      try {
        await fetch(`/api/feedback?id=${id}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.error('Failed to delete feedback on server:', e);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? '#E2C97E' : 'none'} stroke={i < rating ? '#E2C97E' : '#7A7570'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '2px'}}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ));
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <div className={styles.secHeader} style={{ marginTop: '40px' }}>
        <div className={styles.secHeaderText}>
          <h3>User Feedback</h3>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Reviews</div>
          <div className={styles.statNumber}>{feedbackList.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Average Rating</div>
          <div className={styles.statNumber} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#E2C97E" stroke="#E2C97E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {avgRating}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Positive Sentiments (4-5 Star)</div>
          <div className={styles.statNumber}>{fiveStar + fourStar}</div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h4>Recent Ratings & Comments</h4>
            <p>Showing {feedbackList.length} feedback records</p>
          </div>
        </div>
        
        <div className={styles.tblWrap}>
          {feedbackList.length === 0 ? (
            <div className={styles.emptyMessage}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" style={{ marginBottom: '10px' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>No feedback received yet.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} style={{ width: '15%' }}>DATE</th>
                  <th className={styles.th} style={{ width: '20%' }}>RATING</th>
                  <th className={styles.th} style={{ width: '55%' }}>COMMENT</th>
                  <th className={styles.th} style={{ width: '10%', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map(feedback => (
                  <tr key={feedback.id} className={styles.tr}>
                    <td className={styles.td}>
                      {new Date(feedback.date).toLocaleDateString()}
                    </td>
                    <td className={styles.td}>
                      <div style={{ display: 'flex' }}>
                        {renderStars(feedback.rating)}
                      </div>
                    </td>
                    <td className={styles.td}>
                      {feedback.comment ? (
                        <div style={{ lineHeight: '1.4' }}>{feedback.comment}</div>
                      ) : (
                        <span style={{ color: '#7A7570', fontStyle: 'italic' }}>No comment provided</span>
                      )}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDelete(feedback.id)}
                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete Feedback"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
