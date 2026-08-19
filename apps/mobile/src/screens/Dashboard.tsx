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
import { themeColors, Theme } from '../../App';

interface ScreenProps {
  baseUrl: string;
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
  const [deceasedRecords, setDeceasedRecords] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  // Animation values
  const searchAnim = useRef(new Animated.Value(0)).current;

  const loadRecords = async (showIndicator = true) => {
    try {
      if (showIndicator) setLoading(true);
      const response = await fetch(`${baseUrl}/api/deceased`);
      const data = await response.json();
      if (data.success && data.records) {
        const dbRecords = data.records.map((r: any) => ({
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
          gender: 'Male', // Default fallback
          civilStatus: 'Single',
          nationality: 'Filipino'
        }));
        setDeceasedRecords(dbRecords);
      }
    } catch (e) {
      console.error('Error fetching records in mobile app:', e);
    } finally {
      if (showIndicator) setLoading(false);
    }
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

    // Trigger rating modal after 12 seconds if not rated yet
    const timer = setTimeout(() => {
      setShowRatingModal(true);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
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

    Animated.spring(searchAnim, {
      toValue: 1,
      useNativeDriver: true,
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
            <Text key={i} style={{ backgroundColor: colors.goldBorder, color: colors.cream || colors.appBg }}>{part}</Text>
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

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    
    // Sync rating feedback to backend
    try {
      await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'MobileUser_' + Math.floor(Math.random() * 10000),
          rating,
          comment: ratingComment
        })
      });
    } catch (err) {
      console.error('Error syncing rating feedback to backend:', err);
    }

    // Success feedback
    alert('Thank you for your feedback!');
    setShowRatingModal(false);
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

      {/* Rating / Feedback Modal */}
      {showRatingModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRatingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.profileCard, { backgroundColor: colors.modalBg, borderColor: colors.goldBorder }]}>
              <View style={[styles.profileHeader, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.ratingTitle, { color: colors.gold }]}>Enjoying the Portal?</Text>
                <TouchableOpacity
                  style={styles.profileClose}
                  onPress={() => setShowRatingModal(false)}
                >
                  <Text style={[styles.closeText, { color: colors.textMuted }]}>&times;</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.profileBody, { alignItems: 'center' }]}>
                <Text style={[styles.ratingSubtitle, { color: colors.boneMuted }]}>Please take a moment to rate your experience.</Text>

                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      style={styles.starBtn}
                    >
                      <Text style={[styles.starEmoji, rating >= star && styles.starEmojiFilled]}>
                        ⭐
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={[styles.ratingComment, { backgroundColor: colors.inputBg, borderColor: colors.goldBorder, color: colors.text }]}
                  placeholder="Tell us what you think (optional)"
                  placeholderTextColor={colors.boneDim}
                  value={ratingComment}
                  onChangeText={setRatingComment}
                  multiline={true}
                  numberOfLines={3}
                />

                <View style={styles.profileActions}>
                  <TouchableOpacity
                    style={[styles.profileBtn, styles.profileBtnSecondary, { borderColor: colors.divider }]}
                    onPress={() => setShowRatingModal(false)}
                  >
                    <Text style={[styles.btnSecondaryText, { color: colors.text }]}>Maybe Later</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.profileBtn, styles.profileBtnPrimary, { backgroundColor: colors.gold }]}
                    onPress={handleRatingSubmit}
                  >
                    <Text style={[styles.btnPrimaryText, { color: colors.stone }]}>Submit Feedback</Text>
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
});
