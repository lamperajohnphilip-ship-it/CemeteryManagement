import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Image as RNImage, 
  Platform 
} from 'react-native';
import { themeColors, Theme } from '../../App';

interface ScreenProps {
  baseUrl: string;
  theme?: Theme;
}

interface DevCardProps {
  imageUri: string;
  name: string;
  role: string;
  desc: string;
  initials: string;
  avatarEmoji: string;
  theme?: Theme;
}

function DeveloperCard({ imageUri, name, role, desc, initials, avatarEmoji, theme = 'dark' }: DevCardProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
  const [imgError, setImgError] = useState(false);

  return (
    <View style={[styles.developerCard, { backgroundColor: colors.appBg, borderColor: colors.goldBorder }]}>
      <View style={[styles.developerImageContainer, { borderColor: colors.gold }]}>
        {!imgError ? (
          <RNImage 
            source={{ uri: imageUri }} 
            style={styles.developerImage} 
            onError={() => setImgError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.fallbackAvatar, { backgroundColor: colors.cardBg }]}>
            <Text style={styles.fallbackEmoji}>{avatarEmoji}</Text>
            <Text style={[styles.fallbackInitials, { color: colors.gold }]}>{initials}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.developerName, { color: colors.text }]}>{name}</Text>
      <Text style={[styles.developerRole, { color: colors.gold }]}>{role}</Text>
      <Text style={[styles.developerDesc, { color: colors.textMuted }]}>{desc}</Text>
    </View>
  );
}

export default function AboutUs({ baseUrl, theme = 'dark' }: ScreenProps) {
  const colors = themeColors[theme];
  const styles = getStyles(colors);
  const features = [
    { icon: '⚰️', title: 'Deceased Inventory', desc: 'Complete digital registry of all burial records with payment tracking and status updates.' },
    { icon: '📅', title: 'Inquiry System', desc: 'Online booking for burial services, plot reservations, and records retrieval.' },
    { icon: '💰', title: 'Payment Records', desc: 'Integrated payment tracking with status indicators (Paid, Partial, Not Yet Paid).' },
    { icon: '🗺️', title: 'Grave Mapping', desc: 'Visual layout of cemetery plots for easy location and management.' },
    { icon: '📢', title: 'Announcements', desc: 'Push notifications and announcements for families and visitors.' },
    { icon: '📱', title: 'SMS Notifications', desc: 'Real-time SMS updates for inquiry confirmations and reminders.' }
  ];

  const developers = [
    {
      imageUri: `${baseUrl}/Jp.jpg`,
      name: 'John Philip Lampera',
      role: 'System Developer',
      desc: 'Full-stack developer specializing in cemetery management systems.',
      initials: 'JPL',
      avatarEmoji: '👨‍💻'
    },
    {
      imageUri: `${baseUrl}/jehsel.jpg`,
      name: 'Jehsel B. Pasion',
      role: 'UI/UX Designer',
      desc: 'Creating intuitive and dignified user experiences for families.',
      initials: 'JBP',
      avatarEmoji: '👩‍🎨'
    },
    {
      imageUri: `${baseUrl}/lydnie.jpg`,
      name: 'Lyndie U. Valerio',
      role: 'Database Manager',
      desc: 'Ensuring data integrity and system reliability.',
      initials: 'LUV',
      avatarEmoji: '👩‍💻'
    },
    {
      imageUri: `${baseUrl}/diane.jpg`,
      name: 'Gracel Diane Bioyo',
      role: 'Project Leader',
      desc: 'Coordinating development with community needs.',
      initials: 'GDB',
      avatarEmoji: '👩‍💼'
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.appBg }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.aboutHeader}>
        <Text style={[styles.aboutEyebrow, { color: colors.gold }]}>ETERNAL REST — JASAAN</Text>
        <Text style={[styles.aboutTitle, { color: colors.text }]}>
          ABOUT <Text style={[styles.aboutTitleEm, { color: colors.gold }]}>OUR</Text> SYSTEM
        </Text>
        <View style={[styles.aboutDivider, { backgroundColor: colors.gold }]} />
      </View>

      {/* Description */}
      <View style={styles.aboutDescription}>
        <Text style={[styles.descriptionText, { color: colors.boneMuted }]}>
          The <Text style={[styles.highlight, { color: colors.gold }]}>Eternal Rest Cemetery Management System</Text> is a comprehensive digital platform designed to streamline and modernize the management of the Jasaan Municipal Cemetery. Our system provides an efficient, transparent, and accessible way for families and administrators to manage burial records, inquiries, payments, and cemetery information.
        </Text>
        <Text style={[styles.descriptionText, { color: colors.boneMuted }]}>
          Developed with the community in mind, we aim to preserve the dignity of remembrance while embracing technology to serve the people of Jasaan and Misamis Oriental better.
        </Text>
      </View>

      {/* Mission / Vision Cards */}
      <View style={styles.missionVisionContainer}>
        <View style={[styles.missionCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
          <Text style={styles.cardIcon}>🎯</Text>
          <Text style={[styles.cardTitle, { color: colors.gold }]}>Our Mission</Text>
          <Text style={[styles.cardText, { color: colors.boneMuted }]}>
            To provide a seamless, dignified, and efficient cemetery management experience that honors the departed while serving the living with compassion, transparency, and respect.
          </Text>
        </View>
        
        <View style={[styles.visionCard, { backgroundColor: colors.cardBg, borderColor: colors.goldBorder }]}>
          <Text style={styles.cardIcon}>👁️</Text>
          <Text style={[styles.cardTitle, { color: colors.gold }]}>Our Vision</Text>
          <Text style={[styles.cardText, { color: colors.boneMuted }]}>
            To become the model for digital cemetery management in the Philippines, combining traditional values with modern technology to serve communities better.
          </Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          SYSTEM <Text style={[styles.sectionTitleSpan, { color: colors.gold }]}>FEATURES</Text>
        </Text>
        <View style={styles.featuresGrid}>
          {features.map((item, index) => (
            <View key={index} style={[styles.featureItem, { backgroundColor: colors.sectionBg, borderColor: colors.goldHover }]}>
              <Text style={styles.featureIcon}>{item.icon}</Text>
              <Text style={[styles.featureTitle, { color: colors.gold }]}>{item.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.textMuted }]}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Developers Section */}
      <View style={[styles.developersSection, { backgroundColor: colors.sectionBg, borderColor: colors.goldBorder }]}>
        <Text style={[styles.developersTitle, { color: colors.gold }]}>MEET THE DEVELOPERS</Text>
        <View style={styles.developersGrid}>
          {developers.map((dev, index) => (
            <DeveloperCard key={index} {...dev} theme={theme} />
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.goldHover, backgroundColor: colors.toggleRowBg }]}>
        <Text style={[styles.footerText, { color: colors.boneDim }]}>
          Eternal Rest · Jasaan  |  Municipality of Jasaan Cemetery Portal  |  About Us
        </Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  aboutHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  aboutEyebrow: {
    fontSize: 10,
    letterSpacing: 4,
    color: colors.gold, // --gold
    marginBottom: 10,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  aboutTitle: {
    fontSize: 28,
    color: colors.text, // --cream
    textAlign: 'center',
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  aboutTitleEm: {
    color: colors.gold, // --gold
  },
  aboutDivider: {
    width: 80,
    height: 1,
    marginTop: 15,
  },
  aboutDescription: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.boneMuted, // --bone opacity
    textAlign: 'center',
    marginBottom: 15,
  },
  highlight: {
    color: colors.gold, // --gold
    fontWeight: 'bold',
  },
  missionVisionContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 30,
  },
  missionCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
  },
  visionCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 24,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: colors.gold,
    marginBottom: 10,
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.boneDim,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  sectionTitleSpan: {
    color: colors.gold,
  },
  featuresGrid: {
    gap: 16,
  },
  featureItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.gold,
    marginBottom: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  featureDesc: {
    fontSize: 13,
    color: colors.boneMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
  developersSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  developersTitle: {
    fontSize: 18,
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  developersGrid: {
    gap: 16,
  },
  developerCard: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  developerImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: 3,
    marginBottom: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  developerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  fallbackAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  fallbackInitials: {
    fontSize: 12,
    color: colors.gold,
    fontWeight: 'bold',
  },
  developerName: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  developerRole: {
    fontSize: 9,
    letterSpacing: 1,
    color: colors.gold,
    marginBottom: 8,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  developerDesc: {
    fontSize: 12,
    color: colors.boneMuted,
    lineHeight: 16,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    letterSpacing: 1,
    color: colors.boneDim,
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
});
