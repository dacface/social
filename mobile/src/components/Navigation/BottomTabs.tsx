import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface BottomTabsProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'create', label: '+' },
    { id: 'notifications', label: 'Notif' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabPress(tab.id)}
        >
          {tab.id === 'create' ? (
            <View style={styles.createButton}>
              <Text style={styles.createLabel}>{tab.label}</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.label,
                activeTab === tab.id && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
  },
  activeLabel: {
    color: theme.colors.primaryText,
    fontWeight: theme.typography.weights.bold,
  },
  createButton: {
    width: 48,
    height: 36,
    backgroundColor: theme.colors.primaryText,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createLabel: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
});
