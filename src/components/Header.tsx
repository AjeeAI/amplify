import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Radii } from '../constants/theme';

interface HeaderProps {
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  unreadCount?: number;
  userAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchPress,
  onNotificationsPress,
  onProfilePress,
  unreadCount = 2,
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Feather name="volume-2" size={20} color="#FFFFFF" />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>AMPLIFY</Text>
            <View style={styles.livePulseDot} />
          </View>
          <Text style={styles.brandSubtitle}>Civic Broadcast Graph</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
          accessibilityLabel="Search campaigns"
        >
          <Feather name="search" size={19} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onNotificationsPress}
          activeOpacity={0.7}
          accessibilityLabel="Notifications"
        >
          <Feather name="bell" size={19} color={Colors.textPrimary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.8,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  brandSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.amber,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarButton: {
    marginLeft: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
});
