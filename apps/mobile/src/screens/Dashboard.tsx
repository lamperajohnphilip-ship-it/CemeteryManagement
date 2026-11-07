import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { themeColors, Theme } from '../theme/colors';
import { getDeceasedRecords, DeceasedRecord } from '../services/api';
import { getBaseUrl, PRODUCTION_API_URL, setApiUrlOverride } from '../config/api';

interface ScreenProps {
  baseUrl?: string;
  onLocateGrave?: (graveData: any) => void;
  theme?: Theme;
}

// Utility functions copied from web for consistency
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

const nameFunc = (record: any) => record.deceased || record.name || record.fullName || 'Unknown';

export default function Dashboard({ baseUrl, onLocateGrave, theme = 'dark' }: ScreenProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
  const [searchTerm, setSearchTerm] = useState('');
  const [deceasedRecords, setDeceasedRecords] = useState<DeceasedRecord[]>([]);
  const [searchResults, setSearchResults] = useState<DeceasedRecord[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentBaseUrl, setCurrentBaseUrl] = useState<string>(baseUrl || getBaseUrl());

  // Animation values
  const searchAnim = useRef(new Animated.Value(0)).current;

  const loadRecords = async (showIndicator = true, overrideUrl?: string) => {
    const targetUrl = overrideUrl || currentBaseUrl || baseUrl || getBaseUrl();
    try {
      if (showIndicator) setLoading(true);
      setErrorMessage(null);
      const records = await getDeceasedRecords(targetUrl);
      setDeceasedRecords(records);
      setErrorMessage(null);
    } catch (e: any) {
      console.error('Error fetching records in mobile app:', e);
      setErrorMessage(e.message || 'Failed to connect to cemetery server.');
    } finally {
      if (showIndicator) setLoading(false);
    }
  };

  const handleSwitchToCloud = async () => {
    setApiUrlOverride(PRODUCTION_API_URL);
    setCurrentBaseUrl(PRODUCTION_API_URL);
    await loadRecords(true, PRODUCTION_API_URL);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecords(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadRecords(true);

    // 30-second polling for real-time synchronization
    const interval = setInterval(() => {
      loadRecords(false);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [currentBaseUrl]);

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

    Animated.spring(searchAnim, {
      toValue: 1,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <Text style={[styles.resultName, { color: colors.text }]}>{text}</Text>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <Text style={[styles.resultName, { color: colors.text }]} numberOfLines={1}>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={{ backgroundColor: colors.goldBorder, color: colors.text }}>{part}</Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const viewProfile = (record: any) => {
    setSelectedProfile(record);
    setShowResults(false);
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.appBg }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.gold]}
            tintColor={colors.gold}
          />
        }
      >
        {/* Top brand line */}
        <View style={styles.topLine} />

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEyebrow}>MUNICIPALITY OF JASAAN — CEMETERY MANAGEMENT</Text>
          <Text style={styles.heroTitle}>
            ETERNAL <Text style={styles.heroTitleGold}>REST</Text>
          </Text>
          <Text style={styles.heroSubtitle}>CEMETERY PORTAL</Text>

          {/* Search Wrap */}
          <View style={styles.searchWrap}>
            <View style={[styles.searchBox, { backgroundColor: colors.inputBg, borderColor: colors.goldBorder }]}>
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search by name, lastname, plot..."
                placeholderTextColor={colors.boneDim}
                value={searchTerm}
                onChangeText={performSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.searchBtn, { backgroundColor: colors.gold }]}
                onPress={() => performSearch(searchTerm)}
                activeOpacity={0.8}
              >
                <Text style={styles.searchBtnText}>🔍</Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <ActivityIndicator color="#c9a84c" style={{ marginTop: 12 }} />
            )}

            {/* Error Banner with Retry and Cloud Fallback */}
            {errorMessage && (
              <View style={[styles.errorCard, { backgroundColor: colors.cardBg, borderColor: 'rgba(239, 68, 68, 0.5)' }]}>
                <View style={styles.errorHeader}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={[styles.errorTitle, { color: '#f87171' }]}>Server Connection Issue</Text>
                </View>
                <Text style={[styles.errorMessage, { color: colors.textMuted }]}>{errorMessage}</Text>
                <View style={styles.errorActions}>
                  <TouchableOpacity
                    style={[styles.retryBtn, { backgroundColor: colors.gold }]}
                    onPress={() => loadRecords(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.retryBtnText, { color: colors.stone }]}>Retry Connection</Text>
                  </TouchableOpacity>
                  {currentBaseUrl !== PRODUCTION_API_URL && (
                    <TouchableOpacity
                      style={[styles.cloudBtn, { borderColor: colors.goldBorder }]}
                      onPress={handleSwitchToCloud}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.cloudBtnText, { color: colors.gold }]}>Connect to Cloud Server</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Empty State when 0 records exist */}
            {!loading && !errorMessage && deceasedRecords.length === 0 && !showResults && (
              <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
                <Text style={styles.emptyIcon}>📂</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Records Available</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                  The deceased records registry is currently empty or updating.
                </Text>
                <TouchableOpacity
                  style={[styles.refreshBtn, { backgroundColor: colors.gold }]}
                  onPress={() => loadRecords(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.refreshBtnText, { color: colors.stone }]}>Refresh Registry</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Autocomplete Search Results Overlay */}
            {showResults && (
              <View style={[styles.searchResultsContainer, { backgroundColor: colors.inputBg, borderColor: colors.goldBorder }]}>
                <View style={[styles.resultsHeader, { borderBottomColor: colors.divider }]}>
                  <Text style={[styles.resultsHeaderTitle, { color: colors.gold }]}>Search Results</Text>
                  <Text style={[styles.resultsCount, { color: colors.textMuted }]}>{searchResults.length} found</Text>
                </View>

                {searchResults.length === 0 ? (
                  <View style={styles.noResults}>
                    <Text style={[styles.noResultsText, { color: colors.textMuted }]}>No records found matching "{searchTerm}"</Text>
                  </View>
                ) : (
                  <ScrollView style={styles.resultsList} nestedScrollEnabled={true}>
                    {searchResults.map((record, index) => {
                      const gender = getGender(record);
                      const avatar = gender.toLowerCase() === 'male' ? '👨' :
                        (gender.toLowerCase() === 'female' ? '👩' : '⚰️');
                      const ref = record.ref || record.reference || record.id || 'No Ref';
                      const deathDate = record.deathDate || record.dateOfDeath || record.datePaid || '';

                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.resultCard, { borderBottomColor: colors.divider }]}
                          onPress={() => viewProfile(record)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.resultAvatar}>{avatar}</Text>
                          <View style={styles.resultInfo}>
                            {getHighlightedText(nameFunc(record), searchTerm)}
                            <View style={styles.resultMeta}>
                              <Text style={[styles.resultMetaText, { color: colors.textMuted }]}>📋 {ref}</Text>
                              <Text style={[styles.resultMetaText, { color: colors.textMuted }]}>📅 {deathDate || 'Unknown'}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          <Text style={[styles.taglineFooter, { color: colors.boneDim }]}>Preserving memory. Honoring lives. Guiding families.</Text>
        </View>
      </ScrollView>

      {/* Profile Details Modal */}
      {selectedProfile && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedProfile(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.profileCard, { backgroundColor: colors.modalBg, borderColor: colors.goldBorder }]}>
              <View style={[styles.profileHeader, { borderBottomColor: colors.divider }]}>
                <Text style={styles.profileAvatar}>
                  {getGender(selectedProfile).toLowerCase() === 'male' ? '👨' :
                    getGender(selectedProfile).toLowerCase() === 'female' ? '👩' : '⚰️'}
                </Text>
                <Text style={[styles.profileName, { color: colors.text }]}>{nameFunc(selectedProfile)}</Text>
                <Text style={[styles.profileRef, { color: colors.textMuted }]}>{selectedProfile.ref || selectedProfile.reference || selectedProfile.id || 'REF-000000'}</Text>
                <TouchableOpacity
                  style={styles.profileClose}
                  onPress={() => setSelectedProfile(null)}
                >
                  <Text style={[styles.closeText, { color: colors.textMuted }]}>&times;</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.profileBody}>
                <Text style={[styles.ripText, { color: colors.textDim }]}>Rest in Peace</Text>

                <View style={[styles.profileDetailRow, { borderBottomColor: colors.divider }]}>
                  <Text style={[styles.profileDetailLabel, { color: colors.textMuted }]}>Born</Text>
                  <Text style={[styles.profileDetailValue, { color: colors.text }]}>{formatDate(getBirthDate(selectedProfile))}</Text>
                </View>
                <View style={[styles.profileDetailRow, { borderBottomColor: colors.divider }]}>
                  <Text style={[styles.profileDetailLabel, { color: colors.textMuted }]}>Died</Text>
                  <Text style={[styles.profileDetailValue, { color: colors.text }]}>{formatDate(getDeathDate(selectedProfile))}</Text>
                </View>
                <View style={[styles.profileDetailRow, { borderBottomColor: colors.divider }]}>
                  <Text style={[styles.profileDetailLabel, { color: colors.textMuted }]}>Block / Lot</Text>
                  <Text style={[styles.profileDetailValue, { color: colors.gold }]}>
                    {selectedProfile.remarks || 'Standard Map Grid'}
                  </Text>
                </View>

                <View style={styles.profileActions}>
                  <TouchableOpacity
                    style={[styles.profileBtn, styles.profileBtnSecondary, { borderColor: colors.divider }]}
                    onPress={() => setSelectedProfile(null)}
                  >
                    <Text style={[styles.btnSecondaryText, { color: colors.text }]}>Close</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.profileBtn, styles.profileBtnPrimary]}
                    onPress={() => {
                      const locateData = {
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
                      };
                      setSelectedProfile(null);
                      if (onLocateGrave) {
                        onLocateGrave(locateData);
                      }
                    }}
                  >
                    <Text style={styles.btnPrimaryText}>Locate Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topLine: {
    height: 3,
    backgroundColor: colors.gold,
  },
  heroSection: {
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  heroTitle: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  heroTitleGold: {
    color: colors.gold,
  },
  heroSubtitle: {
    fontSize: 26,
    color: colors.text,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 40,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  searchWrap: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 40,
    zIndex: 2,
  },
  searchBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  searchBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 16,
  },
  searchResultsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 250,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 224, 208, 0.1)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  resultsHeaderTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsCount: {
    color: colors.boneMuted,
    fontSize: 11,
  },
  noResults: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: colors.boneMuted,
    fontSize: 13,
  },
  resultsList: {
    flexGrow: 0,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 224, 208, 0.05)',
  },
  resultAvatar: {
    fontSize: 22,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  resultMeta: {
    flexDirection: 'row',
    marginTop: 2,
  },
  resultMetaText: {
    color: colors.boneDim,
    fontSize: 11,
    marginRight: 16,
  },
  taglineFooter: {
    fontSize: 12,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileCard: {
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 15,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 168, 76, 0.1)',
  },
  profileAvatar: {
    fontSize: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  profileRef: {
    fontSize: 11,
    color: colors.boneDim,
    marginTop: 4,
    letterSpacing: 1.5,
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  profileClose: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: colors.boneMuted,
  },
  profileBody: {
    padding: 24,
  },
  ripText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  profileDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 224, 208, 0.05)',
  },
  profileDetailLabel: {
    color: colors.boneMuted,
    fontSize: 13,
  },
  profileDetailValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  profileBtn: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  profileBtnPrimary: {
    // backgroundColor set inline via theme
  },
  btnSecondaryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  btnPrimaryText: {
    color: colors.stone,
    fontSize: 13,
    fontWeight: '700',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gold,
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  ratingSubtitle: {
    color: colors.boneMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  starBtn: {
    padding: 6,
  },
  starEmoji: {
    fontSize: 28,
    opacity: 0.35,
  },
  starEmojiFilled: {
    opacity: 1,
  },
  ratingComment: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    height: 70,
    marginBottom: 10,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 14,
    width: '100%',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  errorActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cloudBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  refreshBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
