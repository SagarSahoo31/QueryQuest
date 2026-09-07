import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Zap, Award } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface HeaderProps {
  streakDays: number;
  xp: number;
  levelTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ streakDays, xp, levelTitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Award size={16} color={colors.dark.primaryLight} />
        <Text style={styles.levelText}>{levelTitle}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statPill, styles.streakPill]}>
          <Flame size={16} color={colors.dark.accent} />
          <Text style={styles.streakText}>{streakDays} d</Text>
        </View>

        <View style={[styles.statPill, styles.xpPill]}>
          <Zap size={16} color={colors.dark.secondary} />
          <Text style={styles.xpText}>{xp.toLocaleString()} XP</Text>
        </View>
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
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.surfaceBorder,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    gap: 6,
  },
  levelText: {
    color: colors.dark.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
  },
  streakPill: {
    backgroundColor: colors.dark.warningBg,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  streakText: {
    color: colors.dark.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  xpPill: {
    backgroundColor: colors.dark.successBg,
    borderColor: colors.dark.successBorder,
  },
  xpText: {
    color: colors.dark.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
