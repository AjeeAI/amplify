import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';

interface LiveAdPreviewProps {
  title?: string;
  summary?: string;
  mediaUrl?: string;
  creatorName?: string;
  radiusMiles?: number;
}

export const LiveAdPreview: React.FC<LiveAdPreviewProps> = ({
  title = '🚨 Know when your river is unsafe in seconds',
  summary = 'Maya Lin & 420+ neighbors are deploying live chemical sensors along the Charles River. Tap to back real-time civic transparency.',
  mediaUrl = 'https://images.unsplash.com/photo-1544333323-5374ac40d938?w=600&auto=format&fit=crop&q=80',
  creatorName = 'RiverWatch Alliance',
  radiusMiles = 5,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'instagram' | 'billboard'>('instagram');
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* Format Selector Pill Tabs */}
      <View style={styles.formatTabs}>
        <TouchableOpacity
          style={[styles.formatTab, selectedFormat === 'instagram' && styles.formatTabActive]}
          onPress={() => setSelectedFormat('instagram')}
          activeOpacity={0.8}
        >
          <Feather
            name="instagram"
            size={14}
            color={selectedFormat === 'instagram' ? '#FFFFFF' : Colors.textSecondary}
          />
          <Text
            style={[
              styles.formatTabText,
              selectedFormat === 'instagram' && styles.formatTabTextActive,
            ]}
          >
            Meta & Instagram Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.formatTab, selectedFormat === 'billboard' && styles.formatTabActive]}
          onPress={() => setSelectedFormat('billboard')}
          activeOpacity={0.8}
        >
          <Feather
            name="tv"
            size={14}
            color={selectedFormat === 'billboard' ? '#FFFFFF' : Colors.textSecondary}
          />
          <Text
            style={[
              styles.formatTabText,
              selectedFormat === 'billboard' && styles.formatTabTextActive,
            ]}
          >
            Digital Billboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Target Radius and Delivery Verification Banner */}
      <View style={styles.deliveryBadge}>
        <Feather name="target" size={13} color={Colors.primary} />
        <Text style={styles.deliveryBadgeText}>
          Targeting ~14,200 civic residents within {radiusMiles} miles
        </Text>
      </View>

      {/* Interactive Mockup Container */}
      {selectedFormat === 'instagram' ? (
        <View style={styles.adPhoneFrame}>
          {/* Post Header */}
          <View style={styles.adHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.sponsoredLogo}>
                <Feather name="volume-2" size={13} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.sponsoredTitleRow}>
                  <Text style={styles.accountName}>amplify.civic</Text>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.sponsoredLabel}>Sponsored</Text>
                </View>
                <Text style={styles.subAuthor}>Backed by {creatorName} & 421 citizens</Text>
              </View>
            </View>
            <Feather name="more-horizontal" size={16} color={Colors.textSecondary} />
          </View>

          {/* Ad Image */}
          <View style={styles.adMediaBox}>
            <Image source={{ uri: mediaUrl }} style={styles.adMediaImage} />
            <View style={styles.geoTagOverlay}>
              <Feather name="map-pin" size={10} color="#FFFFFF" />
              <Text style={styles.geoTagText}>{radiusMiles}mi Geo-Fenced Zone</Text>
            </View>
          </View>

          {/* Ad Callout Bar */}
          <View style={styles.ctaBar}>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaHeadline} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.ctaSubdomain}>amplify.social/clean-water</Text>
            </View>
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
              <Text style={styles.ctaButtonText}>Back Project</Text>
              <Feather name="chevron-right" size={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Action Icons */}
          <View style={styles.socialBar}>
            <View style={styles.socialIconsLeft}>
              <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isLiked ? '#EF4444' : Colors.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="paper-plane-outline" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isSaved ? Colors.primary : Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Ad Caption */}
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>
              <Text style={styles.captionHandle}>amplify.civic </Text>
              {summary}
            </Text>
            <Text style={styles.amplifiedFooter}>
              ⚡ 675 neighbors mobilized this week • Verified 501(c)(3)
            </Text>
          </View>
        </View>
      ) : (
        /* Billboard Mockup */
        <View style={styles.billboardFrame}>
          <View style={styles.billboardTopGantry}>
            <View style={styles.gantryLight} />
            <View style={styles.gantryLight} />
            <View style={styles.gantryLight} />
          </View>
          <View style={styles.billboardDisplay}>
            <Image source={{ uri: mediaUrl }} style={styles.billboardBg} />
            <View style={styles.billboardOverlay}>
              <View style={styles.billboardPill}>
                <Feather name="volume-2" size={12} color="#FBBF24" />
                <Text style={styles.billboardPillText}>COMMUNITY BROADCAST</Text>
              </View>
              <Text style={styles.billboardHeadline}>{title}</Text>
              <Text style={styles.billboardSub}>Scan to back clean water telemetry</Text>
              <View style={styles.qrBadge}>
                <Feather name="maximize" size={14} color="#0F172A" />
                <Text style={styles.qrText}>Amplify QR Code</Text>
              </View>
            </View>
          </View>
          <View style={styles.billboardPillar} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  formatTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.pill,
    padding: 3,
    marginBottom: 10,
  },
  formatTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  formatTabActive: {
    backgroundColor: Colors.primary,
  },
  formatTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  formatTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  adPhoneFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Shadows.card,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sponsoredLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsoredTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accountName: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bulletDot: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  sponsoredLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subAuthor: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  adMediaBox: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  adMediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  geoTagOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  geoTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  ctaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  ctaTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  ctaHeadline: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ctaSubdomain: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  ctaButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  socialBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  socialIconsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  captionText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  captionHandle: {
    fontWeight: '800',
  },
  amplifiedFooter: {
    fontSize: 10,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginTop: 6,
  },
  billboardFrame: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.lg,
    padding: 12,
    alignItems: 'center',
  },
  billboardTopGantry: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 6,
  },
  gantryLight: {
    width: 6,
    height: 4,
    backgroundColor: '#FBBF24',
    borderRadius: 2,
  },
  billboardDisplay: {
    width: '100%',
    height: 160,
    borderRadius: Radii.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#334155',
  },
  billboardBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  billboardOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    padding: 12,
    justifyContent: 'space-between',
  },
  billboardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
  },
  billboardPillText: {
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: '800',
  },
  billboardHeadline: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  billboardSub: {
    color: '#CBD5E1',
    fontSize: 10,
  },
  qrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDE047',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    alignSelf: 'flex-end',
  },
  qrText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  billboardPillar: {
    width: 24,
    height: 18,
    backgroundColor: '#334155',
    marginTop: 2,
  },
});
