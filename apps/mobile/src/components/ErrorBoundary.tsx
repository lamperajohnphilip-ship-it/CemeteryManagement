import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[App Crash caught by ErrorBoundary]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.badge}>SYSTEM NOTICE</Text>
            <Text style={styles.title}>ETERNAL REST</Text>
            <Text style={styles.subtitle}>Cemetery Portal Encountered an Issue</Text>
            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={this.handleReload}
              activeOpacity={0.8}
            >
              <Text style={styles.retryText}>Reload Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1814',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#2c2925',
    borderColor: 'rgba(201, 168, 76, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
  },
  badge: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#c9a84c',
    marginBottom: 8,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#f5f0e8',
    marginBottom: 4,
    ...Platform.select({
      ios: { fontFamily: 'Cinzel' },
      android: { fontFamily: 'serif' },
    }),
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(232, 224, 208, 0.65)',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 12,
    color: 'rgba(232, 224, 208, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  retryBtn: {
    backgroundColor: '#c9a84c',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 6,
  },
  retryText: {
    color: '#1a1814',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
