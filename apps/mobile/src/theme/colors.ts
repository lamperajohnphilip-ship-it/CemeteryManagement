export type Theme = 'dark' | 'light';

export interface ThemeColors {
  appBg: string;
  headerBg: string;
  headerBorder: string;
  drawerBg: string;
  drawerBorder: string;
  drawerHeaderBg: string;
  drawerHeaderBorder: string;
  overlayBg: string;
  drawerItemBg: string;
  drawerItemActiveBg: string;
  drawerItemBorderActive: string;
  drawerTextColor: string;
  drawerTextActive: string;
  toggleRowBg: string;
  toggleRowBorder: string;
  toggleBtnColor: string;
  toggleActiveBg: string;
  toggleActiveColor: string;
  gold: string;
  goldBorder: string;
  goldHover: string;
  stone: string;
  ash: string;
  fog: string;
  bone: string;
  boneMuted: string;
  boneDim: string;
  text: string;
  textMuted: string;
  textDim: string;
  inputBg: string;
  inputBorder: string;
  cardBg: string;
  sectionBg: string;
  modalBg: string;
  modalOverlay: string;
  divider: string;
  statusBar: 'light' | 'dark';
}

export const themeColors: Record<Theme, ThemeColors> = {
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
    statusBar:       'light',
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
    statusBar:       'dark',
  },
};
