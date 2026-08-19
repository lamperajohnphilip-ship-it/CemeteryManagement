'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getDeceasedRecords } from '../../actions/deceased';
import styles from './page.module.css';

// Utility functions
const calculateAge = (birthDate: string, deathDate: string) => {
  if (!birthDate || !deathDate) return '-';
  try {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    if (isNaN(birth.getTime()) || isNaN(death.getTime())) return '-';

    let age = death.getFullYear() - birth.getFullYear();
    const m = death.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return '-';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

const getGender = (record: any) => record.gender || record.sex || '-';
const getAge = (record: any) => record.age || calculateAge(record.birthDate || record.birthdate, record.deathDate || record.dateOfDeath);
const getBirthDate = (record: any) => record.birthDate || record.birthdate || record.dateOfBirth || '-';
const getDeathDate = (record: any) => record.deathDate || record.dateOfDeath || record.datePaid || '-';
const getCivilStatus = (record: any) => record.civilStatus || record.maritalStatus || record.status || '-';
const getNationality = (record: any) => record.nationality || record.citizenship || 'Filipino';
const getAddress = (record: any) => record.address || record.residence || '-';
const getPayor = (record: any) => record.payor || record.payer || record.payorName || '-';
const getContact = (record: any) => record.contact || record.phone || record.mobile || record.contactNo || '-';

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deceasedRecords, setDeceasedRecords] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  
  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const res = await getDeceasedRecords();
        if (res.success && res.records) {
          const dbRecords = res.records.map((r: any) => ({
            id: r.id,
            ref: r.REF_NO,
            payor: r.PAYORS_NAME,
            contact: r.CONTACT_NO,
            deceased: r.NAME_OF_DECEASED,
            address: r.ADDRESS,
            birthDate: r.DATE_OF_BIRTH ? (new Date(r.DATE_OF_BIRTH).toISOString().split('T')[0] || '') : '',
            deathDate: r.DATE_OF_DEATH ? (new Date(r.DATE_OF_DEATH).toISOString().split('T')[0] || '') : '',
            yearPaid: r.YEAR.toString(),
            totalAmount: r.TOTAL_DUE,
            amountPaid: r.PAID,
            balance: r.BALANCE,
            paymentStatus: (r.STATUS || 'pending').toLowerCase(),
            remarks: r.REMARKS || '',
            gender: 'Male',
            civilStatus: 'Single',
            nationality: 'Filipino'
          }));

          const saved = localStorage.getItem('cemeteryInventory');
          let localRecs: any[] = [];
          if (saved) {
            try {
              localRecs = JSON.parse(saved);
            } catch (e) {}
          }

          const dbNames = new Set(dbRecords.map((r: any) => r.deceased.toLowerCase()));
          const legacyRecs = localRecs.filter(r => !dbNames.has((r.deceased || '').toLowerCase()));

          setDeceasedRecords([...dbRecords, ...legacyRecs]);
          return;
        }
      } catch (e) {
        console.error('Error loading records from DB:', e);
      }

      // Fallback to local storage if DB fetch fails
      const saved = localStorage.getItem('cemeteryInventory');
      if (saved) {
        try {
          setDeceasedRecords(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading records from local storage:', e);
        }
      }
    };

    loadRecords();

    // Close results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResults(false);
        setSelectedProfile(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    // Auto "Rate Us" logic
    let timer: NodeJS.Timeout;
    const hasRated = localStorage.getItem('hasRated');
    if (!hasRated) {
      timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 10000); // Popup after 10 seconds
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const performSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setShowResults(false);
      return;
    }

    const lowerTerm = term.toLowerCase().trim();
    const results = deceasedRecords.filter(record => {
      const deceasedName = (record.deceased || record.name || record.fullName || '').toLowerCase();
      const payorName = (record.payor || record.payer || '').toLowerCase();
      const ref = (record.ref || record.reference || record.id || '').toLowerCase();

      return deceasedName.includes(lowerTerm) ||
        payorName.includes(lowerTerm) ||
        ref.includes(lowerTerm);
    });

    setSearchResults(results);
    setShowResults(true);
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i} className={styles.searchHighlight} style={{ background: 'var(--gold-border)', color: 'var(--cream)', padding: '0 2px', borderRadius: '3px' }}>{part}</mark> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const nameFunc = (record: any) => record.deceased || record.name || record.fullName || 'Unknown';

  const viewProfile = (record: any) => {
    setSelectedProfile(record);
    setShowResults(false);
  };

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }
    const userId = 'User_' + Math.floor(Math.random() * 10000);
    const newFeedback = {
      id: Date.now(),
      user_id: userId,
      rating,
      comment: ratingComment,
      date: new Date().toISOString()
    };

    // Save locally
    const feedbackList = JSON.parse(localStorage.getItem('user_feedback') || '[]');
    feedbackList.push(newFeedback);
    localStorage.setItem('user_feedback', JSON.stringify(feedbackList));
    localStorage.setItem('hasRated', 'true');
    setShowRatingModal(false);
    
    const adminFeedback = JSON.parse(localStorage.getItem('cemeteryFeedback') || '[]');
    adminFeedback.push(newFeedback);
    localStorage.setItem('cemeteryFeedback', JSON.stringify(adminFeedback));
    
    // Sync to backend
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          rating,
          comment: ratingComment
        })
      });
    } catch (err) {
      console.error('Failed to sync feedback to backend API:', err);
    }

    alert('Thank you for your valuable feedback!');
  };

  return (
    <main>
      {selectedProfile && (
        <div className={styles.profileModal}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                {getGender(selectedProfile).toLowerCase() === 'male' ? '👨' :
                  getGender(selectedProfile).toLowerCase() === 'female' ? '👩' : '⚰️'}
              </div>
              <div className={styles.profileName}>{nameFunc(selectedProfile)}</div>
              <div className={styles.profileRef}>{selectedProfile.ref || selectedProfile.reference || selectedProfile.id || 'REF-000000'}</div>
              <div className={styles.profileClose} onClick={() => setSelectedProfile(null)}>&times;</div>
            </div>

            <div className={styles.profileBody}>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', fontStyle: 'italic' }}>
                Rest in Peace
              </p>

              <div className={styles.profileDetailRow}>
                <div className={styles.profileDetailLabel}>Born</div>
                <div className={styles.profileDetailValue}>{formatDate(getBirthDate(selectedProfile))}</div>
              </div>
              <div className={styles.profileDetailRow}>
                <div className={styles.profileDetailLabel}>Died</div>
                <div className={styles.profileDetailValue}>{formatDate(getDeathDate(selectedProfile))}</div>
              </div>
              <div className={styles.profileDetailRow}>
                <div className={styles.profileDetailLabel}>Block / Lot</div>
                <div className={styles.profileDetailValue} style={{ color: 'var(--gold)' }}>{selectedProfile.remarks || 'Standard Map Grid'}</div>
              </div>

              <div className={styles.profileActions} style={{ marginTop: '32px' }}>
                <button className={`${styles.profileBtn} ${styles.profileBtnSecondary}`} onClick={() => setSelectedProfile(null)}>Close</button>
                <button
                  className={`${styles.profileBtn} ${styles.profileBtnPrimary}`}
                  onClick={() => {
                    sessionStorage.setItem(
                      'locateGrave',
                      JSON.stringify({
                        name: nameFunc(selectedProfile),
                        plot: selectedProfile.remarks || 'A-1',
                        section: (selectedProfile.remarks && selectedProfile.remarks.charAt(0).toUpperCase()) || 'A',
                        born: getBirthDate(selectedProfile),
                        died: getDeathDate(selectedProfile),
                        age: getAge(selectedProfile),
                        cause: selectedProfile.cause || 'Natural Causes',
                        religion: selectedProfile.religion || 'Christian',
                        nationality: getNationality(selectedProfile),
                        kin: getPayor(selectedProfile),
                        contact: getContact(selectedProfile)
                      })
                    );
                    router.push('/grave-mapping');
                  }}
                >
                  Locate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && (
        <div className={styles.profileModal}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <h2 style={{ fontFamily: 'Cinzel', color: 'var(--stone)', margin: 0, fontSize: '1.4rem' }}>Enjoying the Portal?</h2>
              <div className={styles.profileClose} onClick={() => { setShowRatingModal(false); localStorage.setItem('hasRated', 'true'); }}>&times;</div>
            </div>
            <div className={styles.profileBody} style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Please take a moment to rate your experience.</p>
              
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`${styles.star} ${rating >= star || hoverRating >= star ? styles.starFilled : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <svg viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>

              <textarea
                className={styles.ratingComment}
                placeholder="Tell us what you think (optional)"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
              />

              <div className={styles.profileActions}>
                <button className={`${styles.profileBtn} ${styles.profileBtnSecondary}`} onClick={() => { setShowRatingModal(false); localStorage.setItem('hasRated', 'true'); }}>Maybe Later</button>
                <button className={`${styles.profileBtn} ${styles.profileBtnPrimary}`} onClick={handleRatingSubmit}>Submit Feedback</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className={styles.hero} id="home">
        <div className={styles.topLine}></div>
        <div className={styles.heroEyebrow}>MUNICIPALITY OF JASAAN — CEMETERY MANAGEMENT</div>
        <h1 className={styles.heroTitle}>ETERNAL <span className={styles.heroTitleGold}>REST</span><br />CEMETERY PORTAL</h1>

        <div className={styles.searchHero} ref={searchContainerRef}>
          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by name, lastname, plot number......"
                value={searchTerm}
                onChange={(e) => performSearch(e.target.value)}
                autoComplete="off"
              />
              <button className={styles.searchBtn} onClick={() => performSearch(searchTerm)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                  <circle cx="10" cy="10" r="7" /><path d="M21 21l-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {showResults && (
            <div className={styles.searchResultsContainer}>
              <div className={styles.resultsHeader}>
                <h4>Search Results</h4>
                <span className={styles.resultsCount}>{searchResults.length} found</span>
              </div>
              <div className={styles.resultsList}>
                {searchResults.length === 0 ? (
                  <div className={styles.noResults}>
                    <p>No records found matching "{searchTerm}"</p>
                  </div>
                ) : (
                  searchResults.map((record, index) => {
                    const gender = getGender(record);
                    const avatar = gender.toLowerCase() === 'male' ? '👨' :
                      (gender.toLowerCase() === 'female' ? '👩' : '⚰️');
                    const ref = record.ref || record.reference || record.id || 'No Ref';
                    const deathDate = record.deathDate || record.dateOfDeath || record.datePaid || '';

                    return (
                      <div key={index} className={styles.resultCard} onClick={() => viewProfile(record)}>
                        <div className={styles.resultAvatar}>{avatar}</div>
                        <div className={styles.resultInfo}>
                          <div className={styles.resultName}>{getHighlightedText(nameFunc(record), searchTerm)}</div>
                          <div className={styles.resultMeta}>
                            <span>📋 {ref}</span>
                            <span>📅 {deathDate || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className={styles.taglineFooter}>Preserving memory. Honoring lives. Guiding families.</div>
        </div>
      </section>
    </main>
  );
}
