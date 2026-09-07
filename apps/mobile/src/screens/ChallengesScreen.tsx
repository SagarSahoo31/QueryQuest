import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Trophy, Flame, CheckCircle, ArrowRight, Zap } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Header } from '../components/Header';
import { MOCK_USER, MOCK_CHALLENGES } from '../data/mockData';

export const ChallengesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        streakDays={MOCK_USER.streakDays}
        xp={MOCK_USER.xp}
        levelTitle={MOCK_USER.levelTitle}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.mainTitle}>SQL Challenges</Text>
          <Text style={styles.subTitle}>Test your query skills against real engineering problems</Text>
        </View>

        {/* Daily Banner */}
        <View style={styles.dailyBanner}>
          <View style={styles.bannerHeader}>
            <View style={styles.fireTag}>
              <Flame size={14} color={colors.dark.accent} />
              <Text style={styles.fireText}>FEATURED DAILY</Text>
            </View>
            <Text style={styles.xpText}>+{MOCK_CHALLENGES[0].xp} XP</Text>
          </View>

          <Text style={styles.dailyTitle}>{MOCK_CHALLENGES[0].title}</Text>
          <Text style={styles.dailyDesc}>{MOCK_CHALLENGES[0].description}</Text>

          <TouchableOpacity
            style={styles.solveButton}
            onPress={() =>
              navigation.navigate('SQLLab', {
                initialQuery: `-- ${MOCK_CHALLENGES[0].title}\nSELECT name, cgpa\nFROM students\nWHERE department_id = 101 AND cgpa >= 8.0\nORDER BY cgpa DESC;`,
              })
            }
            activeOpacity={0.85}
          >
            <Zap size={16} color="#FFF" />
            <Text style={styles.solveButtonText}>START DAILY CHALLENGE</Text>
          </TouchableOpacity>
        </View>

        {/* All Challenges List */}
        <Text style={styles.sectionTitle}>ALL PRACTICE CHALLENGES</Text>

        <View style={styles.challengesList}>
          {MOCK_CHALLENGES.map((challenge) => (
            <TouchableOpacity
              key={challenge.id}
              style={styles.challengeCard}
              onPress={() =>
                navigation.navigate('SQLLab', {
                  initialQuery: `-- ${challenge.title}\n`,
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{challenge.title}</Text>
                {challenge.completed ? (
                  <View style={styles.doneBadge}>
                    <CheckCircle size={14} color={colors.dark.secondary} />
                    <Text style={styles.doneText}>Completed</Text>
                  </View>
                ) : (
                  <View style={styles.xpPill}>
                    <Text style={styles.xpPillText}>+{challenge.xp} XP</Text>
                  </View>
                )}
              </View>

              <Text style={styles.cardDesc}>{challenge.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.difficultyTag}>
                  <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                </View>
                <View style={styles.actionRow}>
                  <Text style={styles.actionText}>Solve</Text>
                  <ArrowRight size={14} color={colors.dark.primaryLight} />
                </View>
              </View>
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
  titleBox: {
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  subTitle: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    marginTop: 2,
  },
  dailyBanner: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 10,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fireTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dark.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fireText: {
    color: colors.dark.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  xpText: {
    color: colors.dark.accent,
    fontSize: 14,
    fontWeight: '800',
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  dailyDesc: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },
  solveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.primary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 4,
  },
  solveButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  challengesList: {
    gap: 12,
  },
  challengeCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doneText: {
    color: colors.dark.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  xpPill: {
    backgroundColor: colors.dark.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  xpPillText: {
    color: colors.dark.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    color: colors.dark.textSecondary,
    lineHeight: 18,
  },
  cardFooter: {
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: colors.dark.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
});
