import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CampaignCard } from '../components/CampaignCard';
import { MOCK_CAMPAIGNS } from '../constants/mockData';
import { Campaign, CategoryType } from '../types';
import { Colors, Radii } from '../constants/theme';
import { ApiService } from '../services/api';

interface ExploreScreenProps {
  onSelectCampaign: (campaign: Campaign) => void;
  onBackCampaign: (campaign: Campaign) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectCampaign,
  onBackCampaign,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRadius, setSelectedRadius] = useState<number>(50);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [onlyVerifiedEscrow, setOnlyVerifiedEscrow] = useState<boolean>(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await ApiService.getCampaigns();
        setCampaigns(data);
      } catch {}
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;

    const matchesRadius = c.distanceMiles <= selectedRadius;

    const matchesEscrow = !onlyVerifiedEscrow || c.creator.verificationBadge.includes('501(c)(3)');

    return matchesSearch && matchesCategory && matchesRadius && matchesEscrow;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentPadding}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Search Bar */}
      <View style={styles.searchBarContainer}>
        <Feather name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by mission, city, or keyword..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Geo-Fencing Radius Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeaderRow}>
          <Text style={styles.filterTitle}>Geo-Fencing Radius</Text>
          <Text style={styles.radiusPill}>{selectedRadius} mi radius</Text>
        </View>
        <View style={styles.radiusTabs}>
          {[5, 15, 50, 100].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.radiusTab, selectedRadius === r && styles.radiusTabActive]}
              onPress={() => setSelectedRadius(r)}
            >
              <Text
                style={[
                  styles.radiusTabText,
                  selectedRadius === r && styles.radiusTabTextActive,
                ]}
              >
                {r === 100 ? 'Nationwide' : `< ${r} mi`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category Filter Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {(['All', 'Climate', 'Tech & Society', 'Clean Energy'] as CategoryType[]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === cat && styles.categoryPillTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Escrow Toggle Chip */}
        <TouchableOpacity
          style={[styles.escrowTogglePill, onlyVerifiedEscrow && styles.escrowTogglePillActive]}
          onPress={() => setOnlyVerifiedEscrow(!onlyVerifiedEscrow)}
        >
          <Feather
            name="shield"
            size={12}
            color={onlyVerifiedEscrow ? '#FFFFFF' : Colors.primary}
          />
          <Text
            style={[
              styles.escrowToggleText,
              onlyVerifiedEscrow && styles.escrowToggleTextActive,
            ]}
          >
            Verified 501(c)(3) Only
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          Showing {filteredCampaigns.length} campaigns in your area
        </Text>
      </View>

      {/* Campaign Cards */}
      <View style={styles.cardsList}>
        {filteredCampaigns.map((camp) => (
          <CampaignCard
            key={camp.id}
            campaign={camp}
            onPress={() => onSelectCampaign(camp)}
            onBackCampaignPress={() => onBackCampaign(camp)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentPadding: {
    paddingBottom: 40,
    paddingTop: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radii.pill,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  radiusPill: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  radiusTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  radiusTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radiusTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  radiusTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  categoryPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  escrowTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  escrowTogglePillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  escrowToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  escrowToggleTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  cardsList: {
    marginTop: 4,
  },
});
