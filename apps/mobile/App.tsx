import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Platform, 
  StatusBar as RNStatusBar, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import Screens
import Dashboard from './src/screens/Dashboard';
import Inquiries from './src/screens/Inquiries';
import GraveMapping from './src/screens/GraveMapping';
import Announcements from './src/screens/Announcements';
import AboutUs from './src/screens/AboutUs';

import Constants from 'expo-constants';

// Base URL configuration — dynamically resolved from Expo dev server host.
// This avoids hardcoding IP addresses that change between networks.
// In production, replace this with your deployed server URL.
function getBaseUrl(): string {
  // In Expo Go / dev client, Constants.expoConfig.hostUri is the dev machine's IP + port
  const host = Constants.expoConfig?.hostUri;
  if (host) {
    // hostUri is "192.168.x.x:8081" — we replace the Expo port with the web server port
    const ip = host.split(':')[0];
    return `http://${ip}:3000`;
  }
  // Fallback for production or if hostUri is unavailable
  return 'http://localhost:3000';
}

const BASE_URL = getBaseUrl();


type ScreenType = 'dashboard' | 'inquiries' | 'mapping' | 'announcements' | 'about';
export type Theme = 'dark' | 'light';

// ─────────────────────────────────────────────────────────────────
// Centralized theme colors matching globals.css / admin portal
// ─────────────────────────────────────────────────────────────────
export const themeColors = {
  dark: {
    // App shell
    appBg:           '#1a1814',
    headerBg:        'rgba(26,24,20,0.95)',
    headerBorder:    'rgba(201,168,76,0.15)',
    // Drawer
    drawerBg:        '#2c2925',
    drawerBorder:    'rgba(201,168,76,0.18)',
    drawerHeaderBg:  'rgba(26,24,20,0.6)',
    drawerHeaderBorder: 'rgba(201,168,76,0.12)',
    overlayBg:       '#0a0908',
    // Nav item
    drawerItemBg:    'transparent',
    drawerItemActiveBg: 'rgba(201,168,76,0.06)',
    drawerItemBorderActive: '#c9a84c',
    drawerTextColor: 'rgba(232,224,208,0.65)',
    drawerTextActive: '#c9a84c',
    // Theme toggle pill
    toggleRowBg:     'rgba(26,24,20,0.4)',
    toggleRowBorder: 'rgba(201,168,76,0.15)',
    toggleBtnColor:  'rgba(232,224,208,0.4)',
    toggleActiveBg:  '#c9a84c',
    toggleActiveColor: '#1a1814',
    // Generic palette
    gold:            '#c9a84c',
    goldBorder:      'rgba(201,168,76,0.3)',
    goldHover:       'rgba(201,168,76,0.06)',
    stone:           '#1a1814',
    ash:             '#2c2925',
    fog:             '#3d3830',
    bone:            '#f5f0e8',
    boneMuted:       'rgba(232,224,208,0.65)',
    boneDim:         'rgba(232,224,208,0.3)',
    text:            '#f5f0e8',
    textMuted:       'rgba(232,224,208,0.5)',
    textDim:         '#7A7570',
    inputBg:         '#2c2925',
    inputBorder:     'rgba(201,168,76,0.3)',
    cardBg:          '#2c2925',
    sectionBg:       '#3d3830',
    modalBg:         '#2c2925',
    modalOverlay:    'rgba(10,9,8,0.85)',
    divider:         'rgba(232,224,208,0.05)',
    statusBar:       'light' as 'light' | 'dark',
  },
  light: {
    // App shell
    appBg:           '#f8f9fa',
    headerBg:        'rgba(255,255,255,0.97)',
    headerBorder:    '#e2e8f0',
    // Drawer
    drawerBg:        '#ffffff',
    drawerBorder:    '#e2e8f0',
    drawerHeaderBg:  '#f1f5f9',
    drawerHeaderBorder: '#e2e8f0',
    overlayBg:       'rgba(15,23,42,0.3)',
    // Nav item
    drawerItemBg:    'transparent',
    drawerItemActiveBg: '#f5f0e8',
    drawerItemBorderActive: '#a16207',
    drawerTextColor: '#475569',
    drawerTextActive: '#854d0e',
    // Theme toggle pill
    toggleRowBg:     '#f1f5f9',
    toggleRowBorder: '#cbd5e1',
    toggleBtnColor:  '#64748b',
    toggleActiveBg:  '#a16207',
    toggleActiveColor: '#ffffff',
    // Generic palette
    gold:            '#a16207',
    goldBorder:      'rgba(161,98,7,0.25)',
    goldHover:       'rgba(161,98,7,0.08)',
    stone:           '#f8f9fa',
    ash:             '#ffffff',
    fog:             '#f1f5f9',
    bone:            '#111111',
    boneMuted:       '#475569',
    boneDim:         '#64748b',
    text:            '#111111',
    textMuted:       '#475569',
    textDim:         '#64748b',
    inputBg:         '#f8fafc',
    inputBorder:     '#cbd5e1',
    cardBg:          '#ffffff',
    sectionBg:       '#f1f5f9',
    modalBg:         '#ffffff',
    modalOverlay:    'rgba(15,23,42,0.5)',
    divider:         '#e2e8f0',
    statusBar:       'dark' as 'light' | 'dark',
  },
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('dashboard');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [locateGraveData, setLocateGraveData] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const drawerAnimation = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = open

  const colors = themeColors[theme];

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  const navigateTo = (screen: ScreenType) => {
    if (screen !== 'mapping') {
      setLocateGraveData(null);
    }
    setActiveScreen(screen);
    closeDrawer();
  };

  const handleLocateGrave = (graveData: any) => {
    setLocateGraveData(graveData);
    setActiveScreen('mapping');
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    closeDrawer();
  };

  // Interpolations for smooth transitions
  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const overlayOpacity = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard baseUrl={BASE_URL} onLocateGrave={handleLocateGrave} theme={theme} />;
      case 'inquiries':
        return <Inquiries baseUrl={BASE_URL} theme={theme} />;
      case 'mapping':
        return <GraveMapping baseUrl={BASE_URL} locateGraveData={locateGraveData} theme={theme} />;
      case 'announcements':
        return <Announcements baseUrl={BASE_URL} theme={theme} />;
      case 'about':
        return <AboutUs baseUrl={BASE_URL} theme={theme} />;
      default:
        return <Dashboard baseUrl={BASE_URL} onLocateGrave={handleLocateGrave} theme={theme} />;
    }
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard':    return 'ETERNAL REST';
      case 'inquiries':   return 'INQUIRIES';
      case 'mapping':     return 'GRAVE MAPPING';
      case 'announcements': return 'ANNOUNCEMENTS';
      case 'about':       return 'ABOUT US';
      default:            return 'ETERNAL REST';
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <StatusBar style={colors.statusBar} backgroundColor={colors.headerBg} />
        
        {/* Native App Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
          <TouchableOpacity style={styles.menuBtn} onPress={openDrawer} activeOpacity={0.7}>
            <View style={[styles.menuBtnLine, { backgroundColor: colors.gold }]} />
            <View style={[styles.menuBtnLine, { marginVertical: 5, backgroundColor: colors.gold }]} />
            <View style={[styles.menuBtnLine, { backgroundColor: colors.gold }]} />
          </TouchableOpacity>
          
          <View style={styles.navLogo}>
            <Feather name="map-pin" size={16} color={colors.gold} style={styles.logoPin} />
            <Text style={[styles.navLogoText, { color: colors.gold }]}>{getScreenTitle()}</Text>
          </View>
          
          {/* Empty space for structural balance */}
          <View style={{ width: 28 }} />
        </View>

        {/* Main Screen Content Container */}
        <View style={styles.screenContent}>
          {renderActiveScreen()}
        </View>

        {/* Overlay */}
        {drawerVisible && (
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity, backgroundColor: colors.overlayBg }]} />
          </TouchableWithoutFeedback>
        )}

        {/* Slide-out Navigation Drawer */}
        <Animated.View style={[
          styles.drawer,
          {
            backgroundColor: colors.drawerBg,
            borderRightColor: colors.drawerBorder,
            transform: [{ translateX: drawerTranslateX }],
          }
        ]}>
          {/* Drawer Header Brand */}
          <View style={[styles.drawerHeader, {
            backgroundColor: colors.drawerHeaderBg,
            borderBottomColor: colors.drawerHeaderBorder,
          }]}>
            <View style={styles.drawerBrand}>
              <Feather name="map-pin" size={16} color={colors.gold} style={styles.drawerLogoPin} />
              <Text style={[styles.drawerBrandText, { color: colors.gold }]}>ETERNAL REST</Text>
            </View>
            <Text style={[styles.drawerTagline, { color: colors.boneDim }]}>Municipality of Jasaan · Cemetery Portal</Text>
          </View>

          {/* Drawer Body Nav Items */}
          <View style={styles.drawerBody}>
            {[
              { screen: 'dashboard',     icon: 'layout',   label: 'DASHBOARD' },
              { screen: 'inquiries',     icon: 'clock',    label: 'INQUIRIES' },
              { screen: 'mapping',       icon: 'map',      label: 'GRAVE MAPPING' },
              { screen: 'announcements', icon: 'bell',     label: 'ANNOUNCEMENTS' },
              { screen: 'about',         icon: 'info',     label: 'ABOUT US' },
            ].map(({ screen, icon, label }) => {
              const isActive = activeScreen === screen;
              return (
                <TouchableOpacity
                  key={screen}
                  style={[
                    styles.drawerItem,
                    {
                      backgroundColor: isActive ? colors.drawerItemActiveBg : colors.drawerItemBg,
                      borderLeftColor: isActive ? colors.drawerItemBorderActive : 'transparent',
                    }
                  ]}
                  onPress={() => navigateTo(screen as ScreenType)}
                >
                  <Feather
                    name={icon as any}
                    size={18}
                    color={isActive ? colors.gold : colors.drawerTextColor}
                    style={styles.drawerItemIcon}
                  />
                  <Text style={[
                    styles.drawerItemText,
                    { color: isActive ? colors.drawerTextActive : colors.drawerTextColor }
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Theme Toggle Footer */}
          <View style={[styles.drawerFooter, { borderTopColor: colors.drawerHeaderBorder }]}>
            <Text style={[styles.themeLabel, { color: colors.boneDim }]}>THEME</Text>
            <View style={[styles.themeToggleRow, {
              backgroundColor: colors.toggleRowBg,
              borderColor: colors.toggleRowBorder,
            }]}>
              {/* Dark Mode Button */}
              <TouchableOpacity
                style={[
                  styles.themeBtn,
                  theme === 'dark' && { backgroundColor: colors.toggleActiveBg }
                ]}
                onPress={() => handleThemeChange('dark')}
                activeOpacity={0.8}
              >
                <Feather
                  name="moon"
                  size={13}
                  color={theme === 'dark' ? colors.toggleActiveColor : colors.toggleBtnColor}
                />
                <Text style={[
                  styles.themeBtnText,
                  { color: theme === 'dark' ? colors.toggleActiveColor : colors.toggleBtnColor }
                ]}>DARK</Text>
              </TouchableOpacity>

              {/* Light Mode Button */}
              <TouchableOpacity
                style={[
                  styles.themeBtn,
                  theme === 'light' && { backgroundColor: colors.toggleActiveBg }
                ]}
                onPress={() => handleThemeChange('light')}
                activeOpacity={0.8}
              >
                <Feather
                  name="sun"
                  size={13}
                  color={theme === 'light' ? colors.toggleActiveColor : colors.toggleBtnColor}
                />
                <Text style={[
                  styles.themeBtnText,
                  { color: theme === 'light' ? colors.toggleActiveColor : colors.toggleBtnColor }
                ]}>LIGHT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  menuBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtnLine: {
    width: 22,
    height: 2,
  },
  navLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPin: {
    fontSize: 16,
    marginRight: 6,
  },
  navLogoText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 3,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  screenContent: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 149,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    borderRightWidth: 1,
    zIndex: 150,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 20,
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    padding: 24,
    borderBottomWidth: 1,
  },
  drawerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  drawerLogoPin: {
    fontSize: 16,
    marginRight: 6,
  },
  drawerBrandText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  drawerTagline: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  drawerBody: {
    flex: 1,
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderLeftWidth: 3,
  },
  drawerItemIcon: {
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '500',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
  },
  themeLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '600',
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
  themeToggleRow: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 3,
    overflow: 'hidden',
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 5,
  },
  themeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    ...Platform.select({
      ios: { fontFamily: 'DM Mono' },
      android: { fontFamily: 'monospace' },
    }),
  },
});
