import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface TopTabsProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const TopTabs: React.FC<TopTabsProps> = ({ activeTab, onTabPress }) => {
  const tabs = ['For You', 'Politics', 'Economy', 'Social', 'Arts', 'Sports', 'Reels'];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onTabPress(tab)}
          >
            <Text
              style={[
                styles.label,
                activeTab === tab && styles.activeLabel,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  label: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
  },
  activeLabel: {
    color: theme.colors.primaryText,
    fontWeight: theme.typography.weights.bold,
  },
  indicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 3,
    backgroundColor: theme.colors.primaryText,
    borderRadius: 2,
  },
});
