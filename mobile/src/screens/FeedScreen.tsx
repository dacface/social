import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import { theme } from '../theme';
import { TopTabs } from '../components/Navigation/TopTabs';

const { height, width } = Dimensions.get('window');

// Mock Data for the full-screen feed
const mockFeeds = [
  { id: '1', title: 'Impozitul progresiv în România', type: 'debate', creator: 'IonP', comments: 142, rep: 89 },
  { id: '2', title: 'Viitorul AI în educație', type: 'post', creator: 'MariaS', comments: 56, rep: 94 },
];

export const FeedScreen = () => {
  const [activeTab, setActiveTab] = useState('For You');

  const renderItem = ({ item }: { item: typeof mockFeeds[0] }) => {
    return (
      <View style={styles.postContainer}>
        {/* Mock background for full screen effect */}
        <View style={styles.contentBackground}>
          <View style={styles.textOverlay}>
            <View style={styles.creatorInfo}>
              <View style={styles.avatar} />
              <Text style={styles.creatorName}>@{item.creator} • Rep <Text style={{color: theme.colors.success}}>{item.rep}</Text></Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            {item.type === 'debate' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>DEZBATERE</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right side actions */}
        <View style={styles.rightActions}>
          <View style={styles.actionButton}>
            <View style={styles.iconPlaceholder} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </View>
          <View style={styles.actionButton}>
            <View style={styles.iconPlaceholder} />
            <Text style={styles.actionText}>Share</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopTabs activeTab={activeTab} onTabPress={setActiveTab} />
      <FlatList
        data={mockFeeds}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled // This is what gives the TikTok-style scrolling
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  postContainer: {
    height: height,
    width: width,
    backgroundColor: theme.colors.surface,
  },
  contentBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
    paddingBottom: 100, // Leave room for bottom navigation
  },
  textOverlay: {
    zIndex: 2,
  },
  title: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.sm,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  creatorName: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  badge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
  },
  badgeText: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  rightActions: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: 120, // Above bottom nav
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 4,
  },
  actionText: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
  },
});
