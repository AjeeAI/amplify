import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Campaign } from '../types';
import { Colors, Radii, Shadows } from '../constants/theme';

interface SuccessBlastModalProps {
  visible: boolean;
  pledgeData: {
    amount: number;
    impressions: number;
    campaign: Campaign;
  } | null;
  onClose: () => void;
  onGoToActivity: () => void;
}

export const SuccessBlastModal: React.FC<SuccessBlastModalProps> = ({
  visible,
  pledgeData,
  onClose,
  onGoToActivity,
}) => {
  if (!pledgeData) return null;

  const [telemetryProgress, setTelemetryProgress] = useState<number>(82);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setTelemetryProgress((prev) => (prev >= 98 ? 98 : prev + 2));
    }, 1200);
    return () => clearInterval(interval);
  }, [visible]);

  const handleShareX = async () => {
    try {
      await Share.share({
        message: `I just amplified "${pledgeData.campaign.title}" with $${pledgeData.amount} on Amplify! Putting this civic message in front of ~${pledgeData.impressions} neighbors. https://amplify.social/c/${pledgeData.campaign.id}`,
      });
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.cardContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header Radar Blast Graphic */}
            <LinearGradient
              colors={['#312E81', '#4338CA', '#4F46E5']}
              style={styles.blastHero}
            >
              <View style={styles.radarRingOuter}>
                <View style={styles.radarRingInner}>
                  <Feather name="volume-2" size={32} color="#FDE047" />
                </View>
              </View>

              <Text style={styles.successHeadline}>Amplification Blast Queued!</Text>
              <Text style={styles.successSub}>
                Your ${pledgeData.amount} contribution is dynamically purchasing targeted reach.
              </Text>
            </LinearGradient>

            {/* Core Reach Highlight */}
            <View style={styles.metricHighlightBox}>
              <View style={styles.reachBigRow}>
                <Text style={styles.reachBigNum}>~{pledgeData.impressions.toLocaleString()}</Text>
                <Text style={styles.reachBigLabel}>Citizens Mobilized</Text>
              </View>
              <View style={styles.radiusTag}>
                <Feather name="map-pin" size={12} color={Colors.primary} />
                <Text style={styles.radiusTagText}>4.2-mile geo-fenced radius</Text>
              </View>
            </View>

            {/* Broadcast Queue Telemetry Section */}
            <View style={styles.telemetryCard}>
              <View style={styles.telemetryHeader}>
                <View style={styles.telemetryDot} />
                <Text style={styles.telemetryTitle}>LIVE BROADCAST QUEUE TELEMETRY</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.telemetryTrack}>
                <View style={[styles.telemetryBar, { width: `${telemetryProgress}%` }]} />
              </View>

              <View style={styles.telemetryStatusRow}>
                <Text style={styles.telemetryStatusText}>
                  Injecting Ads ({telemetryProgress}%)
                </Text>
                <Text style={styles.telemetryCountdown}>Est. broadcast in 4m 12s</Text>
              </View>

              {/* Real-time telemetry log feed */}
              <View style={styles.logTerminal}>
                <Text style={styles.logLine}>[OK] Escrow lock confirmed ($0.00 platform fee)</Text>
                <Text style={styles.logLine}>[META] Meta Graph webhook connected (Boston, MA)</Text>
                <Text style={styles.logLine}>[INSTA] In-feed reel placement reserved: 675 units</Text>
                <Text style={styles.logLineActive}>[BROADCAST] Routing ad packets to local geo-nodes...</Text>
              </View>
            </View>

            {/* Viral Multipliers (1-tap sharing actions) */}
            <View style={styles.viralSection}>
              <Text style={styles.viralTitle}>Multiply Your Ripple Effect</Text>
              <Text style={styles.viralSubtitle}>
                Sharing this campaign brings an average of 4.3x additional community backers:
              </Text>

              <View style={styles.shareButtonsRow}>
                <TouchableOpacity
                  style={[styles.shareBtn, styles.shareXBtn]}
                  onPress={handleShareX}
                  activeOpacity={0.8}
                >
                  <FontAwesome5 name="twitter" size={15} color="#FFFFFF" />
                  <Text style={styles.shareXText}>Post to X</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.shareBtn, styles.shareWaBtn]}
                  onPress={handleShareX}
                  activeOpacity={0.8}
                >
                  <FontAwesome5 name="whatsapp" size={16} color="#FFFFFF" />
                  <Text style={styles.shareWaText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.shareBtn, styles.shareCopyBtn]}
                  onPress={handleCopyLink}
                  activeOpacity={0.8}
                >
                  <Feather
                    name={copiedLink ? 'check' : 'copy'}
                    size={15}
                    color={copiedLink ? Colors.success : Colors.textPrimary}
                  />
                  <Text style={styles.shareCopyText}>
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.viewRippleBtn}
                onPress={() => {
                  onClose();
                  onGoToActivity();
                }}
                activeOpacity={0.88}
              >
                <Feather name="activity" size={16} color="#FFFFFF" />
                <Text style={styles.viewRippleText}>Track Live Ripple in Activity</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.doneBtnText}>Back to Discovery Feed</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    width: '100%',
    maxHeight: '92%',
    overflow: 'hidden',
    ...Shadows.elevated,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  blastHero: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  radarRingOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  radarRingInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(251, 191, 36, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successHeadline: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 12,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  metricHighlightBox: {
    backgroundColor: '#FAF8FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  reachBigRow: {
    alignItems: 'center',
    marginBottom: 6,
  },
  reachBigNum: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  reachBigLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  radiusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  radiusTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  telemetryCard: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.lg,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  telemetryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  telemetryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  telemetryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  telemetryTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  telemetryBar: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: 3,
  },
  telemetryStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  telemetryStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDE68A',
  },
  telemetryCountdown: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  logTerminal: {
    backgroundColor: '#0F172A',
    borderRadius: Radii.sm,
    padding: 10,
    gap: 4,
  },
  logLine: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  logLineActive: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  viralSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  viralTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  viralSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  shareButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radii.pill,
  },
  shareXBtn: {
    backgroundColor: '#0F172A',
  },
  shareXText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  shareWaBtn: {
    backgroundColor: '#25D366',
  },
  shareWaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  shareCopyBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shareCopyText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 8,
  },
  viewRippleBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 8,
    ...Shadows.elevated,
  },
  viewRippleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  doneBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
