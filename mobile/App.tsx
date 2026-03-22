import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { theme } from './src/theme';
import { BottomTabs } from './src/components/Navigation/BottomTabs';
import { FeedScreen } from './src/screens/FeedScreen';
import { DebateScreen } from './src/screens/DebateScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Simple manual routing for the MVP demonstration
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <FeedScreen />;
      case 'explore':
        return <DebateScreen 
          ideaTitle="Trecerea la săptămâna de lucru de 4 zile în România"
          description="Această dezbatere explorează impactul economic și social al reducerii timpului de muncă."
          creator="AlexM"
          rep={95}
          proCount={120}
          contraCount={45}
        />;
      case 'profile':
        return <ProfileScreen />;
      default:
        // Fallback to feed for any unimplemented tab
        return <FeedScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Active Screen */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Persistent Bottom Navigation */}
      <BottomTabs activeTab={activeTab} onTabPress={setActiveTab} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screenContainer: {
    flex: 1,
  }
});
