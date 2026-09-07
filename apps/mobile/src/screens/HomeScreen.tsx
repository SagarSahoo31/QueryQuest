import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Play, Flame, Award, ArrowRight, Code, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { MOCK_USER, DAILY_CHALLENGE } from '../data/mockData';

export const HomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        streakDays={MOCK_USER.streakDays}
        xp={MOCK_USER.xp}
        levelTitle={MOCK_USER.levelTitle}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Section */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingTitle}>Welcome back, {MOCK_USER.name} 👋</Text>
          <Text style={styles.greetingSubtitle}>Ready to master your SQL queries today?</Text>
        </View>

        {/* Continue Learning Banner */}
        <View style={styles.continueCard}>
          <View style={styles.continueBadge}>
            <Sparkles size={14} color={colors.dark.primaryLight} />
            <Text style={styles.continueBadgeText}>CURRENT LESSON</Text>
          </View>

          <Text style={styles.lessonTitle}>Filtering Data (WHERE)</Text>
          <Text style={styles.lessonSubtitle}>Lesson 4 of 5 • Comparison & Logic Operators</Text>

          <View style={styles.progressContainer}>
            <ProgressBar progress={80} height={8} barColor={colors.dark.primaryLight} />
            <Text style={styles.progressText}>80% Complete</Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Learn')}
            activeOpacity={0.85}
          >
            <Play size={16} color="#FFF" fill="#FFF" />
            <Text style={styles.continueButtonText}>CONTINUE LESSON</Text>
          </TouchableOpacity>
        </View>

        {/* Daily SQL Challenge */}
        <View style={styles.sectionHeader}>
          <Flame size={18} color={colors.dark.accent} />
          <Text style={styles.sectionTitle}>Daily SQL Challenge</Text>
        </View>

        <TouchableOpacity
          style={styles.challengeCard}
          onPress={() => navigation.navigate('Challenges')}
          activeOpacity={0.85}
        >
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{DAILY_CHALLENGE.title}</Text>
            <View style={styles.xpPill}>
              <Text style={styles.xpText}>+{DAILY_CHALLENGE.xp} XP</Text>
            </View>
          </View>

          <Text style={styles.challengeDesc} numberOfLines={2}>
            {DAILY_CHALLENGE.description}
          </Text>

          <View style={styles.challengeFooter}>
            <View style={styles.difficultyTag}>
              <Text style={styles.difficultyText}>{DAILY_CHALLENGE.difficulty}</Text>
            </View>
            <View style={styles.solveAction}>
              <Text style={styles.solveText}>Solve Challenge</Text>
              <ArrowRight size={14} color={colors.dark.primaryLight} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick SQL Practice */}
        <View style={styles.sectionHeader}>
          <Code size={18} color={colors.dark.secondary} />
          <Text style={styles.sectionTitle}>Quick Practice</Text>
        </View>

        <View style={styles.quickPracticeGrid}>
          {['SELECT', 'WHERE', 'JOIN', 'GROUP BY'].map((topic, i) => (
            <TouchableOpacity
              key={i}
              style={styles.practicePill}
              onPress={() => navigation.navigate('SQLLab', { initialQuery: `SELECT * FROM students;` })}
              activeOpacity={0.75}
            >
              <Text style={styles.practiceText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  greetingHeader: {
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  continueCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 10,
  },
  continueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  continueBadgeText: {
    color: colors.dark.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  lessonSubtitle: {
    fontSize: 13,
    color: colors.dark.textMuted,
  },
  progressContainer: {
    gap: 6,
    marginVertical: 4,
  },
  progressText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 4,
  },
  continueButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  challengeCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    gap: 8,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  xpPill: {
    backgroundColor: colors.dark.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: colors.dark.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  challengeDesc: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  difficultyTag: {
    backgroundColor: colors.dark.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    color: colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  solveAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  solveText: {
    color: colors.dark.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  quickPracticeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  practicePill: {
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  practiceText: {
    color: colors.dark.secondaryLight,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
