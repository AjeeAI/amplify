import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HeroBanner } from '../components/HeroBanner';
import { CampaignCard } from '../components/CampaignCard';
import { MOCK_CAMPAIGNS } from '../constants/mockData';
import { Campaign, CategoryType } from '../types';
import { Colors, Radii } from '../constants/theme';
import { ApiService } from '../services/api';

interface HomeScreenProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onBackCampaign: (campaign: Campaign) => void;
  onExplorePress: () => void;
  onStartCampaignPress: () => void;
}

const CATEGORIES: CategoryType[] = [
  'All',
  'Climate',
  'Tech & Society',
  'Clean Energy',
  'Education',
  'Civic Tech',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectCampaign,
  onBackCampaign,
  onExplorePress,
  onStartCampaignPress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadCampaigns = async () => {
    try {
      const data = await ApiService.getCampaigns(selectedCategory);
      setCampaigns(data);
    } catch {
      // Fallback
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCampaigns();
  };

  const filteredCampaigns =
    selectedCategory === 'All'
      ? campaigns
      : campaigns.filter((c) => c.category === selectedCategory);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Hero Broadcast Banner */}
      <HeroBanner
        onExplorePress={onExplorePress}
        onStartCampaignPress={onStartCampaignPress}
      />

      {/* Category Filter Carousel */}
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Civic Graph</Text>
          <TouchableOpacity onPress={onExplorePress} style={styles.viewAllRow}>
            <Text style={styles.viewAllText}>View all</Text>
            <Feather name="arrow-right" size={13} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Campaign Cards List */}
      <View style={styles.feedContainer}>
        {filteredCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onPress={() => onSelectCampaign(campaign)}
            onBackCampaignPress={() => onBackCampaign(campaign)}
          />
        ))}
      </View>

      {/* Bottom Trust Seal Card */}
      <View style={styles.trustBanner}>
        <Feather name="shield" size={20} color={Colors.primary} />
        <View style={styles.trustBannerText}>
          <Text style={styles.trustTitle}>100% Verified Escrow Protection</Text>
          <Text style={styles.trustSubtitle}>
            Funds are locked until creators pass all 3 audit stages. Advertising spend is cryptographically broadcast-verified.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  categoriesSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedContainer: {
    marginTop: 8,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLavender,
    borderRadius: Radii.lg,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  trustBannerText: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  trustSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
