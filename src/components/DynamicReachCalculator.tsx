import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii } from '../constants/theme';

interface DynamicReachCalculatorProps {
  onAmountChange: (amount: number, impressions: number) => void;
  initialAmount?: number;
}

const PRESET_AMOUNTS = [10, 25, 50, 100];
const MULTIPLIER = 27; // 1 dollar = ~27 impressions

export const DynamicReachCalculator: React.FC<DynamicReachCalculatorProps> = ({
  onAmountChange,
  initialAmount = 25,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customInputValue, setCustomInputValue] = useState<string>('');

  const calculateImpressions = (amt: number) => Math.round(amt * MULTIPLIER);

  const handleSelectPreset = (amt: number) => {
    setIsCustom(false);
    setSelectedAmount(amt);
    setCustomInputValue('');
    onAmountChange(amt, calculateImpressions(amt));
  };

  const handleCustomChange = (text: string) => {
    setCustomInputValue(text);
    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    setSelectedAmount(parsed);
    onAmountChange(parsed, calculateImpressions(parsed));
  };

  const impressions = calculateImpressions(selectedAmount);
  const estimatedHouseholds = Math.round(impressions * 0.42);
  const estimatedRadius = selectedAmount >= 100 ? '12.5 mi' : selectedAmount >= 50 ? '8.0 mi' : selectedAmount >= 25 ? '4.2 mi' : '2.0 mi';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dynamic Reach Calculator</Text>
          <Text style={styles.formulaPill}>$1 = 27 verified impressions</Text>
        </View>
        <View style={styles.escrowBadge}>
          <Feather name="shield" size={12} color={Colors.success} />
          <Text style={styles.escrowText}>Escrow Backed</Text>
        </View>
      </View>

      {/* Preset Amount Chips */}
      <View style={styles.chipsRow}>
        {PRESET_AMOUNTS.map((amt) => {
          const isSelected = !isCustom && selectedAmount === amt;
          return (
            <TouchableOpacity
              key={amt}
              style={[styles.presetChip, isSelected && styles.presetChipSelected]}
              onPress={() => handleSelectPreset(amt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.presetChipText, isSelected && styles.presetChipTextSelected]}>
                ${amt}
              </Text>
              <Text style={[styles.presetSubText, isSelected && styles.presetSubTextSelected]}>
                ~{calculateImpressions(amt)} reach
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Custom Chip Toggle */}
        <TouchableOpacity
          style={[styles.presetChip, isCustom && styles.presetChipSelected]}
          onPress={() => setIsCustom(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.presetChipText, isCustom && styles.presetChipTextSelected]}>
            Custom
          </Text>
          <Text style={[styles.presetSubText, isCustom && styles.presetSubTextSelected]}>
            Enter $
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Input Field if toggled */}
      {isCustom && (
        <View style={styles.customInputRow}>
          <Text style={styles.currencyPrefix}>$</Text>
          <TextInput
            style={styles.customInput}
            keyboardType="number-pad"
            placeholder="Enter custom pledge"
            placeholderTextColor={Colors.textMuted}
            value={customInputValue}
            onChangeText={handleCustomChange}
            autoFocus
          />
        </View>
      )}

      {/* Dynamic Reach Output Box */}
      <View style={styles.outputCard}>
        <View style={styles.outputHero}>
          <View>
            <Text style={styles.impressionsCount}>
              {impressions.toLocaleString()}
            </Text>
            <Text style={styles.impressionsLabel}>Guaranteed Targeted Impressions</Text>
          </View>
          <View style={styles.radarIconBox}>
            <Feather name="radio" size={24} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Impact Sub-metrics */}
        <View style={styles.subMetricsRow}>
          <View style={styles.subMetricItem}>
            <Feather name="users" size={13} color={Colors.textSecondary} />
            <Text style={styles.subMetricText}>
              ~{estimatedHouseholds.toLocaleString()} unique devices
            </Text>
          </View>
          <View style={styles.subMetricItem}>
            <Feather name="map-pin" size={13} color={Colors.textSecondary} />
            <Text style={styles.subMetricText}>{estimatedRadius} radius</Text>
          </View>
          <View style={styles.subMetricItem}>
            <Feather name="check" size={13} color={Colors.success} />
            <Text style={styles.subMetricText}>0% Platform Tip</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  formulaPill: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  escrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  escrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  presetChip: {
    flex: 1,
    minWidth: 62,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: Radii.md,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  presetChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  presetChipTextSelected: {
    color: Colors.primary,
  },
  presetSubText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  presetSubTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 6,
  },
  customInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  outputCard: {
    backgroundColor: '#1E2238',
    borderRadius: Radii.lg,
    padding: 16,
  },
  outputHero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  impressionsCount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: -0.5,
  },
  impressionsLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
    marginTop: 2,
  },
  radarIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 12,
  },
  subMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  subMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subMetricText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
