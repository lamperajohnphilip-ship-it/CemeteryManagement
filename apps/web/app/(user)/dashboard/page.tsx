'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getDeceasedRecords, getCemeteryPublicStats } from '../../actions/deceased';
import VideoSlideshow from '../../../components/VideoSlideshow';
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
  const [cemeteryStats, setCemeteryStats] = useState<{
    totalMemorials: number;
    availablePlots: number;
    totalCapacity: number;
  } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const [res, statsRes] = await Promise.all([
          getDeceasedRecords(),
          getCemeteryPublicStats()
        ]);

        if (statsRes && statsRes.success && statsRes.stats) {
          setCemeteryStats(statsRes.stats as any);
        }

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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
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
          regex.test(part) ? <mark key={i} className={styles.searchHighlight}>{part}</mark> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const nameFunc = (record: any) => record.deceased || record.name || record.fullName || 'Unknown';

  const viewProfile = (record: any) => {
    setSelectedProfile(record);
    setShowResults(false);
  };

  return (
    <main className={styles.main}>
      {/* Deceased Profile Modal */}
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
              <button 
                className={styles.profileClose} 
                onClick={() => setSelectedProfile(null)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className={styles.profileBody}>
              <p className={styles.profileRip}>
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

              <div className={styles.profileActions}>
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

      {/* Hero Section inspired by Onyx Funeral Home Reference */}
      <section className={styles.hero} id="home">
        <div className={styles.topLine}></div>

        <div className={styles.heroContainer}>
          <div className={styles.heroEyebrow}>
            <span>MUNICIPALITY OF JASAAN</span>
            <span className={styles.eyebrowSeparator}>·</span>
            <span>ETERNAL REST CEMETERY PORTAL</span>
          </div>

          <h1 className={styles.heroTitle}>
            Honoring Lives.<br />
            <span className={styles.heroTitleGold}>Preserving Memories.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Preserving memory. Honoring lives. Guiding families.
          </p>

          <p className={styles.heroTagline}>
            Proudly Serving Families with Dignity &amp; Respect
          </p>

          {/* Quick Action Navigation Cards (Onyx Reference Inspired) */}
          <div className={styles.quickActionCards}>
            <button 
              className={styles.actionCard} 
              onClick={() => router.push('/grave-mapping')}
              aria-label="Locate a Grave in Cemetery Mapping"
            >
              <div className={styles.actionCardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="22" height="22">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                  <line x1="9" y1="3" x2="9" y2="18"></line>
                </svg>
              </div>
              <div className={styles.actionCardContent}>
                <span className={styles.actionCardTitle}>Locate a Grave</span>
                <span className={styles.actionCardSub}>Interactive Cemetery Map</span>
              </div>
            </button>

            <button 
              className={styles.actionCard} 
              onClick={() => router.push('/inquiries')}
              aria-label="Submit an Inquiry or Request Assistance"
            >
              <div className={styles.actionCardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="22" height="22">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className={styles.actionCardContent}>
                <span className={styles.actionCardTitle}>Submit Inquiry</span>
                <span className={styles.actionCardSub}>Burial Assistance &amp; Help</span>
              </div>
            </button>

            <button 
              className={styles.actionCard} 
              onClick={() => router.push('/announcements')}
              aria-label="View Public Announcements and Advisories"
            >
              <div className={styles.actionCardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="22" height="22">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <div className={styles.actionCardContent}>
                <span className={styles.actionCardTitle}>Announcements</span>
                <span className={styles.actionCardSub}>Public Notices &amp; Guidelines</span>
              </div>
            </button>
          </div>

          {/* Prominent Memorial Search Section */}
          <div className={styles.searchHero} ref={searchContainerRef}>
            <div className={styles.searchLabelRow}>
              <span className={styles.searchLabelIcon}>🔍</span>
              <span className={styles.searchLabelText}>Search Memorial Records:</span>
              <span className={styles.searchLabelSub}>Locate records by deceased name, payor, or plot reference</span>
            </div>

            <div className={styles.searchWrap}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Enter name, family name, or plot reference number..."
                  value={searchTerm}
                  onChange={(e) => performSearch(e.target.value)}
                  autoComplete="off"
                  aria-label="Search deceased records"
                />
                <button 
                  className={styles.searchBtn} 
                  onClick={() => performSearch(searchTerm)}
                  aria-label="Search"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="10" cy="10" r="7" /><path d="M21 21l-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Live Autocomplete Results Container */}
            {showResults && (
              <div className={styles.searchResultsContainer}>
                <div className={styles.resultsHeader}>
                  <h4>Memorial Records</h4>
                  <span className={styles.resultsCount}>{searchResults.length} {searchResults.length === 1 ? 'record' : 'records'} found</span>
                </div>
                <div className={styles.resultsList}>
                  {searchResults.length === 0 ? (
                    <div className={styles.noResults}>
                      <p>No records found matching &ldquo;{searchTerm}&rdquo;</p>
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
                              {record.remarks && <span>📍 {record.remarks}</span>}
                            </div>
                          </div>
                          <div className={styles.resultArrow}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cemetery Statistics Strip */}
          <div className={styles.statsStrip}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {cemeteryStats?.totalMemorials ?? (deceasedRecords.length > 0 ? deceasedRecords.length.toLocaleString() : '1,200+')}
              </span>
              <span className={styles.statLabel}>Memorial Records</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {cemeteryStats?.availablePlots !== undefined ? cemeteryStats.availablePlots : '100%'}
              </span>
              <span className={styles.statLabel}>
                {cemeteryStats?.availablePlots !== undefined ? 'Available Plots' : 'Digitized Mapping'}
              </span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>24 / 7</span>
              <span className={styles.statLabel}>Public Portal</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>Jasaan</span>
              <span className={styles.statLabel}>Municipal Cemetery</span>
            </div>
          </div>

          {/* Scroll Down to Memorial Showcase */}
          <a href="#video-tour" className={styles.scrollDownIndicator} aria-label="Scroll to Memorial Showcase">
            <span>MEMORIAL SHOWCASE &amp; VIDEO TOUR</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </section>

      {/* Memorial Video Tour & Showcase Slideshow Section */}
      <VideoSlideshow />
    </main>
  );
}
