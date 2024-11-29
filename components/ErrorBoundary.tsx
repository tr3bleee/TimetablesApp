import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { 
    hasError: false, 
    error: null 
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Что-то пошло не так</Text>
        </View>
      );
    }

    return this.props.children;
  }
} 