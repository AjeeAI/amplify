import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';

interface HeroBannerProps {
  onExplorePress: () => void;
  onStartCampaignPress: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplorePress,
  onStartCampaignPress,
}) => {
  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#4338CA', '#4F46E5', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* Top telemetry status pill */}
        <View style={styles.topRow}>
          <View style={styles.telemetryPill}>
            <View style={styles.pulsingDot} />
            <Text style={styles.telemetryText}>CIVIC BROADCAST NETWORK LIVE</Text>
          </View>
          <View style={styles.statChip}>
            <Feather name="trending-up" size={13} color="#FBBF24" />
            <Text style={styles.statChipText}>~27x Multiplier</Text>
          </View>
        </View>

        {/* Core Value Proposition Formula */}
        <View style={styles.contentBody}>
          <Text style={styles.formulaTitle}>
            $1 puts a message in front of{' '}
            <Text style={styles.formulaHighlight}>~27 people</Text>{' '}
            outside of your network.
          </Text>
          <Text style={styles.formulaSubtitle}>
            Traditional crowdfunding waits for people to find you. Amplify buys targeted real-world reach across Meta, Instagram & digital screens the moment you back.
          </Text>
        </View>

        {/* Live Metrics Row */}
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>1.84M+</Text>
            <Text style={styles.metricLabel}>Impressions Today</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>$4.2M</Text>
            <Text style={styles.metricLabel}>Amplified</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>99.4%</Text>
            <Text style={styles.metricLabel}>Audited Proofs</Text>
          </View>
        </View>

        {/* Quick Action Controls (Side-by-side pill buttons) */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryPill]}
            onPress={onExplorePress}
            activeOpacity={0.85}
          >
            <Feather name="compass" size={16} color={Colors.primaryDark} />
            <Text style={styles.primaryPillText}>Explore campaigns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryPill]}
            onPress={onStartCampaignPress}
            activeOpacity={0.85}
          >
            <Feather name="plus-circle" size={16} color="#FFFFFF" />
            <Text style={styles.secondaryPillText}>Start a campaign</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  gradientCard: {
    borderRadius: Radii.xl,
    padding: 20,
    ...Shadows.elevated,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  telemetryText: {
    color: '#E0E7FF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radii.pill,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  statChipText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
  },
  contentBody: {
    marginBottom: 18,
  },
  formulaTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    marginBottom: 8,
  },
  formulaHighlight: {
    color: '#FDE047',
    textDecorationLine: 'underline',
  },
  formulaSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 18,
    opacity: 0.95,
  },
  metricRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radii.pill,
    gap: 6,
  },
  primaryPill: {
    backgroundColor: '#FDE047',
    ...Shadows.gold,
  },
  primaryPillText: {
    color: '#1E1B4B',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  secondaryPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
