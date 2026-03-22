import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

interface DebateProps {
  ideaTitle: string;
  description: string;
  creator: string;
  rep: number;
  proCount: number;
  contraCount: number;
}

export const DebateScreen: React.FC<DebateProps> = ({
  ideaTitle = 'Trecerea la săptămâna de lucru de 4 zile în România',
  description = 'Această dezbatere explorează impactul economic și social al reducerii timpului de muncă.',
  creator = 'Elena M.',
  rep = 92,
  proCount = 1420,
  contraCount = 890,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header / Idea Presentation */}
        <View style={styles.header}>
          <View style={styles.creatorInfo}>
            <View style={styles.avatar} />
            <Text style={styles.creatorName}>
              @{creator} • Rep <Text style={{ color: theme.colors.success }}>{rep}</Text>
            </Text>
            <View style={styles.verificationBadge}>
              <Text style={styles.verificationText}>Inițiator dezbatere</Text>
            </View>
          </View>

          <Text style={styles.title}>{ideaTitle}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Voting / Stance Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { borderLeftColor: theme.colors.success, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>PRO</Text>
            <Text style={styles.statNumber}>{proCount}</Text>
          </View>
          <View style={[styles.statBox, { borderLeftColor: theme.colors.error, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>CONTRA</Text>
            <Text style={styles.statNumber}>{contraCount}</Text>
          </View>
        </View>

        {/* Arguments List (Mock) */}
        <View style={styles.argumentsSection}>
          <Text style={styles.sectionTitle}>Argumente Principale</Text>
          
          <View style={styles.argumentCard}>
            <View style={styles.argumentHeader}>
              <Text style={styles.argumentAuthor}>@AlexD</Text>
              <View style={[styles.stanceBadge, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                <Text style={[styles.stanceText, { color: theme.colors.success }]}>PRO</Text>
              </View>
            </View>
            <Text style={styles.argumentContent}>
              Productivitatea crește atunci când angajații au mai mult timp pentru recuperare și viață personală. Studiile din Islanda și UK demonstrează acest lucru.
            </Text>
            <View style={styles.argumentFooter}>
              <Text style={styles.scoreText}>Scor: +245</Text>
              <Text style={styles.replyText}>12 Răspunsuri</Text>
            </View>
          </View>

          <View style={styles.argumentCard}>
            <View style={styles.argumentHeader}>
              <Text style={styles.argumentAuthor}>@BusinessRo</Text>
              <View style={[styles.stanceBadge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Text style={[styles.stanceText, { color: theme.colors.error }]}>CONTRA</Text>
              </View>
            </View>
            <Text style={styles.argumentContent}>
              Pentru sectorul serviciilor și HORECA, acest lucru ar însemna costuri operaționale crescute cu 20% pentru a acoperi aceleași ore de funcționare.
            </Text>
            <View style={styles.argumentFooter}>
              <Text style={styles.scoreText}>Scor: +189</Text>
              <Text style={styles.replyText}>34 Răspunsuri</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputButton}>
          <Text style={styles.inputButtonText}>Adaugă un argument...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: 40,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  creatorName: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.sm,
    marginRight: theme.spacing.sm,
  },
  verificationBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  verificationText: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
  title: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.md,
    lineHeight: 38,
  },
  description: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.md,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  statLabel: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 4,
  },
  statNumber: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  argumentsSection: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.md,
  },
  argumentCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
  },
  argumentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  argumentAuthor: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  stanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  stanceText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
  argumentContent: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  argumentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  scoreText: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.bold,
  },
  replyText: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.xs,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  inputButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 24,
  },
  inputButtonText: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.sizes.sm,
  }
});
