import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryType } from '../types';
import { Colors, Radii, Shadows } from '../constants/theme';
import { LiveAdPreview } from '../components/LiveAdPreview';
import { ApiService } from '../services/api';

interface CreateWizardScreenProps {
  onSuccessCreated: (newCampaignData: any) => void;
  onCancel: () => void;
}

const STEPS = ['Basics', 'Story', 'Visuals', 'Reach', 'Submit'];

export const CreateWizardScreen: React.FC<CreateWizardScreenProps> = ({
  onSuccessCreated,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form State
  const [title, setTitle] = useState<string>('Clean Rivers Initiative: Real-Time Sensor Telemetry');
  const [category, setCategory] = useState<CategoryType>('Climate');
  const [targetAmount, setTargetAmount] = useState<string>('20000');
  const [summary, setSummary] = useState<string>(
    'Deploying 12 autonomous water quality sensor pods along the urban basin to detect toxic runoff.'
  );
  const [story, setStory] = useState<string>(
    'Every spring, billions of gallons of untreated industrial storm runoff reach our public waterways. Our sensors test water quality every 60 seconds and broadcast alerts to residents within a 4-mile radius.'
  );
  const [coverUrl, setCoverUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544333323-5374ac40d938?w=800&auto=format&fit=crop&q=80'
  );

  // Step 4 Reach State
  const [radiusMiles, setRadiusMiles] = useState<number>(5);
  const [selectedAffinityTags, setSelectedAffinityTags] = useState<string[]>([
    'Clean Water Advocates',
    'Civic Voters',
    'Local Parents',
  ]);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([
    'Meta Graph Network',
    'Instagram In-Feed',
    'Digital Billboards',
  ]);

  // Voice AI State
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceTranscribing, setVoiceTranscribing] = useState<boolean>(false);
  const [voiceApplied, setVoiceApplied] = useState<boolean>(false);

  const handleSimulateVoice = async () => {
    setIsRecordingVoice(true);
    setVoiceApplied(false);

    // Simulate audio capture then fetch AI parsed response from backend
    setTimeout(async () => {
      setIsRecordingVoice(false);
      setVoiceTranscribing(true);

      try {
        const draft = await ApiService.voiceDraft(
          'We need $18,500 to deploy 12 water quality sensors along the Charles River basin to alert citizens of sewage overflow in real time.'
        );
        setVoiceTranscribing(false);
        setVoiceApplied(true);
        setTitle(draft.title || 'Charles River Sensor Grid: Real-Time Citizen Water Watch');
        setCategory(draft.category || 'Climate');
        setTargetAmount(String(draft.funding_goal || 18500));
        setSummary(draft.summary || 'Deploying autonomous optical fluorometer sensors to alert 40,000 residents of sewage overflows.');
        setStory(draft.story_content || 'Automated real-time water quality testing with instant geo-fenced broadcast alerts across the Boston basin.');
      } catch {
        setVoiceTranscribing(false);
        setVoiceApplied(true);
        setTitle('Charles River Sensor Grid: Real-Time Citizen Water Watch');
        setCategory('Climate');
        setTargetAmount('18500');
        setSummary('Deploying optical fluorometer sensors to alert 40,000 residents of sewage overflows.');
        setStory('Automated real-time water quality testing with instant geo-fenced broadcast alerts across the Boston basin.');
      }
    }, 1800);
  };

  const handleToggleAffinity = (tag: string) => {
    if (selectedAffinityTags.includes(tag)) {
      setSelectedAffinityTags(selectedAffinityTags.filter((t) => t !== tag));
    } else {
      setSelectedAffinityTags([...selectedAffinityTags, tag]);
    }
  };

  const handleToggleNetwork = (net: string) => {
    if (selectedNetworks.includes(net)) {
      setSelectedNetworks(selectedNetworks.filter((n) => n !== net));
    } else {
      setSelectedNetworks([...selectedNetworks, net]);
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit & persist to backend
      const goal = parseInt(targetAmount, 10) || 15000;
      try {
        const createdCampaign = await ApiService.createCampaign({
          title,
          category,
          summary,
          story_content: story,
          funding_goal: goal,
          target_radius_miles: radiusMiles,
          cover_image: coverUrl,
        });
        onSuccessCreated(createdCampaign);
      } catch {
        onSuccessCreated({
          title,
          category,
          targetAmount: goal,
          summary,
          story,
          radiusMiles,
          coverUrl,
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const computedTargetImpressions = (parseInt(targetAmount, 10) || 0) * 27;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handlePrev}>
          <Feather name={currentStep === 0 ? 'x' : 'arrow-left'} size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.wizardHeaderTitle}>Launch Civic Campaign</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* 5-Segment Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperTrack}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <View key={step} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepNode,
                    isCompleted && styles.stepNodeCompleted,
                    isCurrent && styles.stepNodeCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <Feather name="check" size={10} color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNodeText,
                        isCurrent && styles.stepNodeTextCurrent,
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    (isCompleted || isCurrent) && styles.stepLabelActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Wizard Step Body */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: BASICS */}
        {currentStep === 0 && (
          <View>
            {/* Voice AI Assist Card */}
            <View style={styles.voiceAiCard}>
              <View style={styles.voiceHeader}>
                <View style={styles.voiceIconRing}>
                  <Feather
                    name={isRecordingVoice ? 'mic' : 'cpu'}
                    size={16}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.voiceTitleBox}>
                  <Text style={styles.voiceTitle}>"Create with Voice" AI Assist</Text>
                  <Text style={styles.voiceSub}>
                    Speak your mission in plain English; our agent drafts the full campaign.
                  </Text>
                </View>
              </View>

              {isRecordingVoice ? (
                <View style={styles.waveRecordingBox}>
                  <View style={styles.redRecDot} />
                  <Text style={styles.recordingText}>Listening to audio stream... Speak now</Text>
                </View>
              ) : voiceTranscribing ? (
                <View style={styles.waveRecordingBox}>
                  <Feather name="loader" size={14} color={Colors.primary} />
                  <Text style={styles.transcribingText}>
                    Transcribing & structuring campaign in 3.4s...
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.voiceActionBtn}
                  onPress={handleSimulateVoice}
                  activeOpacity={0.85}
                >
                  <Feather name="mic" size={15} color="#4F46E5" />
                  <Text style={styles.voiceActionText}>
                    {voiceApplied ? 'Voice Draft Applied! Tap to re-record' : 'Tap to Record 10-Second Pitch'}
                  </Text>
                </TouchableOpacity>
              )}

              {voiceApplied && (
                <View style={styles.voiceSuccessPill}>
                  <Feather name="check" size={11} color={Colors.success} />
                  <Text style={styles.voiceSuccessText}>
                    Auto-populated title, category & reach target
                  </Text>
                </View>
              )}
            </View>

            {/* Campaign Title Field */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Campaign Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Clean Rivers Initiative"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            {/* Category Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categoryWrap}>
                {(['Climate', 'Tech & Society', 'Clean Energy', 'Civic Tech', 'Education'] as CategoryType[]).map(
                  (cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catOptionPill,
                        category === cat && styles.catOptionPillActive,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catOptionText,
                          category === cat && styles.catOptionTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* Funding Goal & Dynamic Target Impressions */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Funding Target ($)</Text>
              <View style={styles.currencyInputRow}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.currencyInput}
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                  keyboardType="number-pad"
                />
              </View>

              {/* Dynamic Target Impressions Preview Card */}
              <View style={styles.impressionsRewardCard}>
                <View style={styles.rewardLeft}>
                  <Feather name="radio" size={18} color={Colors.primary} />
                  <View>
                    <Text style={styles.rewardImpressionsText}>
                      ~{computedTargetImpressions.toLocaleString()} Guaranteed Impressions
                    </Text>
                    <Text style={styles.rewardFormulaText}>
                      $1 = 27 targeted local citizens reached
                    </Text>
                  </View>
                </View>
                <View style={styles.multiplierPill}>
                  <Text style={styles.multiplierText}>27x Boost</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: STORY */}
        {currentStep === 1 && (
          <View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>One-Sentence Elevator Pitch</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaSm]}
                value={summary}
                onChangeText={setSummary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Detailed Field Mission & Problem</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaLg]}
                value={story}
                onChangeText={setStory}
                multiline
                numberOfLines={6}
              />
            </View>

            {/* Verification Milestone Note */}
            <View style={styles.milestoneNoticeBox}>
              <Feather name="award" size={16} color={Colors.primary} />
              <View style={styles.noticeTextContainer}>
                <Text style={styles.noticeTitle}>3-Stage Independent Escrow</Text>
                <Text style={styles.noticeBody}>
                  Before funds are disbursed, Amplify peer auditors verify your documentation, budget ledger, and lab/field benchmarks.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: VISUALS */}
        {currentStep === 2 && (
          <View>
            <Text style={styles.formLabel}>Campaign Hero Image</Text>
            <View style={styles.visualsPreviewCard}>
              <Image source={{ uri: coverUrl }} style={styles.previewImage} />
              <View style={styles.visualOverlayBar}>
                <Text style={styles.ratioText}>16:9 Mobile Optimized</Text>
                <TouchableOpacity
                  style={styles.changeImageBtn}
                  onPress={() =>
                    Alert.alert(
                      'Select Photo',
                      'Choose from your library or high-resolution field photos.'
                    )
                  }
                >
                  <Feather name="camera" size={12} color="#FFFFFF" />
                  <Text style={styles.changeImageBtnText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Custom Image URL</Text>
              <TextInput
                style={styles.textInput}
                value={coverUrl}
                onChangeText={setCoverUrl}
                placeholder="https://..."
              />
            </View>
          </View>
        )}

        {/* STEP 4: REACH & DISTRIBUTION ENGINE (SCREEN_8) */}
        {currentStep === 3 && (
          <View>
            <View style={styles.engineHeader}>
              <View style={styles.engineBadge}>
                <Feather name="sliders" size={14} color={Colors.primary} />
                <Text style={styles.engineBadgeText}>STEP 4: REACH ENGINE</Text>
              </View>
              <Text style={styles.engineTitle}>Targeted Delivery Configuration</Text>
              <Text style={styles.engineSub}>
                Customize geographic fencing, civic affinity filters, and preview live ad placements.
              </Text>
            </View>

            {/* Geo-Fencing Radius Selector */}
            <View style={styles.formGroup}>
              <View style={styles.labelWithBadgeRow}>
                <Text style={styles.formLabel}>Audience Radius Geo-Fence</Text>
                <Text style={styles.radiusValue}>{radiusMiles} Miles</Text>
              </View>

              <View style={styles.radiusChipsRow}>
                {[3, 5, 15, 30, 50].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.radiusChip,
                      radiusMiles === r && styles.radiusChipActive,
                    ]}
                    onPress={() => setRadiusMiles(r)}
                  >
                    <Text
                      style={[
                        styles.radiusChipText,
                        radiusMiles === r && styles.radiusChipTextActive,
                      ]}
                    >
                      {r} mi
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Civic Affinity Filters */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Civic Affinity Filters</Text>
              <View style={styles.affinityWrap}>
                {[
                  'Clean Water Advocates',
                  'Civic Voters',
                  'Local Parents',
                  'Environmentalists',
                  'Tech Policy Advocates',
                  'Public Transit Users',
                ].map((tag) => {
                  const isChecked = selectedAffinityTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.affinityTag, isChecked && styles.affinityTagActive]}
                      onPress={() => handleToggleAffinity(tag)}
                    >
                      <Feather
                        name={isChecked ? 'check-circle' : 'plus'}
                        size={12}
                        color={isChecked ? Colors.primary : Colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.affinityTagText,
                          isChecked && styles.affinityTagTextActive,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Real-time Network Toggles */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Distribution Networks</Text>
              <View style={styles.networkTogglesList}>
                {[
                  { name: 'Meta Graph Network', icon: 'facebook', desc: 'Targeted in-feed sponsor units' },
                  { name: 'Instagram In-Feed', icon: 'instagram', desc: 'Reels and high-engagement carousels' },
                  { name: 'Facebook Local Groups', icon: 'users', desc: 'Neighborhood town square posts' },
                  { name: 'Digital Billboards', icon: 'tv', desc: 'High-visibility highway displays' },
                ].map((net) => {
                  const isActive = selectedNetworks.includes(net.name);
                  return (
                    <TouchableOpacity
                      key={net.name}
                      style={[styles.networkRow, isActive && styles.networkRowActive]}
                      onPress={() => handleToggleNetwork(net.name)}
                    >
                      <View style={styles.netLeft}>
                        <View style={styles.netIconBox}>
                          <Feather name={net.icon as any} size={15} color={Colors.primary} />
                        </View>
                        <View>
                          <Text style={styles.netName}>{net.name}</Text>
                          <Text style={styles.netDesc}>{net.desc}</Text>
                        </View>
                      </View>
                      <View style={[styles.togglePill, isActive && styles.togglePillActive]}>
                        <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Live Interactive Sponsored Feed Preview */}
            <View style={styles.previewContainerSection}>
              <Text style={styles.previewHeading}>Live Sponsored Feed Preview</Text>
              <Text style={styles.previewSubheading}>
                How your sponsored message appears to neighbors before deployment:
              </Text>
              <LiveAdPreview
                title={title}
                summary={summary}
                mediaUrl={coverUrl}
                creatorName="Maya Lin / You"
                radiusMiles={radiusMiles}
              />
            </View>
          </View>
        )}

        {/* STEP 5: SUBMIT */}
        {currentStep === 4 && (
          <View>
            <View style={styles.summarySubmitCard}>
              <Text style={styles.submitHeroTitle}>Ready for Civic Launch</Text>
              <Text style={styles.submitHeroSub}>
                Your campaign is queued for 3-stage escrow audit and immediate programmatic distribution.
              </Text>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Campaign Title</Text>
                <Text style={styles.summaryItemValue}>{title}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Category</Text>
                <Text style={styles.summaryItemValue}>{category}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Funding Goal</Text>
                <Text style={styles.summaryItemValue}>${parseInt(targetAmount, 10).toLocaleString()}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Target Impressions</Text>
                <Text style={styles.summaryItemValue}>~{computedTargetImpressions.toLocaleString()}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>Geo-Fence</Text>
                <Text style={styles.summaryItemValue}>{radiusMiles} miles • {selectedNetworks.length} networks</Text>
              </View>
            </View>

            <View style={styles.termsBox}>
              <Feather name="shield" size={14} color={Colors.success} />
              <Text style={styles.termsText}>
                I certify that 100% of non-ad expenditures will be tracked transparently on the Amplify open ledger.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.prevBtn} onPress={handlePrev} activeOpacity={0.7}>
          <Text style={styles.prevBtnText}>{currentStep === 0 ? 'Cancel' : 'Back'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.88}>
          <Text style={styles.nextBtnText}>
            {currentStep === STEPS.length - 1 ? 'Launch Campaign' : 'Continue'}
          </Text>
          <Feather
            name={currentStep === STEPS.length - 1 ? 'zap' : 'arrow-right'}
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
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
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wizardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cancelText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  stepperContainer: {
    backgroundColor: '#FAF8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepperTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepNodeCompleted: {
    backgroundColor: Colors.success,
  },
  stepNodeCurrent: {
    backgroundColor: Colors.primary,
  },
  stepNodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepNodeTextCurrent: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  voiceAiCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: Radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 16,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  voiceIconRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceTitleBox: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  voiceSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  voiceActionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  voiceActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  waveRecordingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.pill,
    paddingVertical: 10,
  },
  redRecDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  transcribingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  voiceSuccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  voiceSuccessText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textAreaSm: {
    height: 70,
    textAlignVertical: 'top',
  },
  textAreaLg: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catOptionPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catOptionPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  currencyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 8,
  },
  inputPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 6,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  impressionsRewardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF8FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: Radii.md,
    padding: 12,
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardImpressionsText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  rewardFormulaText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  multiplierPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  milestoneNoticeBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  noticeBody: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  visualsPreviewCard: {
    width: '100%',
    height: 200,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  visualOverlayBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratioText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  changeImageBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  engineHeader: {
    marginBottom: 14,
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  engineTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  engineSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  radiusValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  radiusChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusChip: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radiusChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
  },
  radiusChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  radiusChipTextActive: {
    color: Colors.primary,
  },
  affinityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  affinityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  affinityTagActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
  },
  affinityTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  affinityTagTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  networkTogglesList: {
    gap: 8,
  },
  networkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  networkRowActive: {
    borderColor: '#C7D2FE',
    backgroundColor: '#FAF8FF',
  },
  netLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  netIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  netName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  netDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  togglePill: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CBD5E1',
    padding: 2,
    justifyContent: 'center',
  },
  togglePillActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  previewContainerSection: {
    marginTop: 10,
  },
  previewHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  previewSubheading: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  summarySubmitCard: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.xl,
    padding: 18,
    marginBottom: 16,
  },
  submitHeroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  submitHeroSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 18,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  summaryItemValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: '60%',
    textAlign: 'right',
  },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  termsText: {
    fontSize: 11,
    color: '#166534',
    flex: 1,
    lineHeight: 16,
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  prevBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  prevBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 6,
    ...Shadows.elevated,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
