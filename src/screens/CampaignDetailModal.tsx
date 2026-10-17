import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Modal,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Campaign } from '../types';
import { Colors, Radii, Shadows } from '../constants/theme';
import { LiveAdPreview } from '../components/LiveAdPreview';

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  visible: boolean;
  onClose: () => void;
  onBackCampaign: (campaign: Campaign) => void;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  campaign,
  visible,
  onClose,
  onBackCampaign,
}) => {
  if (!campaign) return null;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const percentage = Math.min(
    Math.round((campaign.currentAmount / campaign.targetAmount) * 100),
    100
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Amplify civic impact: Back "${campaign.title}" — $1 puts this message in front of 27 people!`,
        url: 'https://amplify.social/campaign/' + campaign.id,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        {/* Sticky Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.iconCircle} onPress={onClose} activeOpacity={0.7}>
            <Feather name="x" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerNavTitle} numberOfLines={1}>
              {campaign.title}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => setIsBookmarked(!isBookmarked)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? Colors.primary : Colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle} onPress={handleShare} activeOpacity={0.7}>
              <Feather name="share-2" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Story Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          <View style={styles.heroImageContainer}>
            <Image source={{ uri: campaign.coverImage }} style={styles.heroImage} />
            <View style={styles.heroOverlayBadge}>
              <Text style={styles.heroOverlayBadgeText}>{campaign.category}</Text>
            </View>
          </View>

          <View style={styles.mainPadding}>
            {/* Title & Tagline */}
            <Text style={styles.titleText}>{campaign.title}</Text>
            <Text style={styles.summaryLead}>{campaign.summary}</Text>

            {/* Creator Card */}
            <View style={styles.creatorBox}>
              <Image source={{ uri: campaign.creator.avatar }} style={styles.creatorAvatarLarge} />
              <View style={styles.creatorMeta}>
                <Text style={styles.creatorNameLarge}>{campaign.creator.name}</Text>
                <Text style={styles.creatorOrg}>{campaign.creator.organization}</Text>
                <View style={styles.creatorBadgeRow}>
                  <MaterialIcons name="verified" size={14} color={Colors.primary} />
                  <Text style={styles.creatorBadgeText}>{campaign.creator.verificationBadge}</Text>
                </View>
              </View>
            </View>

            {/* Impact Metric Banner */}
            <View style={styles.impactHighlightBanner}>
              <View style={styles.impactLeft}>
                <Feather name="zap" size={24} color="#F59E0B" />
                <View>
                  <Text style={styles.impactTitle}>Dynamic Broadcast Delivery</Text>
                  <Text style={styles.impactSub}>$1 = 27 real-world targeted impressions</Text>
                </View>
              </View>
              <View style={styles.impactMetricPill}>
                <Text style={styles.impactMetricValue}>
                  {(campaign.totalImpressionsDelivered / 1000).toFixed(0)}k
                </Text>
                <Text style={styles.impactMetricUnit}>Sent</Text>
              </View>
            </View>

            {/* 3-Stage Independent Audit Review Process */}
            <View style={styles.auditProcessCard}>
              <View style={styles.auditHeaderRow}>
                <View style={styles.auditIconContainer}>
                  <Feather name="check-circle" size={18} color="#10B981" />
                </View>
                <View style={styles.auditTitleBox}>
                  <Text style={styles.auditTitle}>3-Stage Verified Review Process</Text>
                  <Text style={styles.auditSubtitle}>Independent scientific & civic escrow audit</Text>
                </View>
              </View>

              <View style={styles.stagesList}>
                {campaign.reviewStages.map((stg, idx) => (
                  <View key={idx} style={styles.stageItem}>
                    <View style={styles.stageIndicatorColumn}>
                      <View
                        style={[
                          styles.stageDot,
                          stg.status === 'completed'
                            ? styles.stageDotCompleted
                            : styles.stageDotActive,
                        ]}
                      >
                        {stg.status === 'completed' ? (
                          <Feather name="check" size={11} color="#FFFFFF" />
                        ) : (
                          <View style={styles.pulseInner} />
                        )}
                      </View>
                      {idx < campaign.reviewStages.length - 1 && <View style={styles.stageLine} />}
                    </View>
                    <View style={styles.stageContent}>
                      <View style={styles.stageHeadingRow}>
                        <Text style={styles.stageName}>{stg.stage}: {stg.title}</Text>
                        <View
                          style={[
                            styles.statusTag,
                            stg.status === 'completed'
                              ? styles.statusTagCompleted
                              : styles.statusTagActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusTagText,
                              stg.status === 'completed'
                                ? styles.statusTagTextCompleted
                                : styles.statusTagTextActive,
                            ]}
                          >
                            {stg.status === 'completed' ? 'Verified' : 'In Progress'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.stageNote}>{stg.note}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Editorial Story */}
            <View style={styles.storySection}>
              <Text style={styles.sectionHeading}>The Mission & Field Plan</Text>
              <Text style={styles.storyBodyText}>{campaign.fullStory}</Text>
            </View>

            {/* Transparent Ledger: Use of Funds */}
            <View style={styles.ledgerSection}>
              <View style={styles.ledgerHeaderRow}>
                <Text style={styles.sectionHeading}>Transparent Ledger ("Use of Funds")</Text>
                <View style={styles.verified100Pill}>
                  <Feather name="lock" size={10} color={Colors.primary} />
                  <Text style={styles.verified100Text}>100% Escrow</Text>
                </View>
              </View>
              <Text style={styles.ledgerSub}>
                Every dollar pledged is allocated into transparent programmatic escrow buckets:
              </Text>

              {/* Progress Distribution Bar */}
              <View style={styles.multiColorBar}>
                {campaign.useOfFunds.map((fund, idx) => (
                  <View
                    key={idx}
                    style={{
                      flex: fund.percentage,
                      backgroundColor: fund.color,
                      height: 12,
                      borderTopLeftRadius: idx === 0 ? 6 : 0,
                      borderBottomLeftRadius: idx === 0 ? 6 : 0,
                      borderTopRightRadius: idx === campaign.useOfFunds.length - 1 ? 6 : 0,
                      borderBottomRightRadius: idx === campaign.useOfFunds.length - 1 ? 6 : 0,
                    }}
                  />
                ))}
              </View>

              {/* Fund Breakdown Items */}
              <View style={styles.fundsList}>
                {campaign.useOfFunds.map((fund, idx) => (
                  <View key={idx} style={styles.fundRow}>
                    <View style={styles.fundRowLeft}>
                      <View style={[styles.fundColorDot, { backgroundColor: fund.color }]} />
                      <Text style={styles.fundCategoryText}>{fund.category}</Text>
                    </View>
                    <View style={styles.fundRowRight}>
                      <Text style={styles.fundAmountText}>${fund.amount.toLocaleString()}</Text>
                      <Text style={styles.fundPercentText}>({fund.percentage}%)</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Live Interactive Sponsored Feed Preview */}
            <View style={styles.adPreviewSection}>
              <Text style={styles.sectionHeading}>Live Automated Ad Placements</Text>
              <Text style={styles.adPreviewSub}>
                Here is how your pledge is distributed across Meta Graph and digital out-of-home screens:
              </Text>
              <LiveAdPreview
                title={campaign.adPreview.headline}
                summary={campaign.adPreview.body}
                mediaUrl={campaign.adPreview.mediaUrl}
                creatorName={campaign.creator.organization}
                radiusMiles={campaign.distanceMiles}
              />
            </View>
          </View>
        </ScrollView>

        {/* Floating Bottom Dock (Always visible funding momentum bar) */}
        <View style={styles.floatingDock}>
          <View style={styles.dockStatsRow}>
            <View>
              <Text style={styles.dockAmount}>
                ${campaign.currentAmount.toLocaleString()}
                <Text style={styles.dockGoal}> raised of ${campaign.targetAmount.toLocaleString()}</Text>
              </Text>
              <Text style={styles.dockBackers}>
                {campaign.backersCount} citizens • {campaign.daysRemaining} days left
              </Text>
            </View>
            <View style={styles.dockPercentChip}>
              <Text style={styles.dockPercentText}>{percentage}%</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dockPillCta}
            onPress={() => {
              onClose();
              onBackCampaign(campaign);
            }}
            activeOpacity={0.88}
          >
            <Feather name="zap" size={17} color="#78350F" />
            <Text style={styles.dockCtaText}>Back Campaign</Text>
            <View style={styles.dockCtaReach}>
              <Text style={styles.dockCtaReachText}>$25 = 675 Reach</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerNavTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  heroImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlayBadge: {
    position: 'absolute',
    top: 14,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  heroOverlayBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  mainPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  summaryLead: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  creatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  creatorAvatarLarge: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  creatorMeta: {
    flex: 1,
  },
  creatorNameLarge: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  creatorOrg: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  creatorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  creatorBadgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  impactHighlightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderRadius: Radii.lg,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  impactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  impactSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  impactMetricPill: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.md,
  },
  impactMetricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400E',
  },
  impactMetricUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
  },
  auditProcessCard: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.xl,
    padding: 18,
    marginBottom: 24,
    ...Shadows.elevated,
  },
  auditHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  auditIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditTitleBox: {
    flex: 1,
  },
  auditTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  auditSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  stagesList: {
    gap: 12,
  },
  stageItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stageIndicatorColumn: {
    alignItems: 'center',
    width: 20,
  },
  stageDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDotCompleted: {
    backgroundColor: Colors.success,
  },
  stageDotActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  pulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FBBF24',
  },
  stageLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 4,
  },
  stageContent: {
    flex: 1,
    paddingBottom: 8,
  },
  stageHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  stageName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  statusTagCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusTagActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTagTextCompleted: {
    color: '#34D399',
  },
  statusTagTextActive: {
    color: '#FDE68A',
  },
  stageNote: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  storySection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  storyBodyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  ledgerSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  ledgerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verified100Pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  verified100Text: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  ledgerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  multiColorBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 14,
  },
  fundsList: {
    gap: 8,
  },
  fundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fundColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  fundCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  fundRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fundAmountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fundPercentText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  adPreviewSection: {
    marginBottom: 16,
  },
  adPreviewSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  floatingDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    ...Shadows.elevated,
  },
  dockStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dockAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dockGoal: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dockBackers: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  dockPercentChip: {
    backgroundColor: Colors.amberMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  dockPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  dockPillCta: {
    backgroundColor: Colors.amber,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    ...Shadows.gold,
  },
  dockCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350F',
  },
  dockCtaReach: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  dockCtaReachText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350F',
  },
});
