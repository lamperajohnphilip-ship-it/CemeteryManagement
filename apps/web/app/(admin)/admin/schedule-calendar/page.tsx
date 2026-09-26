'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './page.module.css';
import { getScheduleCalendarData, type CalendarEventItem } from '../../../actions/schedule';

type CalendarEvent = CalendarEventItem;

const TIME_SLOTS = [
  '8:00 AM – 9:00 AM',
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  confirmed: 'Accepted',
  rejected: 'Rejected',
  inprogress: 'In Progress',
  cancelled: 'Cancelled',
};

export default function ScheduleCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<{ open: boolean; event: CalendarEvent | null }>({ open: false, event: null });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  /* ── Load data ── */
  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getScheduleCalendarData(monthStr);
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (_) {}
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, [monthStr]);

  /* ── Calendar grid ── */
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { date: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month fill
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, dayNum: d, isCurrentMonth: false, isToday: false });
    }

    // Current month
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, dayNum: d, isCurrentMonth: true, isToday: dateStr === todayStr });
    }

    // Next month fill
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, dayNum: d, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [year, month]);

  /* ── Events grouped by date ── */
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(evt => {
      if (!evt.date) return;
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date]!.push(evt);
    });
    return map;
  }, [events]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const accepted = events.filter(e => e.status === 'accepted' || e.status === 'confirmed').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayCount = events.filter(e => e.date === todayStr && (e.status === 'accepted' || e.status === 'confirmed')).length;
    return { total: events.length, accepted, pending, today: todayCount };
  }, [events]);

  /* ── Navigation ── */
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => { setCurrentDate(new Date()); setSelectedDay(null); };

  /* ── Event badge class ── */
  const getEventClass = (status: string) => {
    switch (status) {
      case 'accepted': case 'confirmed': return styles.eventAccepted;
      case 'pending': return styles.eventPending;
      case 'rejected': return styles.eventRejected;
      case 'inprogress': return styles.eventInprogress;
      case 'cancelled': return styles.eventCancelled;
      default: return styles.eventPending;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted': case 'confirmed': return styles.badgeAccepted;
      case 'pending': return styles.badgePending;
      case 'rejected': return styles.badgeRejected;
      case 'inprogress': return styles.badgeInprogress;
      case 'cancelled': return styles.badgeCancelled;
      default: return styles.badgePending;
    }
  };

  /* ── Day view events ── */
  const dayViewEvents = selectedDay ? (eventsByDate[selectedDay] || []) : [];
  const selectedDayFormatted = selectedDay
    ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h3>Schedule Calendar</h3>
        <p>View and manage all scheduled inquiries. Accepted schedules block availability for new user inquiries.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'This Month', count: stats.total, sub: 'Total scheduled', cls: styles.statTotal },
          { label: 'Accepted', count: stats.accepted, sub: 'Confirmed schedules', cls: styles.statAccepted },
          { label: 'Pending', count: stats.pending, sub: 'Awaiting approval', cls: styles.statPending },
          { label: 'Today', count: stats.today, sub: 'Schedules today', cls: styles.statToday },
        ].map(s => (
          <div key={s.label} className={`${styles.statCard} ${s.cls}`}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statCount}>{s.count}</span>
            <span className={styles.statSub}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className={styles.calendarPanel}>
        <div className={styles.calendarToolbar}>
          <div className={styles.calendarNav}>
            <button className={styles.calendarNavBtn} onClick={prevMonth}>← Prev</button>
            <span className={styles.calendarMonth}>{MONTH_NAMES[month]} {year}</span>
            <button className={styles.calendarNavBtn} onClick={nextMonth}>Next →</button>
          </div>
          <div className={styles.calendarActions}>
            <div className={styles.legend}>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendAccepted}`} /> Accepted</div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendPending}`} /> Pending</div>
              <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendRejected}`} /> Rejected</div>
            </div>
            <button className={styles.todayBtn} onClick={goToToday}>Today</button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingWrap}>⏳ Loading calendar data…</div>
        ) : (
          <div className={styles.calendarGrid}>
            {DAY_NAMES.map(d => (
              <div key={d} className={styles.dayHeader}>{d}</div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayEvents = eventsByDate[day.date] || [];
              const maxShow = 3;
              return (
                <div
                  key={idx}
                  className={`${styles.dayCell} ${!day.isCurrentMonth ? styles.dayCellOther : ''} ${day.isToday ? styles.dayCellToday : ''}`}
                  onClick={() => day.isCurrentMonth && setSelectedDay(day.date)}
                >
                  <div className={styles.dayNumber}>{day.dayNum}</div>
                  <div className={styles.dayEvents}>
                    {dayEvents.slice(0, maxShow).map(evt => (
                      <div
                        key={evt.id}
                        className={`${styles.eventBadge} ${getEventClass(evt.status)}`}
                        onClick={(e) => { e.stopPropagation(); setDetailModal({ open: true, event: evt }); }}
                        title={`${evt.time} · ${evt.fullName || evt.deceased} · ${STATUS_LABEL[evt.status] || evt.status}`}
                      >
                        {evt.time?.split(' – ')[0] || ''} {evt.fullName || evt.deceased}
                      </div>
                    ))}
                    {dayEvents.length > maxShow && (
                      <div className={styles.moreEvents} onClick={() => setSelectedDay(day.date)}>
                        +{dayEvents.length - maxShow} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Day View */}
      {selectedDay && (
        <div className={styles.dayViewPanel}>
          <div className={styles.dayViewHeader}>
            <span className={styles.dayViewTitle}>📋 {selectedDayFormatted}</span>
            <button className={styles.dayViewClose} onClick={() => setSelectedDay(null)}>✕ Close</button>
          </div>
          <div className={styles.dayViewBody}>
            {dayViewEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📅</div>
                <h5>No Schedules</h5>
                <p>No inquiries are scheduled for this date. All time slots are available.</p>
              </div>
            ) : (
              TIME_SLOTS.map(slot => {
                const slotEvents = dayViewEvents.filter(e => e.time === slot);
                return (
                  <div key={slot} className={styles.timeSlotRow}>
                    <div className={styles.timeSlotTime}>{slot}</div>
                    <div className={styles.timeSlotContent}>
                      {slotEvents.length === 0 ? (
                        <div className={styles.timeSlotAvailable}>✓ Available</div>
                      ) : (
                        slotEvents.map(evt => (
                          <div
                            key={evt.id}
                            className={styles.timeSlotEvent}
                            onClick={() => setDetailModal({ open: true, event: evt })}
                          >
                            <div className={styles.timeSlotEventName}>
                              {evt.fullName || evt.deceased || '—'}
                              <span className={`${styles.badge} ${getStatusBadgeClass(evt.status)}`} style={{ marginLeft: '10px' }}>
                                {STATUS_LABEL[evt.status] || evt.status}
                              </span>
                            </div>
                            <div className={styles.timeSlotEventMeta}>
                              {evt.deceased && <span>⚰️ {evt.deceased}</span>}
                              <span>📋 {evt.reason}</span>
                              <span>📞 {evt.phone}</span>
                              <span style={{ color: '#5A5650' }}>Ref: {evt.ref}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.open && detailModal.event && (() => {
        const evt = detailModal.event;
        return (
          <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setDetailModal({ open: false, event: null }); }}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>📋 Schedule Details</h3>
                <button className={styles.modalClose} onClick={() => setDetailModal({ open: false, event: null })}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className={`${styles.badge} ${getStatusBadgeClass(evt.status)}`}>
                    {STATUS_LABEL[evt.status] || evt.status}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#C8A84B', fontFamily: "'DM Mono', monospace" }}>{evt.ref}</span>
                </div>

                <div className={styles.detailGrid}>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Deceased Name</div>
                    <div className={`${styles.detailValue} ${styles.highlight}`}>{evt.deceased || '—'}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Family / Applicant</div>
                    <div className={styles.detailValue}>{evt.fullName}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Inquiry Category</div>
                    <div className={styles.detailValue}>{evt.reason}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Contact</div>
                    <div className={styles.detailValue}>{evt.phone}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Burial Date</div>
                    <div className={`${styles.detailValue} ${styles.highlight}`}>{evt.formattedDate || evt.date}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Burial Time</div>
                    <div className={`${styles.detailValue} ${styles.highlight}`}>{evt.time || '—'}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Email</div>
                    <div className={styles.detailValue}>{evt.email}</div>
                  </div>
                  <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Relationship</div>
                    <div className={styles.detailValue}>{evt.relation}</div>
                  </div>
                  {evt.plot && (
                    <div className={styles.detailCard}>
                      <div className={styles.detailLabel}>Requested Plot</div>
                      <div className={`${styles.detailValue} ${styles.highlight}`}>{evt.plot}</div>
                    </div>
                  )}
                  {evt.address && (
                    <div className={styles.detailCard}>
                      <div className={styles.detailLabel}>Address</div>
                      <div className={styles.detailValue}>{evt.address}</div>
                    </div>
                  )}
                  {evt.notes && (
                    <div className={`${styles.detailCard} ${styles.fullWidth}`}>
                      <div className={styles.detailLabel}>Additional Notes</div>
                      <div className={styles.detailValue} style={{ fontStyle: 'italic', color: '#9A8A6A' }}>{evt.notes}</div>
                    </div>
                  )}
                  {evt.remarks && (
                    <div className={`${styles.detailCard} ${styles.fullWidth}`}>
                      <div className={styles.detailLabel}>Admin Remarks</div>
                      <div className={`${styles.detailValue} ${styles.highlight}`}>{evt.remarks}</div>
                    </div>
                  )}
                  <div className={`${styles.detailCard} ${styles.fullWidth}`}>
                    <div className={styles.detailLabel}>Submitted At</div>
                    <div className={styles.detailValue} style={{ fontSize: '0.78rem', color: '#7A7570' }}>
                      {evt.submittedAt ? new Date(evt.submittedAt).toLocaleString('en-PH') : '—'}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button className={styles.btnGold} onClick={() => setDetailModal({ open: false, event: null })}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
