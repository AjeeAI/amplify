import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
  ScrollView,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';

interface ImpactCertificateModalProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  totalImpressions?: number;
  totalDonated?: number;
}

export const ImpactCertificateModal: React.FC<ImpactCertificateModalProps> = ({
  visible,
  onClose,
  userName = 'Alex Morgan',
  totalImpressions = 12960,
  totalDonated = 480,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Official Civic Impact Certificate: ${userName} has mobilized ${totalImpressions.toLocaleString()} citizens via Amplify! Cryptographic proof: 0x8a92...b41c https://amplify.social/cert/alex-morgan`,
      });
    } catch (e) {
      console.log('Share certificate error', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.barTitle}>Official Impact Certificate</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Feather name="share" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Certificate Parchment Frame */}
          <View style={styles.certParchment}>
            <View style={styles.certBorderOuter}>
              <View style={styles.certBorderInner}>
                {/* Certificate Header */}
                <View style={styles.certHeader}>
                  <View style={styles.sealCircle}>
                    <Feather name="shield" size={24} color="#FBBF24" />
                  </View>
                  <Text style={styles.certOrg}>AMPLIFY CIVIC FOUNDATION</Text>
                  <Text style={styles.certHeading}>Certificate of Civic Amplification</Text>
                  <Text style={styles.certSubheading}>Verified Real-World Outreach Ledger</Text>
                </View>

                {/* Recipient */}
                <View style={styles.recipientBox}>
                  <Text style={styles.certPresentsTo}>This official record certifies that</Text>
                  <Text style={styles.recipientName}>{userName}</Text>
                  <Text style={styles.certStatement}>
                    has directly catalyzed and funded targeted public service broadcasts, mobilizing citizen awareness outside algorithmic echo chambers.
                  </Text>
                </View>

                {/* Metrics Callout */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricBlock}>
                    <Text style={styles.metricNumber}>{totalImpressions.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>Verified Impressions</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricBlock}>
                    <Text style={styles.metricNumber}>${totalDonated}</Text>
                    <Text style={styles.metricLabel}>Direct Civic Escrow</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricBlock}>
                    <Text style={styles.metricNumber}>14</Text>
                    <Text style={styles.metricLabel}>Campaigns Backed</Text>
                  </View>
                </View>

                {/* Verification Hash & Signatures */}
                <View style={styles.verificationFooter}>
                  <View style={styles.signatureCol}>
                    <Text style={styles.signatureScript}>Maya Lin</Text>
                    <View style={styles.sigLine} />
                    <Text style={styles.signerTitle}>Auditing Committee Chair</Text>
                  </View>

                  <View style={styles.hashCol}>
                    <Text style={styles.hashLabel}>CRYPTOGRAPHIC LEDGER PROOF</Text>
                    <Text style={styles.hashString}>SHA-256: 0x98f2...e3b4</Text>
                    <View style={styles.escrowPassBadge}>
                      <Feather name="check-circle" size={10} color="#166534" />
                      <Text style={styles.escrowPassText}>Audit Passed (Level 1)</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.downloadPdfBtn} onPress={handleShare} activeOpacity={0.88}>
            <Feather name="download" size={16} color="#FFFFFF" />
            <Text style={styles.downloadPdfText}>Export Verified PDF / Share</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  shareBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  certParchment: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl,
    padding: 10,
    ...Shadows.elevated,
    marginBottom: 20,
  },
  certBorderOuter: {
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderRadius: Radii.lg,
    padding: 8,
  },
  certBorderInner: {
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: Radii.md,
    padding: 16,
    alignItems: 'center',
  },
  certHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sealCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E2238',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FBBF24',
  },
  certOrg: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  certHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  certSubheading: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recipientBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  certPresentsTo: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  recipientName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginVertical: 6,
    letterSpacing: 0.5,
  },
  certStatement: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF8FF',
    borderRadius: Radii.md,
    padding: 12,
    marginVertical: 14,
    width: '100%',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  metricBlock: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
  },
  metricLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  verificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  signatureCol: {
    alignItems: 'center',
  },
  signatureScript: {
    fontSize: 16,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  sigLine: {
    width: 90,
    height: 1,
    backgroundColor: '#94A3B8',
    marginVertical: 4,
  },
  signerTitle: {
    fontSize: 9,
    color: Colors.textSecondary,
  },
  hashCol: {
    alignItems: 'flex-end',
  },
  hashLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  hashString: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  escrowPassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    marginTop: 4,
  },
  escrowPassText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#166534',
  },
  downloadPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radii.pill,
    ...Shadows.elevated,
  },
  downloadPdfText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
