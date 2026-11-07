import { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Platform, 
  StatusBar, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import Screens
import Dashboard from './src/screens/Dashboard';
import Inquiries from './src/screens/Inquiries';
import GraveMapping from './src/screens/GraveMapping';
import Announcements from './src/screens/Announcements';
import AboutUs from './src/screens/AboutUs';

import { themeColors, Theme } from './src/theme/colors';
import { getBaseUrl } from './src/config/api';
import { getPublicSettings } from './src/services/api';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Re-export for any external consumers
export { themeColors, Theme } from './src/theme/colors';

const BASE_URL = getBaseUrl();

type ScreenType = 'dashboard' | 'inquiries' | 'mapping' | 'announcements' | 'about';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('dashboard');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [locateGraveData, setLocateGraveData] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [maintenance, setMaintenance] = useState<{ mode: boolean; message: string } | null>(null);
  const drawerAnimation = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = open

  useEffect(() => {
    getPublicSettings(BASE_URL)
      .then((data) => {
        if (data && data.maintenanceMode) {
          setMaintenance({
            mode: true,
            message: data.maintenanceMessage || 'System maintenance in progress.',
          });
        }
      })
      .catch(() => {});
  }, []);

  const colors = themeColors[theme];

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: Platform.OS !== 'web',
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
    <ErrorBoundary>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.appBg }]}>
        <StatusBar barStyle={colors.statusBar === 'light' ? 'light-content' : 'dark-content'} />
        
        {/* System Maintenance Banner (Synchronized with public settings) */}
        {maintenance?.mode && (
          <View style={styles.maintenanceBanner}>
            <Text style={styles.maintenanceIcon}>⚠️</Text>
            <Text style={styles.maintenanceText}>
              <Text style={{ fontWeight: 'bold' }}>Scheduled System Maintenance: </Text>
              {maintenance.message}
            </Text>
          </View>
        )}

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
  </ErrorBoundary>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  maintenanceBanner: {
    backgroundColor: '#7f1d1d',
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  maintenanceIcon: {
    fontSize: 13,
  },
  maintenanceText: {
    color: '#fef2f2',
    fontSize: 11,
    textAlign: 'center',
    flexShrink: 1,
  },
});
