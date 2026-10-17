import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Campaign } from '../types';
import { Colors, Radii, Shadows } from '../constants/theme';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
  onBackCampaignPress: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onPress,
  onBackCampaignPress,
}) => {
  const percentage = Math.min(
    Math.round((campaign.currentAmount / campaign.targetAmount) * 100),
    100
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Cover Image with Badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: campaign.coverImage }} style={styles.coverImage} />
        
        {/* Top Badges */}
        <View style={styles.badgesOverlay}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{campaign.category}</Text>
          </View>
          <View style={styles.daysBadge}>
            <Feather name="clock" size={11} color="#FFFFFF" />
            <Text style={styles.daysBadgeText}>{campaign.daysRemaining}d left</Text>
          </View>
        </View>

        {/* Live Multiplier Pill at bottom of image */}
        <View style={styles.reachPillOverlay}>
          <Feather name="radio" size={12} color="#FBBF24" />
          <Text style={styles.reachPillText}>
            {(campaign.totalImpressionsDelivered / 1000).toFixed(0)}k impressions live
          </Text>
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.body}>
        {/* Creator Info & Verification */}
        <View style={styles.creatorRow}>
          <Image source={{ uri: campaign.creator.avatar }} style={styles.creatorAvatar} />
          <View style={styles.creatorText}>
            <Text style={styles.creatorName}>{campaign.creator.name}</Text>
            <View style={styles.verificationRow}>
              <MaterialIcons name="verified" size={13} color={Colors.primary} />
              <Text style={styles.verificationBadge} numberOfLines={1}>
                {campaign.creator.verificationBadge}
              </Text>
            </View>
          </View>
        </View>

        {/* Title & Editorial Hook */}
        <Text style={styles.title} numberOfLines={2}>
          {campaign.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {campaign.summary}
        </Text>

        {/* Location & Geo-fence */}
        <View style={styles.geoRow}>
          <Feather name="map-pin" size={12} color={Colors.textSecondary} />
          <Text style={styles.geoText}>
            {campaign.location} • {campaign.distanceMiles} mi radius
          </Text>
        </View>

        {/* Funding Progress Bar & Stats */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          </View>
          <View style={styles.progressStats}>
            <View>
              <Text style={styles.amountRaised}>
                ${campaign.currentAmount.toLocaleString()}
                <Text style={styles.targetAmount}> / ${campaign.targetAmount.toLocaleString()}</Text>
              </Text>
              <Text style={styles.statSub}>{campaign.backersCount} citizen backers</Text>
            </View>
            <View style={styles.percentageBox}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
          </View>
        </View>

        {/* Full-width Golden Amber Pill CTA */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackCampaignPress}
          activeOpacity={0.88}
        >
          <Feather name="zap" size={16} color="#78350F" />
          <Text style={styles.backButtonText}>Back this campaign</Text>
          <View style={styles.reachEstimatePill}>
            <Text style={styles.reachEstimateText}>$1 = 27 reach</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    ...Shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: 185,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgesOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  daysBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  reachPillOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(30, 34, 56, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  reachPillText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  creatorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  creatorText: {
    flex: 1,
  },
  creatorName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  verificationBadge: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  geoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  geoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountRaised: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  targetAmount: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  percentageBox: {
    backgroundColor: Colors.amberMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  backButton: {
    backgroundColor: Colors.amber,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    ...Shadows.gold,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
  },
  reachEstimatePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  reachEstimateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350F',
  },
});
