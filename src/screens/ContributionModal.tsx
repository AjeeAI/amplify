import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Campaign } from '../types';
import { DynamicReachCalculator } from '../components/DynamicReachCalculator';
import { Colors, Radii, Shadows } from '../constants/theme';
import { ApiService } from '../services/api';

interface ContributionModalProps {
  campaign: Campaign | null;
  visible: boolean;
  onClose: () => void;
  onPaymentSuccess: (pledgeData: { amount: number; impressions: number; campaign: Campaign }) => void;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({
  campaign,
  visible,
  onClose,
  onPaymentSuccess,
}) => {
  if (!campaign) return null;

  const [pledgeAmount, setPledgeAmount] = useState<number>(25);
  const [pledgeImpressions, setPledgeImpressions] = useState<number>(675);
  const [selectedPayment, setSelectedPayment] = useState<'apple' | 'google' | 'card'>('apple');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePledgeChange = (amount: number, impressions: number) => {
    setPledgeAmount(amount);
    setPledgeImpressions(impressions);
  };

  const handleCompletePayment = async () => {
    if (pledgeAmount <= 0) return;
    setIsProcessing(true);

    try {
      const result = await ApiService.contribute(campaign.id, pledgeAmount, selectedPayment);
      setIsProcessing(false);
      onPaymentSuccess({
        amount: pledgeAmount,
        impressions: result.contribution?.impressions_generated || pledgeImpressions,
        campaign: {
          ...campaign,
          currentAmount: result.new_amount_raised || (campaign.currentAmount + pledgeAmount),
        },
      });
    } catch {
      setIsProcessing(false);
      onPaymentSuccess({
        amount: pledgeAmount,
        impressions: pledgeImpressions,
        campaign,
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlayBackdrop}>
        <TouchableOpacity style={styles.dismissBackdrop} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheetContainer}>
          {/* Sheet Handle */}
          <View style={styles.sheetHandleContainer}>
            <View style={styles.sheetHandle} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerCampaignInfo}>
              <Text style={styles.backingPrefix}>BACK & AMPLIFY</Text>
              <Text style={styles.campaignTitle} numberOfLines={1}>
                {campaign.title}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Feather name="x" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetBody}
            contentContainerStyle={styles.sheetBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Creator & Trust Seal */}
            <View style={styles.creatorTrustRow}>
              <Image source={{ uri: campaign.creator.avatar }} style={styles.creatorThumbnail} />
              <View style={styles.creatorTrustInfo}>
                <Text style={styles.creatorOrgText}>{campaign.creator.organization}</Text>
                <Text style={styles.escrowGuaranteeText}>
                  🛡️ 100% Escrow Protected • 3-Stage Verified
                </Text>
              </View>
            </View>

            {/* Dynamic Reach Calculator */}
            <DynamicReachCalculator
              initialAmount={pledgeAmount}
              onAmountChange={handlePledgeChange}
            />

            {/* Platform Tip Transparency */}
            <View style={styles.tipTransparencyCard}>
              <View style={styles.tipHeader}>
                <Feather name="heart" size={14} color={Colors.primary} />
                <Text style={styles.tipTitle}>0% Platform Tip Transparency</Text>
              </View>
              <Text style={styles.tipDescription}>
                100% of your pledge funds digital reach directly. Payment processing (2.2%) is underwritten by our philanthropic foundation partners.
              </Text>
            </View>

            {/* Payment Method Selector */}
            <View style={styles.paymentMethodsSection}>
              <Text style={styles.sectionTitle}>Select Payment Method</Text>

              <View style={styles.paymentOptionsList}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPayment === 'apple' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setSelectedPayment('apple')}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentLeft}>
                    <FontAwesome5 name="apple" size={18} color={Colors.textPrimary} />
                    <Text style={styles.paymentName}>Apple Pay</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPayment === 'apple' && styles.radioCircleActive,
                    ]}
                  >
                    {selectedPayment === 'apple' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPayment === 'google' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setSelectedPayment('google')}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentLeft}>
                    <FontAwesome5 name="google" size={15} color="#EA4335" />
                    <Text style={styles.paymentName}>Google Pay</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPayment === 'google' && styles.radioCircleActive,
                    ]}
                  >
                    {selectedPayment === 'google' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPayment === 'card' && styles.paymentOptionActive,
                  ]}
                  onPress={() => setSelectedPayment('card')}
                  activeOpacity={0.8}
                >
                  <View style={styles.paymentLeft}>
                    <Feather name="credit-card" size={16} color={Colors.textPrimary} />
                    <Text style={styles.paymentName}>Visa •••• 4029</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPayment === 'card' && styles.radioCircleActive,
                    ]}
                  >
                    {selectedPayment === 'card' && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Sheet Footer CTA */}
          <View style={styles.footerBar}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Pledge</Text>
                <Text style={styles.totalAmount}>${pledgeAmount}.00</Text>
              </View>
              <View style={styles.reachGainBox}>
                <Feather name="radio" size={12} color="#92400E" />
                <Text style={styles.reachGainText}>+{pledgeImpressions} reach</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.completeButton, isProcessing && styles.completeButtonDisabled]}
              onPress={handleCompletePayment}
              disabled={isProcessing || pledgeAmount <= 0}
              activeOpacity={0.88}
            >
              {isProcessing ? (
                <ActivityIndicator color="#78350F" />
              ) : (
                <>
                  <Feather name="zap" size={17} color="#78350F" />
                  <Text style={styles.completeButtonText}>
                    Amplify with ${pledgeAmount} • Reach ~{pledgeImpressions} People
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  dismissBackdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radii.sheet,
    borderTopRightRadius: Radii.sheet,
    maxHeight: '90%',
    paddingBottom: 24,
    ...Shadows.elevated,
  },
  sheetHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sheetHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerCampaignInfo: {
    flex: 1,
    marginRight: 10,
  },
  backingPrefix: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  campaignTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: {
    paddingHorizontal: 18,
  },
  sheetBodyContent: {
    paddingTop: 14,
    paddingBottom: 20,
  },
  creatorTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  creatorThumbnail: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  creatorTrustInfo: {
    flex: 1,
  },
  creatorOrgText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  escrowGuaranteeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  tipTransparencyCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: Radii.md,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  tipDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  paymentMethodsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  paymentOptionsList: {
    gap: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F5F3FF',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  footerBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  reachGainBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reachGainText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  completeButton: {
    backgroundColor: Colors.amber,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    ...Shadows.gold,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
  },
});
