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
import { themeColors, Theme } from '../../App';

interface ScreenProps {
  baseUrl: string;
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
}

export default function Announcements({ baseUrl, theme = 'dark' }: ScreenProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      const response = await fetch(`${baseUrl}/api/announcements?incrementViews=${incrementViews}`);
      const data = await response.json();
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements);
      }
    } catch (e) {
      console.error('Error fetching announcements on mobile:', e);
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

  const filteredAnnouncements = announcements.filter(a => {
    const isPublic = a.status === 'active' && a.visibility === 'Public (Visible to all)';
    if (!isPublic) return false;
    return currentFilter === 'all' || a.category.toLowerCase() === currentFilter;
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
          {filteredAnnouncements.length === 0 ? (
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
