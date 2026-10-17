import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';

export type TabType = 'home' | 'explore' | 'create' | 'activity' | 'profile';

interface BottomTabBarProps {
  currentTab: TabType;
  onTabSelect: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onTabSelect,
  unreadCount = 2,
}) => {
  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('home')}
        activeOpacity={0.7}
      >
        <Feather
          name="home"
          size={21}
          color={currentTab === 'home' ? Colors.primary : Colors.textMuted}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Explore Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('explore')}
        activeOpacity={0.7}
      >
        <Feather
          name="compass"
          size={21}
          color={currentTab === 'explore' ? Colors.primary : Colors.textMuted}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'explore' && styles.tabLabelActive]}
        >
          Explore
        </Text>
      </TouchableOpacity>

      {/* Create (+) Central Elevated Button */}
      <TouchableOpacity
        style={styles.createButtonContainer}
        onPress={() => onTabSelect('create')}
        activeOpacity={0.88}
      >
        <View style={styles.createButtonCircle}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </View>
        <Text style={[styles.tabLabel, currentTab === 'create' && styles.tabLabelActive]}>
          Create
        </Text>
      </TouchableOpacity>

      {/* Activity Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('activity')}
        activeOpacity={0.7}
      >
        <View style={styles.iconWithBadge}>
          <Feather
            name="activity"
            size={21}
            color={currentTab === 'activity' ? Colors.primary : Colors.textMuted}
          />
          {unreadCount > 0 && <View style={styles.badgeDot} />}
        </View>
        <Text
          style={[styles.tabLabel, currentTab === 'activity' && styles.tabLabelActive]}
        >
          Activity
        </Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect('profile')}
        activeOpacity={0.7}
      >
        <Feather
          name="user"
          size={21}
          color={currentTab === 'profile' ? Colors.primary : Colors.textMuted}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'profile' && styles.tabLabelActive]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Shadows.card,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 3,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  createButtonContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: -16,
  },
  createButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Shadows.elevated,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -1,
    right: -3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.amber,
  },
});
