import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { themeColors, Theme } from '../../App';

interface ScreenProps {
  baseUrl: string;
  locateGraveData?: any;
  theme?: Theme;
}

export default function GraveMapping({ baseUrl, locateGraveData, theme = 'dark' }: ScreenProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
  const [opening, setOpening] = useState(false);

  const mapUrl = locateGraveData
    ? `${baseUrl}/grave-mapping?locate=${encodeURIComponent(JSON.stringify(locateGraveData))}`
    : `${baseUrl}/grave-mapping`;

  const openMap = async () => {
    try {
      setOpening(true);
      const supported = await Linking.canOpenURL(mapUrl);
      if (supported) {
        await Linking.openURL(mapUrl);
      } else {
        // Fallback: open without locate param
        await Linking.openURL(`${baseUrl}/grave-mapping`);
      }
    } catch (e) {
      console.error('Failed to open map URL:', e);
    } finally {
      setOpening(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.appBg }]} contentContainerStyle={styles.content}>
      {/* Top gold line */}
      <View style={styles.topLine} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.gold }]}>ETERNAL REST · JASAAN</Text>
        <Text style={[styles.title, { color: colors.text }]}>GRAVE{'\n'}<Text style={[styles.titleGold, { color: colors.gold }]}>MAPPING</Text></Text>
        <View style={[styles.divider, { backgroundColor: colors.gold }]} />
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Interactive 3D Cemetery Plot Navigator
        </Text>
      </View>

      {/* Locate Info Card (shown if a grave was selected from Dashboard) */}
      {locateGraveData ? (
        <View style={[styles.locateCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
          <View style={[styles.locateBadge, { backgroundColor: colors.goldHover, borderColor: colors.goldBorder }]}>
            <Text style={[styles.locateBadgeText, { color: colors.gold }]}>📍 LOCATING GRAVE</Text>
          </View>
          <Text style={[styles.locateName, { color: colors.text }]}>{locateGraveData.name}</Text>
          <View style={styles.locateDetails}>
            {locateGraveData.plot && (
              <View style={[styles.locateRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.locateKey, { color: colors.boneMuted }]}>PLOT</Text>
                <Text style={[styles.locateVal, { color: colors.text }]}>{locateGraveData.plot}</Text>
              </View>
            )}
            {locateGraveData.section && (
              <View style={[styles.locateRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.locateKey, { color: colors.boneMuted }]}>SECTION</Text>
                <Text style={[styles.locateVal, { color: colors.text }]}>{locateGraveData.section}</Text>
              </View>
            )}
            {locateGraveData.born && (
              <View style={[styles.locateRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.locateKey, { color: colors.boneMuted }]}>BORN</Text>
                <Text style={[styles.locateVal, { color: colors.text }]}>{locateGraveData.born}</Text>
              </View>
            )}
            {locateGraveData.died && (
              <View style={[styles.locateRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.locateKey, { color: colors.boneMuted }]}>DIED</Text>
                <Text style={[styles.locateVal, { color: colors.text }]}>{locateGraveData.died}</Text>
              </View>
            )}
            {locateGraveData.kin && (
              <View style={[styles.locateRow, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.locateKey, { color: colors.boneMuted }]}>NEXT OF KIN</Text>
                <Text style={[styles.locateVal, { color: colors.text }]}>{locateGraveData.kin}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.locateHint, { color: colors.boneMuted }]}>
            Tap the button below to open the interactive 3D map and automatically fly to this plot.
          </Text>
        </View>
      ) : (
        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
          <Text style={styles.infoIcon}>🗺️</Text>
          <Text style={[styles.infoTitle, { color: colors.gold }]}>Interactive Cemetery Map</Text>
          <Text style={[styles.infoDesc, { color: colors.boneMuted }]}>
            Explore the Jasaan Municipal Cemetery in 3D. Navigate burial sections, locate specific graves, and view plot information.
          </Text>
        </View>
      )}

      {/* Open Map Button */}
      <TouchableOpacity
        style={[styles.openBtn, { backgroundColor: colors.gold, shadowColor: colors.gold }, opening && styles.openBtnDisabled]}
        onPress={openMap}
        activeOpacity={0.8}
        disabled={opening}
      >
        {opening ? (
          <ActivityIndicator color={colors.stone} size="small" />
        ) : (
          <>
            <Text style={styles.openBtnIcon}>🗺️</Text>
            <Text style={[styles.openBtnText, { color: colors.stone }]}>
              {locateGraveData ? 'OPEN MAP & LOCATE GRAVE' : 'OPEN INTERACTIVE MAP'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={[styles.openNote, { color: colors.boneDim }]}>
        Opens in your device browser
      </Text>

      {/* Feature Grid */}
      <View style={styles.featuresGrid}>
        {[
          { icon: '🔍', title: 'Search Graves', desc: 'Find any burial plot by name or reference number' },
          { icon: '📐', title: '3D Navigation', desc: 'Rotate, zoom and fly-to any section of the cemetery' },
          { icon: '📋', title: 'Plot Details', desc: 'View complete burial records for each grave marker' },
          { icon: '📍', title: 'Auto-Locate', desc: 'Direct flyto navigation when launched from a record search' },
        ].map((f, i) => (
          <View key={i} style={[styles.featureItem, { backgroundColor: colors.cardBg, borderColor: colors.goldHover }]}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={[styles.featureTitle, { color: colors.gold }]}>{f.title}</Text>
            <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{f.desc}</Text>
          </View>
        ))}
      </View>

      {/* Note about Expo Go */}
      <View style={[styles.noteBox, { backgroundColor: colors.goldHover, borderColor: colors.goldBorder }]}>
        <Text style={[styles.noteText, { color: colors.textMuted }]}>
          💡 The 3D map uses WebGL and opens in your browser for the best experience.
        </Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 50,
  },
  topLine: {
    height: 3,
    backgroundColor: colors.gold,
  },
  header: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 3,
    color: colors.gold,
    marginBottom: 12,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  title: {
    fontSize: 34,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  titleGold: {
    color: colors.gold,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: colors.gold,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 1,
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },

  // Locate card (when navigated from Dashboard → Locate Now)
  locateCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
  },
  locateBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  locateBadgeText: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.gold,
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  locateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  locateDetails: {
    gap: 8,
    marginBottom: 16,
  },
  locateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  locateKey: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.boneDim,
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  locateVal: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  locateHint: {
    fontSize: 11,
    color: colors.boneDim,
    fontStyle: 'italic',
    lineHeight: 16,
  },

  // Info card (default state)
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 8,
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  infoDesc: {
    fontSize: 13,
    color: colors.boneMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Open Map button
  openBtn: {
    marginHorizontal: 20,
    height: 54,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  openBtnDisabled: {
    opacity: 0.6,
  },
  openBtnIcon: {
    fontSize: 18,
  },
  openBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.stone,
    letterSpacing: 1,
  },
  openNote: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.boneDim,
    marginTop: 8,
    marginBottom: 24,
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },

  // Feature grid
  featuresGrid: {
    marginHorizontal: 20,
    gap: 12,
  },
  featureItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  featureIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    flex: 1,
  },

  // Note box
  noteBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  noteText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
