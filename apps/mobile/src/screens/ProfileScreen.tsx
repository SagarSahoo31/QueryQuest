import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Flame, Zap, Award, CheckCircle2, ShieldCheck, Settings, LogOut } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { ProgressBar } from '../components/ProgressBar';
import { MOCK_USER } from '../data/mockData';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{MOCK_USER.name}</Text>
            <View style={styles.levelBadge}>
              <Award size={14} color={colors.dark.primaryLight} />
              <Text style={styles.levelText}>{MOCK_USER.levelTitle}</Text>
            </View>
          </View>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Flame size={20} color={colors.dark.accent} />
            <Text style={styles.statVal}>{MOCK_USER.streakDays} Days</Text>
            <Text style={styles.statLbl}>Current Streak</Text>
          </View>

          <View style={styles.statBox}>
            <Zap size={20} color={colors.dark.secondary} />
            <Text style={styles.statVal}>{MOCK_USER.xp.toLocaleString()}</Text>
            <Text style={styles.statLbl}>Total XP</Text>
          </View>

          <View style={styles.statBox}>
            <ShieldCheck size={20} color={colors.dark.primaryLight} />
            <Text style={styles.statVal}>{MOCK_USER.queriesExecuted}</Text>
            <Text style={styles.statLbl}>Queries Run</Text>
          </View>
        </View>

        {/* Topic Mastery Breakdown */}
        <Text style={styles.sectionHeader}>TOPIC MASTERY</Text>
        <View style={styles.masteryCard}>
          {MOCK_USER.masteryBreakdown.map((m, i) => (
            <View key={i} style={styles.masteryItem}>
              <View style={styles.masteryLabelRow}>
                <Text style={styles.masteryTopic}>{m.topic}</Text>
                <Text style={styles.masteryPct}>{m.percentage}%</Text>
              </View>
              <ProgressBar progress={m.percentage} height={6} />
            </View>
          ))}
        </View>

        {/* Badges / Achievements */}
        <Text style={styles.sectionHeader}>ACHIEVEMENTS</Text>
        <View style={styles.badgesGrid}>
          {[
            { title: 'First Query', desc: 'Executed 1st SQL statement' },
            { title: 'SELECT Master', desc: 'Completed SELECT module' },
            { title: 'WHERE Wizard', desc: 'Passed filtering quiz' },
            { title: '8 Day Streak', desc: '8 days of daily SQL' },
          ].map((b, i) => (
            <View key={i} style={styles.badgeCard}>
              <CheckCircle2 size={24} color={colors.dark.secondary} />
              <View>
                <Text style={styles.badgeTitle}>{b.title}</Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings options */}
        <TouchableOpacity style={styles.settingRow}>
          <Settings size={18} color={colors.dark.textSecondary} />
          <Text style={styles.settingText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingRow, { borderColor: 'rgba(239, 68, 68, 0.2)' }]}>
          <LogOut size={18} color={colors.dark.error} />
          <Text style={[styles.settingText, { color: colors.dark.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 16,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    gap: 4,
  },
  userName: {
    color: colors.dark.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: colors.dark.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    color: colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  statLbl: {
    color: colors.dark.textMuted,
    fontSize: 11,
  },
  sectionHeader: {
    color: colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  masteryCard: {
    backgroundColor: colors.dark.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 12,
  },
  masteryItem: {
    gap: 6,
  },
  masteryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  masteryTopic: {
    color: colors.dark.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  masteryPct: {
    color: colors.dark.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  badgesGrid: {
    gap: 10,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.dark.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  badgeTitle: {
    color: colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  badgeDesc: {
    color: colors.dark.textMuted,
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.dark.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  settingText: {
    color: colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
