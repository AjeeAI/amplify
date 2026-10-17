import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';
import { ApiService } from '../services/api';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: (role: 'backer' | 'creator') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  onAuthSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [selectedRole, setSelectedRole] = useState<'backer' | 'creator'>('backer');
  const [email, setEmail] = useState<string>('alex.morgan@civicpulse.org');
  const [password, setPassword] = useState<string>('Ampl!fy2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Compute password strength
  const getPasswordStrength = (pwd: string): { level: string; percent: '25%' | '60%' | '100%'; color: string } => {
    if (pwd.length < 6) return { level: 'Weak', percent: '25%', color: '#EF4444' };
    if (pwd.length < 9) return { level: 'Medium', percent: '60%', color: '#F59E0B' };
    return { level: 'Strong', percent: '100%', color: '#10B981' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async () => {
    try {
      if (authMode === 'signup') {
        const name = selectedRole === 'backer' ? 'Alex Morgan' : 'Maya Lin';
        await ApiService.register(name, email, password);
      } else {
        await ApiService.login(email, password);
      }
    } catch {}
    onAuthSuccess(selectedRole);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.barTitle}>
            {authMode === 'signup' ? 'Create Amplify Account' : 'Welcome Back'}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Trust Stat Header */}
          <View style={styles.heroBanner}>
            <View style={styles.logoBadge}>
              <Feather name="volume-2" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.heroTitle}>Join the Civic Amplification Network</Text>
            <Text style={styles.heroSub}>
              Over $4.2M amplified into targeted community awareness this month.
            </Text>

            {/* $5 Match Bonus Callout */}
            <View style={styles.bonusChip}>
              <Feather name="gift" size={13} color="#92400E" />
              <Text style={styles.bonusChipText}>
                Get $5 Instant Amplify Match Bonus on signup!
              </Text>
            </View>
          </View>

          {/* Sign Up vs Login Switcher */}
          <View style={styles.modeTabs}>
            <TouchableOpacity
              style={[styles.modeTab, authMode === 'signup' && styles.modeTabActive]}
              onPress={() => setAuthMode('signup')}
            >
              <Text
                style={[
                  styles.modeTabText,
                  authMode === 'signup' && styles.modeTabTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, authMode === 'login' && styles.modeTabActive]}
              onPress={() => setAuthMode('login')}
            >
              <Text
                style={[
                  styles.modeTabText,
                  authMode === 'login' && styles.modeTabTextActive,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Role Intent Selector (SCREEN_10 & SCREEN_12) */}
          {authMode === 'signup' && (
            <View style={styles.roleSelectorSection}>
              <Text style={styles.sectionHeading}>Choose Your Primary Role</Text>

              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === 'backer' && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole('backer')}
                activeOpacity={0.85}
              >
                <View style={styles.roleCardLeft}>
                  <View
                    style={[
                      styles.roleIconRing,
                      selectedRole === 'backer' && styles.roleIconRingSelected,
                    ]}
                  >
                    <Feather
                      name="zap"
                      size={18}
                      color={selectedRole === 'backer' ? Colors.primary : Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.roleCardText}>
                    <Text style={styles.roleName}>Back & Amplify</Text>
                    <Text style={styles.roleDescription}>
                      Convert micro-pledges directly into targeted ad reach for grassroots causes.
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedRole === 'backer' && styles.radioCircleActive,
                  ]}
                >
                  {selectedRole === 'backer' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === 'creator' && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole('creator')}
                activeOpacity={0.85}
              >
                <View style={styles.roleCardLeft}>
                  <View
                    style={[
                      styles.roleIconRing,
                      selectedRole === 'creator' && styles.roleIconRingSelected,
                    ]}
                  >
                    <Feather
                      name="layers"
                      size={18}
                      color={selectedRole === 'creator' ? Colors.primary : Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.roleCardText}>
                    <Text style={styles.roleName}>Launch Project (Creator)</Text>
                    <Text style={styles.roleDescription}>
                      Raise funds, manage 3-stage audits, and automate multi-channel social ad delivery.
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedRole === 'creator' && styles.radioCircleActive,
                  ]}
                >
                  {selectedRole === 'creator' && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Social Fast Paths */}
          <View style={styles.socialFastPaths}>
            <TouchableOpacity style={styles.socialBtn} onPress={handleSubmit}>
              <FontAwesome5 name="apple" size={17} color={Colors.textPrimary} />
              <Text style={styles.socialBtnText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} onPress={handleSubmit}>
              <FontAwesome5 name="google" size={15} color="#EA4335" />
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email & Password Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work or Civic Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={16}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Visual Password Strength Indicator */}
              <View style={styles.strengthBox}>
                <View style={styles.strengthTrack}>
                  <View
                    style={[
                      styles.strengthBar,
                      { width: strength.percent, backgroundColor: strength.color },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: strength.color }]}>
                  Strength: {strength.level}
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.88}
            >
              <Text style={styles.submitBtnText}>
                {authMode === 'signup'
                  ? selectedRole === 'backer'
                    ? 'Start Backing & Claim $5'
                    : 'Start Creator Project'
                  : 'Sign In to Dashboard'}
              </Text>
              <Feather name="arrow-right" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroBanner: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Shadows.elevated,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bonusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  bonusChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.pill,
    padding: 4,
    marginBottom: 18,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Radii.pill,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    ...Shadows.subtle,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: Colors.textPrimary,
  },
  roleSelectorSection: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  roleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radii.lg,
    padding: 14,
    marginBottom: 10,
  },
  roleCardSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
  },
  roleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  roleIconRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconRingSelected: {
    backgroundColor: '#E0E7FF',
  },
  roleCardText: {
    flex: 1,
  },
  roleName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roleDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  socialFastPaths: {
    gap: 10,
    marginBottom: 16,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: Radii.pill,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
    color: Colors.textMuted,
  },
  formContainer: {
    gap: 12,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    height: 46,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  strengthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginRight: 10,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 10,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
    ...Shadows.elevated,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
