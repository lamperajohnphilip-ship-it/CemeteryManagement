'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDeceasedRecords, getCemeteryPublicStats } from '../../actions/deceased';
import { getAnnouncements } from '../../actions/announcements';
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

const formatShortDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
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
const nameFunc = (record: any) => record.deceased || record.name || record.fullName || 'Unknown';

// Animated Counter Component with IntersectionObserver
function AnimatedCounter({ value, duration = 1800 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const startTime = performance.now();
          const startVal = 0;
          const endVal = value;

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + (endVal - startVal) * easeOut);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(endVal);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  useEffect(() => {
    if (animatedRef.current && value > 0) {
      setCount(value);
    }
  }, [value]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deceasedRecords, setDeceasedRecords] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  // Statistics state
  const [stats, setStats] = useState({
    totalMemorials: 0,
    totalDeceased: 0,
    occupiedPlots: 0,
    availablePlots: 247,
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  // Memorial Showcase state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Search input highlight state
  const [isSearchHighlighted, setIsSearchHighlighted] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const [resRecords, resStats, resAnnouncements] = await Promise.allSettled([
          getDeceasedRecords(),
          getCemeteryPublicStats(),
          getAnnouncements(),
        ]);

        let dbRecs: any[] = [];
        if (resRecords.status === 'fulfilled' && resRecords.value?.success && resRecords.value.records) {
          dbRecs = resRecords.value.records.map((r: any) => ({
            id: r.id,
            ref: r.REF_NO,
            payor: r.PAYORS_NAME,
            contact: r.CONTACT_NO,
            deceased: r.NAME_OF_DECEASED,
            address: r.ADDRESS,
            birthDate: r.DATE_OF_BIRTH ? (new Date(r.DATE_OF_BIRTH).toISOString().split('T')[0] || '') : '',
            deathDate: r.DATE_OF_DEATH ? (new Date(r.DATE_OF_DEATH).toISOString().split('T')[0] || '') : '',
            yearPaid: r.YEAR?.toString() || '',
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

          const dbNames = new Set(dbRecs.map((r: any) => r.deceased.toLowerCase()));
          const legacyRecs = localRecs.filter(r => !dbNames.has((r.deceased || '').toLowerCase()));
          const combined = [...dbRecs, ...legacyRecs];
          setDeceasedRecords(combined);

          // Update statistics from DB or computed records
          if (resStats.status === 'fulfilled' && resStats.value?.success && resStats.value.stats) {
            setStats({
              totalMemorials: resStats.value.stats.totalMemorials,
              totalDeceased: resStats.value.stats.totalDeceased,
              occupiedPlots: resStats.value.stats.occupiedPlots,
              availablePlots: resStats.value.stats.availablePlots,
            });
          } else {
            const count = combined.length;
            setStats({
              totalMemorials: count,
              totalDeceased: count,
              occupiedPlots: count,
              availablePlots: Math.max(0, 247 - count),
            });
          }
        }

        // Announcements
        if (resAnnouncements.status === 'fulfilled' && resAnnouncements.value?.success && resAnnouncements.value.announcements) {
          const active = resAnnouncements.value.announcements
            .filter((a: any) => (a.status || 'active').toLowerCase() === 'active')
            .slice(0, 3);
          setAnnouncements(active);
        }
      } catch (e) {
        console.error('Error loading data for homepage:', e);
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
        setSelectedAnnouncement(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Memorial Showcase Carousel Auto-Advance
  const showcaseList = deceasedRecords.filter(r => (r.deceased || r.name)).slice(0, 8);

  useEffect(() => {
    if (showcaseList.length <= 1 || isCarouselPaused) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcaseList.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [showcaseList.length, isCarouselPaused]);

  const nextMemorial = () => {
    if (showcaseList.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % showcaseList.length);
  };

  const prevMemorial = () => {
    if (showcaseList.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + showcaseList.length) % showcaseList.length);
  };

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
      const remarks = (record.remarks || '').toLowerCase();

      return deceasedName.includes(lowerTerm) ||
        payorName.includes(lowerTerm) ||
        ref.includes(lowerTerm) ||
        remarks.includes(lowerTerm);
    });

    setSearchResults(results);
    setShowResults(true);
  };

  const handleSearchShortcut = () => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current.focus();
      setIsSearchHighlighted(true);
      setTimeout(() => setIsSearchHighlighted(false), 2200);
    }
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

  const viewProfile = (record: any) => {
    setSelectedProfile(record);
    setShowResults(false);
  };

  const locateGrave = (record: any) => {
    sessionStorage.setItem(
      'locateGrave',
      JSON.stringify({
        name: nameFunc(record),
        plot: record.remarks || 'A-1',
        section: (record.remarks && record.remarks.charAt(0).toUpperCase()) || 'A',
        born: getBirthDate(record),
        died: getDeathDate(record),
        age: getAge(record),
        cause: record.cause || 'Natural Causes',
        religion: record.religion || 'Christian',
        nationality: getNationality(record),
        kin: getPayor(record),
        contact: getContact(record)
      })
    );
    router.push('/grave-mapping');
  };

  const activeMemorial = showcaseList[activeSlide];

  return (
    <main className={styles.mainContainer}>
      {/* ── PROFILE MODAL ── */}
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
              {selectedProfile.payor && selectedProfile.payor !== '-' && (
                <div className={styles.profileDetailRow}>
                  <div className={styles.profileDetailLabel}>Next of Kin</div>
                  <div className={styles.profileDetailValue}>{selectedProfile.payor}</div>
                </div>
              )}

              <div className={styles.profileActions} style={{ marginTop: '32px' }}>
                <button className={`${styles.profileBtn} ${styles.profileBtnSecondary}`} onClick={() => setSelectedProfile(null)}>Close</button>
                <button
                  className={`${styles.profileBtn} ${styles.profileBtnPrimary}`}
                  onClick={() => locateGrave(selectedProfile)}
                >
                  Locate on 3D Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENT DETAILS MODAL ── */}
      {selectedAnnouncement && (
        <div className={styles.profileModal}>
          <div className={styles.announcementModalCard}>
            <div className={styles.announcementModalHeader}>
              <span className={styles.announcementCategoryBadge}>
                {selectedAnnouncement.badge || selectedAnnouncement.category?.toUpperCase() || 'ANNOUNCEMENT'}
              </span>
              <button className={styles.profileClose} onClick={() => setSelectedAnnouncement(null)}>&times;</button>
            </div>
            <h3 className={styles.announcementModalTitle}>{selectedAnnouncement.title}</h3>
            <div className={styles.announcementModalDate}>
              📅 Published on {formatDate(selectedAnnouncement.date)}
            </div>
            <div className={styles.announcementModalBody}>
              <p>{selectedAnnouncement.content}</p>
            </div>
            <div className={styles.announcementModalActions}>
              <button className={`${styles.profileBtn} ${styles.profileBtnSecondary}`} onClick={() => setSelectedAnnouncement(null)}>Close</button>
              <Link href="/announcements" className={`${styles.profileBtn} ${styles.profileBtnPrimary}`}>
                All Announcements
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          HERO & SEARCH SECTION
         ════════════════════════════════════════════════════════════════ */}
      <section className={styles.hero} id="home">
        <div className={styles.topLine}></div>
        <div className={styles.heroEyebrow}>MUNICIPALITY OF JASAAN — CEMETERY MANAGEMENT</div>
        <h1 className={styles.heroTitle}>ETERNAL <span className={styles.heroTitleGold}>REST</span><br />CEMETERY PORTAL</h1>

        <div className={styles.searchHero} ref={searchContainerRef}>
          <div className={styles.searchWrap}>
            <div className={`${styles.searchBox} ${isSearchHighlighted ? styles.searchBoxHighlighted : ''}`}>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="Search by name, lastname, plot number......"
                value={searchTerm}
                onChange={(e) => performSearch(e.target.value)}
                autoComplete="off"
              />
              <button className={styles.searchBtn} onClick={() => performSearch(searchTerm)} aria-label="Search records">
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
                            {record.remarks && <span>📍 {record.remarks}</span>}
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

          <a href="#quick-access" className={styles.scrollDownIndicator} aria-label="Scroll to services">
            <span>EXPLORE SERVICES</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURE 3: QUICK ACCESS FEATURES
         ════════════════════════════════════════════════════════════════ */}
      <section className={styles.section} id="quick-access">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>DIRECT SERVICES & ACCESS</div>
          <h2 className={styles.sectionTitle}>Essential Cemetery Services</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>
            Seamless digital tools designed to help families locate loved ones, arrange burial services, and stay informed.
          </p>
        </div>

        <div className={styles.quickAccessGrid}>
          {/* Card 1: Search Records */}
          <div className={styles.quickCard} onClick={handleSearchShortcut} role="button" tabIndex={0}>
            <div className={styles.quickCardTop}>
              <div className={styles.quickIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <span className={styles.quickBadge}>Registry</span>
            </div>
            <h3 className={styles.quickTitle}>Search Memorial Records</h3>
            <p className={styles.quickDesc}>
              Instantly find registered deceased individuals by full name, date of passing, or municipal reference number.
            </p>
            <div className={styles.quickAction}>
              <span>Search Database</span>
              <span className={styles.quickArrow}>→</span>
            </div>
          </div>

          {/* Card 2: Grave Mapping */}
          <div className={styles.quickCard} onClick={() => router.push('/grave-mapping')} role="button" tabIndex={0}>
            <div className={styles.quickCardTop}>
              <div className={styles.quickIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
              </div>
              <span className={styles.quickBadge}>3D Interactive</span>
            </div>
            <h3 className={styles.quickTitle}>Explore Grave Mapping</h3>
            <p className={styles.quickDesc}>
              Navigate the interactive 3D cemetery map to view plots, sections, walkways, and pin exact burial locations.
            </p>
            <div className={styles.quickAction}>
              <span>Open 3D Map</span>
              <span className={styles.quickArrow}>→</span>
            </div>
          </div>

          {/* Card 3: Submit Inquiry */}
          <div className={styles.quickCard} onClick={() => router.push('/inquiries')} role="button" tabIndex={0}>
            <div className={styles.quickCardTop}>
              <div className={styles.quickIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <span className={styles.quickBadge}>Assistance</span>
            </div>
            <h3 className={styles.quickTitle}>Submit an Inquiry</h3>
            <p className={styles.quickDesc}>
              Request burial arrangements, inquire about plot reservations, or contact municipal caretakers directly online.
            </p>
            <div className={styles.quickAction}>
              <span>File Inquiry</span>
              <span className={styles.quickArrow}>→</span>
            </div>
          </div>

          {/* Card 4: Announcements */}
          <div
            className={styles.quickCard}
            onClick={() => {
              const el = document.getElementById('announcements');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else router.push('/announcements');
            }}
            role="button"
            tabIndex={0}
          >
            <div className={styles.quickCardTop}>
              <div className={styles.quickIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <span className={styles.quickBadge}>Updates</span>
            </div>
            <h3 className={styles.quickTitle}>View Announcements</h3>
            <p className={styles.quickDesc}>
              Stay updated on visiting schedules, upcoming holiday mass schedules, and municipal cemetery advisories.
            </p>
            <div className={styles.quickAction}>
              <span>Read Notices</span>
              <span className={styles.quickArrow}>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURE 2: CEMETERY STATISTICS (ANIMATED COUNTING EFFECT)
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="statistics">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>MUNICIPAL CEMETERY RECORDS</div>
          <h2 className={styles.sectionTitle}>Cemetery Overview & Capacity</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>
            Live metrics and capacity statistics verified directly from the official municipal cemetery database.
          </p>
        </div>

        <div className={styles.statsGrid}>
          {/* Stat 1: Total Registered Memorials */}
          <div className={styles.statCard}>
            <div className={styles.statCardGlow}></div>
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>📜</span>
            </div>
            <div className={styles.statNumber}>
              <AnimatedCounter value={stats.totalMemorials} />
            </div>
            <div className={styles.statLabel}>Total Registered Memorials</div>
            <div className={styles.statDesc}>Digitized profiles recorded in the municipal registry</div>
          </div>

          {/* Stat 2: Available Burial Plots */}
          <div className={styles.statCard}>
            <div className={styles.statCardGlow}></div>
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>🌿</span>
            </div>
            <div className={styles.statNumber}>
              <AnimatedCounter value={stats.availablePlots} />
            </div>
            <div className={styles.statLabel}>Available Burial Plots</div>
            <div className={styles.statDesc}>Open capacity in designated public cemetery plots</div>
          </div>

          {/* Stat 3: Occupied Burial Plots */}
          <div className={styles.statCard}>
            <div className={styles.statCardGlow}></div>
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>⚰️</span>
            </div>
            <div className={styles.statNumber}>
              <AnimatedCounter value={stats.occupiedPlots} />
            </div>
            <div className={styles.statLabel}>Occupied Burial Plots</div>
            <div className={styles.statDesc}>Plots currently maintained under perpetual municipal care</div>
          </div>

          {/* Stat 4: Total Recorded Deceased Individuals */}
          <div className={styles.statCard}>
            <div className={styles.statCardGlow}></div>
            <div className={styles.statIconWrap}>
              <span className={styles.statIcon}>🕊️</span>
            </div>
            <div className={styles.statNumber}>
              <AnimatedCounter value={stats.totalDeceased} />
            </div>
            <div className={styles.statLabel}>Total Recorded Deceased</div>
            <div className={styles.statDesc}>Cherished souls resting peacefully in our grounds</div>
          </div>
        </div>

        <div className={styles.statsLiveFooter}>
          <span className={styles.statsLiveDot}></span>
          <span>Live synchronized with the Municipality of Jasaan database</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURE 1: MEMORIAL SHOWCASE (INTERACTIVE CAROUSEL)
         ════════════════════════════════════════════════════════════════ */}
      <section
        className={styles.section}
        id="memorial-showcase"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>IN REMEMBRANCE & HONOR</div>
          <h2 className={styles.sectionTitle}>Memorial Showcase</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>
            Cherishing the memories and honoring the lives of dearly departed individuals peacefully resting in our sanctuary.
          </p>
        </div>

        {showcaseList.length > 0 ? (
          <div className={styles.showcaseWrapper}>
            <button className={`${styles.carouselNavBtn} ${styles.carouselNavPrev}`} onClick={prevMemorial} aria-label="Previous memorial">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className={styles.showcaseCard}>
              <div className={styles.showcaseOrnament}>⚜️</div>
              
              <div className={styles.showcaseAvatarWrap}>
                <div className={styles.showcaseAvatarRing}></div>
                <div className={styles.showcaseAvatar}>
                  {getGender(activeMemorial).toLowerCase() === 'female' ? '👩' :
                    getGender(activeMemorial).toLowerCase() === 'male' ? '👨' : '🕯️'}
                </div>
              </div>

              <h3 className={styles.showcaseName}>{nameFunc(activeMemorial)}</h3>
              
              <div className={styles.showcaseLifespan}>
                <span>Born: {formatShortDate(getBirthDate(activeMemorial))}</span>
                <span className={styles.showcaseDot}>•</span>
                <span>Rest: {formatShortDate(getDeathDate(activeMemorial))}</span>
                {getAge(activeMemorial) !== '-' && (
                  <>
                    <span className={styles.showcaseDot}>•</span>
                    <span>Age {getAge(activeMemorial)}</span>
                  </>
                )}
              </div>

              <div className={styles.showcasePlotBadge}>
                📍 Plot: {activeMemorial?.remarks || 'Public Cemetery — Section A'}
              </div>

              <p className={styles.showcaseEpitaph}>
                &ldquo;Resting in eternal peace and radiant light. Deeply cherished, forever remembered, and honored with profound love.&rdquo;
              </p>

              <div className={styles.showcaseActions}>
                <button
                  className={`${styles.profileBtn} ${styles.profileBtnPrimary}`}
                  onClick={() => viewProfile(activeMemorial)}
                >
                  View Memorial Details
                </button>
                <button
                  className={`${styles.profileBtn} ${styles.profileBtnSecondary}`}
                  onClick={() => locateGrave(activeMemorial)}
                >
                  Locate on 3D Map
                </button>
              </div>

              <div className={styles.carouselIndicators}>
                {showcaseList.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.carouselDot} ${idx === activeSlide ? styles.carouselDotActive : ''}`}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <button className={`${styles.carouselNavBtn} ${styles.carouselNavNext}`} onClick={nextMemorial} aria-label="Next memorial">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        ) : (
          <div className={styles.showcaseEmpty}>
            <p>Loading memorial registry from municipal database...</p>
          </div>
        )}

        {/* Thumbnail Selector Strip */}
        {showcaseList.length > 1 && (
          <div className={styles.showcaseStrip}>
            {showcaseList.map((rec, i) => (
              <div
                key={i}
                className={`${styles.stripItem} ${i === activeSlide ? styles.stripItemActive : ''}`}
                onClick={() => setActiveSlide(i)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.stripAvatar}>
                  {getGender(rec).toLowerCase() === 'female' ? '👩' :
                    getGender(rec).toLowerCase() === 'male' ? '👨' : '🕯️'}
                </div>
                <div className={styles.stripInfo}>
                  <div className={styles.stripName}>{nameFunc(rec)}</div>
                  <div className={styles.stripPlot}>{rec.remarks || 'Plot Grid'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MEMORIAL VIDEO SHOWCASE & VIRTUAL TOUR
         ════════════════════════════════════════════════════════════════ */}
      <VideoSlideshow />

      {/* ════════════════════════════════════════════════════════════════
          FEATURE 4: LATEST ANNOUNCEMENTS
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="announcements">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>PUBLIC NOTICES & SCHEDULES</div>
          <h2 className={styles.sectionTitle}>Latest Cemetery Announcements</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>
            Official announcements, holy mass schedules, maintenance advisories, and administrative updates from MEEDO.
          </p>
        </div>

        <div className={styles.announcementsGrid}>
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className={styles.announcementCard}
                onClick={() => setSelectedAnnouncement(ann)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.announcementCardHead}>
                  <span className={styles.announcementCategoryBadge}>
                    {ann.badge || ann.category?.toUpperCase() || 'ANNOUNCEMENT'}
                  </span>
                  <span className={styles.announcementDate}>
                    {formatShortDate(ann.date)}
                  </span>
                </div>
                <h3 className={styles.announcementCardTitle}>{ann.title}</h3>
                <p className={styles.announcementCardExcerpt}>
                  {ann.content.length > 140 ? `${ann.content.slice(0, 140)}...` : ann.content}
                </p>
                <div className={styles.announcementCardFooter}>
                  <span className={styles.announcementReadMore}>Read Notice →</span>
                  {ann.views !== undefined && (
                    <span className={styles.announcementViews}>👁️ {ann.views} views</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.announcementFallbackCard}>
              <div className={styles.announcementCategoryBadge}>NOTICE</div>
              <h3>Regular Cemetery Visiting Guidelines</h3>
              <p>The municipal cemetery is open daily from 6:00 AM to 6:00 PM. Please observe solemnity, keep walkways clean, and dispose of candle waste responsibly.</p>
              <div className={styles.announcementCardFooter}>
                <span className={styles.announcementReadMore}>General Notice</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.sectionCtaWrap}>
          <Link href="/announcements" className={styles.viewAllBtn}>
            <span>View All Announcements</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FEATURE 5: CEMETERY INFORMATION SECTION & VISITING HOURS
         ════════════════════════════════════════════════════════════════ */}
      <section className={styles.section} id="cemetery-info">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>ABOUT ETERNAL REST</div>
          <h2 className={styles.sectionTitle}>Cemetery Administration & Visiting Information</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>
            Providing a serene, sacred, and organized sanctuary for the families of the Municipality of Jasaan.
          </p>
        </div>

        <div className={styles.infoGrid}>
          {/* Info Card 1: Management & Purpose */}
          <div className={styles.infoCard}>
            <div className={styles.infoIconWrap}>
              <span className={styles.infoIcon}>🏛️</span>
            </div>
            <h3 className={styles.infoCardTitle}>Management & Administration</h3>
            <p className={styles.infoCardText}>
              Eternal Rest Cemetery is managed under the authority of the <strong>Municipal Environment & Natural Resources Office (MEEDO)</strong> of the Local Government Unit of Jasaan.
            </p>
            <ul className={styles.infoList}>
              <li>Digitized burial records and public archive security</li>
              <li>Perpetual grounds upkeep, landscaping, and pathway maintenance</li>
              <li>Compassionate assistance with burial coordination and plot allocations</li>
            </ul>
            <div className={styles.infoCardSubtext}>
              📍 MEEDO Office: 2nd Floor, Municipal Hall, Jasaan, Misamis Oriental
            </div>
          </div>

          {/* Info Card 2: Visiting Information */}
          <div className={styles.infoCard}>
            <div className={styles.infoIconWrap}>
              <span className={styles.infoIcon}>🕰️</span>
            </div>
            <h3 className={styles.infoCardTitle}>Visiting Hours & Office Hours</h3>
            <p className={styles.infoCardText}>
              Families and visitors are always welcome to pray, remember, and pay solemn homage to their departed loved ones.
            </p>
            <div className={styles.hoursBlock}>
              <div className={styles.hourRow}>
                <span className={styles.hourDay}>Cemetery Grounds:</span>
                <span className={styles.hourTime}>6:00 AM – 6:00 PM Daily</span>
              </div>
              <div className={styles.hourRow}>
                <span className={styles.hourDay}>Administrative Desk:</span>
                <span className={styles.hourTime}>8:00 AM – 5:00 PM (Mon – Fri)</span>
              </div>
              <div className={styles.hourRow}>
                <span className={styles.hourDay}>All Saints' & Souls' Day:</span>
                <span className={styles.hourTime}>Extended 24-Hour Access</span>
              </div>
            </div>
            <div className={styles.infoCardSubtext}>
              📞 Inquiries & Burial Assistance: (088) 888-0000 / admin@jasaan.gov.ph
            </div>
          </div>

          {/* Info Card 3: Visitor Etiquette & Guidelines */}
          <div className={styles.infoCard}>
            <div className={styles.infoIconWrap}>
              <span className={styles.infoIcon}>🕊️</span>
            </div>
            <h3 className={styles.infoCardTitle}>Solemn Guidelines & Etiquette</h3>
            <p className={styles.infoCardText}>
              To preserve the tranquility, dignity, and sacred atmosphere of our resting grounds, visitors are kindly requested to observe:
            </p>
            <ul className={styles.infoList}>
              <li><strong>Quiet Reverence:</strong> Please keep conversations low and respectful.</li>
              <li><strong>CLAYGO Policy:</strong> Clean As You Go — please dispose of floral wrappers and trash into bins.</li>
              <li><strong>Candle Safety:</strong> Ensure candles are placed on designated holders and extinguished before departure.</li>
              <li><strong>Grave Care:</strong> Report any damaged monuments or grounds concerns to the MEEDO desk.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}