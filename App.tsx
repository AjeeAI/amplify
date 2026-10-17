import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Header } from './src/components/Header';
import { BottomTabBar, TabType } from './src/components/BottomTabBar';

import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { CreateWizardScreen } from './src/screens/CreateWizardScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

import { CampaignDetailModal } from './src/screens/CampaignDetailModal';
import { ContributionModal } from './src/screens/ContributionModal';
import { SuccessBlastModal } from './src/screens/SuccessBlastModal';
import { AuthModal } from './src/screens/AuthModal';

import { Campaign } from './src/types';
import { MOCK_CAMPAIGNS } from './src/constants/mockData';
import { Colors } from './src/constants/theme';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Selected Campaign for Detail View (SCREEN_18)
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Selected Campaign for Contribution Sheet (SCREEN_16)
  const [contributionCampaign, setContributionCampaign] = useState<Campaign | null>(null);
  const [showContributionModal, setShowContributionModal] = useState<boolean>(false);

  // Success Blast (SCREEN_6)
  const [successPledgeData, setSuccessPledgeData] = useState<{
    amount: number;
    impressions: number;
    campaign: Campaign;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Auth Modal (SCREEN_10 & SCREEN_12)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Handlers
  const handleOpenDetail = (campaign: Campaign) => {
    setDetailCampaign(campaign);
    setShowDetailModal(true);
  };

  const handleOpenBacking = (campaign: Campaign) => {
    setContributionCampaign(campaign);
    setShowContributionModal(true);
  };

  const handlePaymentSuccess = (pledgeData: {
    amount: number;
    impressions: number;
    campaign: Campaign;
  }) => {
    setShowContributionModal(false);
    setSuccessPledgeData(pledgeData);
    setShowSuccessModal(true);
  };

  const handleCampaignCreated = (newCampaignData: any) => {
    // Switch to home tab
    setCurrentTab('home');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        {/* Global App Header (hidden when on full-screen wizard) */}
        {currentTab !== 'create' && (
          <Header
            onSearchPress={() => setCurrentTab('explore')}
            onNotificationsPress={() => setCurrentTab('activity')}
            onProfilePress={() => setShowAuthModal(true)}
            unreadCount={2}
          />
        )}

        {/* Tab View Container */}
        <View style={styles.content}>
          {currentTab === 'home' && (
            <HomeScreen
              onSelectCampaign={handleOpenDetail}
              onBackCampaign={handleOpenBacking}
              onExplorePress={() => setCurrentTab('explore')}
              onStartCampaignPress={() => setCurrentTab('create')}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreScreen
              onSelectCampaign={handleOpenDetail}
              onBackCampaign={handleOpenBacking}
            />
          )}

          {currentTab === 'create' && (
            <CreateWizardScreen
              onSuccessCreated={handleCampaignCreated}
              onCancel={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'activity' && <ActivityScreen />}

          {currentTab === 'profile' && (
            <ProfileScreen
              onStartCampaignPress={() => setCurrentTab('create')}
              onExplorePress={() => setCurrentTab('explore')}
            />
          )}
        </View>

        {/* Bottom Tab Bar (hidden when in create wizard) */}
        {currentTab !== 'create' && (
          <BottomTabBar
            currentTab={currentTab}
            onTabSelect={(tab) => setCurrentTab(tab)}
            unreadCount={2}
          />
        )}

        {/* Focused Modals */}
        <CampaignDetailModal
          visible={showDetailModal}
          campaign={detailCampaign}
          onClose={() => setShowDetailModal(false)}
          onBackCampaign={handleOpenBacking}
        />

        <ContributionModal
          visible={showContributionModal}
          campaign={contributionCampaign}
          onClose={() => setShowContributionModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <SuccessBlastModal
          visible={showSuccessModal}
          pledgeData={successPledgeData}
          onClose={() => setShowSuccessModal(false)}
          onGoToActivity={() => {
            setShowSuccessModal(false);
            setCurrentTab('activity');
          }}
        />

        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(role) => {
            if (role === 'creator') {
              setCurrentTab('profile');
            }
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
