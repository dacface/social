import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarLarge} />
          <Text style={styles.name}>Cristian Popescu</Text>
          <View style={styles.verificationRow}>
            <Text style={styles.handle}>@cristianp</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Analist Economic</Text>
            </View>
          </View>

          <Text style={styles.bio}>
            Economist pasionat de politici publice și impactul lor social. 
            Împărtășesc idei despre sustenabilitate și inovație.
          </Text>

          {/* Reputation Stats */}
          <View style={styles.reputationContainer}>
            <View style={styles.repBox}>
              <Text style={styles.repLabel}>Reputație Globală</Text>
              <Text style={styles.repValue}>98.5</Text>
            </View>
            <View style={styles.repBox}>
              <Text style={styles.repLabel}>Domeniu: Economie</Text>
              <Text style={styles.repValue}>99.2</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Urmărește</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Mesaj</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs */}
        <View style={styles.tabsContainer}>
          {['Dezbateri', 'Argumente', 'Reels', 'Posts'].map((tab, idx) => (
            <View key={tab} style={[styles.profileTab, idx === 0 && styles.activeProfileTab]}>
              <Text style={[styles.profileTabLabel, idx === 0 && styles.activeProfileTabLabel]}>{tab}</Text>
            </View>
          ))}
        </View>

        {/* Content Grid (Mock) */}
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.gridItem}>
              <Text style={styles.gridItemText}>Dezbatere #{item}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  name: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 4,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  handle: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.sm,
  },
  badge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  badgeText: {
    color: theme.colors.accentPurple,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
  bio: {
    color: theme.colors.primaryText,
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  reputationContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  repBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  repLabel: {
    color: theme.colors.secondaryText,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  repValue: {
    color: theme.colors.success,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.colors.primaryText,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontWeight: theme.typography.weights.bold,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primaryText,
    fontWeight: theme.typography.weights.bold,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileTab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  activeProfileTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primaryText,
  },
  profileTabLabel: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  activeProfileTabLabel: {
    color: theme.colors.primaryText,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: theme.colors.background,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  gridItemText: {
    color: theme.colors.secondaryText,
    fontSize: 10,
    textAlign: 'center',
  }
});
