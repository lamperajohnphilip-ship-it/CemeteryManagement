import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from 'react-native';
import { themeColors, Theme } from '../theme/colors';
import { getAnnouncements } from '../services/api';
import { getBaseUrl } from '../config/api';

interface ScreenProps {
  baseUrl?: string;
  theme?: Theme;
}

interface Announcement {
  id: number;
  title: string;
  category: string;
  badge?: string;
  date: string;
  content: string;
  status: string;
  visibility: string;
  validFrom?: string | null;
  validUntil?: string | null;
}

export default function Announcements({ baseUrl, theme = 'dark' }: ScreenProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const loadAnnouncements = async (incrementViews = false, showIndicator = true) => {
    try {
      if (showIndicator) setLoading(true);
      setErrorMessage(null);
      const list = await getAnnouncements(incrementViews, baseUrl || getBaseUrl());
      setAnnouncements(list);
    } catch (e: any) {
      console.error('Error fetching announcements on mobile:', e);
      setErrorMessage(e.message || 'Unable to load announcements.');
    } finally {
      if (showIndicator) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnnouncements(false, false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAnnouncements(true, true);

    // 30-second polling for real-time synchronization
    const interval = setInterval(() => {
      loadAnnouncements(false, false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  const timeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return formatDate(dateString);
    } catch (e) {
      return '';
    }
  };

  const formatSchedule = (from?: string | null, until?: string | null) => {
    if (!from && !until) return null;
    try {
      const opt: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      if (from && until) {
        return `${new Date(from).toLocaleDateString('en-US', opt)} – ${new Date(until).toLocaleDateString('en-US', opt)}`;
      }
      if (from) return `Starting ${new Date(from).toLocaleDateString('en-US', opt)}`;
      if (until) return `Until ${new Date(until).toLocaleDateString('en-US', opt)}`;
    } catch (_) {}
    return null;
  };

  const filteredAnnouncements = announcements.filter(a => {
    const statusClean = (a.status || 'active').toLowerCase();
    const visClean = (a.visibility || 'public').toLowerCase();
    const isPublic = statusClean === 'active' && (visClean.includes('public') || !a.visibility);
    if (!isPublic) return false;
    if (currentFilter === 'all') return true;

    const cat = (a.category || '').toLowerCase().trim();
    if (currentFilter === 'notices') return cat.startsWith('notice');
    if (currentFilter === 'events') return cat.startsWith('event');
    if (currentFilter === 'alerts') return cat.startsWith('alert') || cat.startsWith('emerg');
    if (currentFilter === 'info') return cat.startsWith('info') || cat.startsWith('gen');
    return cat === currentFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.appBg }]}>
      {/* Header Info */}
      <View style={[styles.annHeader, { borderBottomColor: colors.goldBorder }]}>
        <Text style={[styles.subhead, { color: colors.gold }]}>MUNICIPALITY OF JASAAN · CEMETERY OFFICE</Text>
        <Text style={[styles.title, { color: colors.text }]}>ANNOUNCEMENTS</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Official notices, events & updates from the cemetery office</Text>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterTabsWrap, { borderBottomColor: colors.divider }]}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {['all', 'notices', 'events', 'alerts', 'info'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, { borderColor: colors.boneMuted }, currentFilter === filter && { backgroundColor: colors.gold, borderColor: colors.gold }]}
              onPress={() => setCurrentFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, { color: colors.boneMuted }, currentFilter === filter && { color: colors.stone }]}>
                {filter === 'all' ? 'ALL POSTS' : filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.gold} style={{ flex: 1 }} />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.feedContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.gold]}
              tintColor={colors.gold}
            />
          }
        >
          {errorMessage ? (
            <View style={[styles.emptyState, { borderColor: 'rgba(239, 68, 68, 0.4)', borderWidth: 1, borderRadius: 8, padding: 20 }]}>
              <Text style={styles.emptyIcon}>⚠️</Text>
              <Text style={[styles.emptyTitle, { color: '#f87171' }]}>Unable to Load Announcements</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{errorMessage}</Text>
              <TouchableOpacity
                style={{ backgroundColor: colors.gold, paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6, marginTop: 14 }}
                onPress={() => loadAnnouncements(false, true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: colors.stone, fontWeight: '700', fontSize: 12 }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredAnnouncements.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⏳</Text>
              <Text style={[styles.emptyTitle, { color: colors.gold }]}>No Announcements Yet</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>The cemetery office hasn't posted any updates under this category.</Text>
            </View>
          ) : (
            filteredAnnouncements.map((ann) => (
              <View key={ann.id} style={[styles.annCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{ann.title}</Text>
                  <View style={styles.cardMeta}>
                    <View style={[styles.badge, { backgroundColor: colors.gold }]}>
                      <Text style={[styles.badgeText, { color: colors.stone }]}>{ann.badge || ann.category.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.cardDate, { color: colors.textMuted }]}>📅 {formatDate(ann.date)}</Text>
                  </View>
                  {formatSchedule(ann.validFrom, ann.validUntil) ? (
                    <Text style={[styles.cardDate, { color: colors.gold, marginTop: 4, fontWeight: '600' }]}>
                      🗓️ {formatSchedule(ann.validFrom, ann.validUntil)}
                    </Text>
                  ) : null}
                </View>

                {/* Announcement Content */}
                <Text style={[styles.cardBody, { color: colors.boneMuted }]}>
                  {ann.content.replace(/<[^>]*>/g, '')}
                </Text>

              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Floating Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMsg}</Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  annHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 168, 76, 0.15)',
  },
  subhead: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.gold,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  description: {
    fontSize: 12,
    color: colors.boneMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  filterTabsWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  filterTabs: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.boneMuted,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterTabText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.boneDim,
    letterSpacing: 1,
  },
  filterTabTextActive: {
    color: colors.stone,
  },
  feedContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    color: colors.gold,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 12,
    color: colors.boneDim,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  annCard: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  badge: {
    backgroundColor: colors.gold,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.stone,
  },
  cardDate: {
    fontSize: 11,
    color: colors.boneDim,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.boneMuted,
    marginBottom: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(201, 168, 76, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: colors.stone,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
