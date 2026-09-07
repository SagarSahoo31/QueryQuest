import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { CheckCircle2, Lock, Play, BookOpen, X, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Header } from '../components/Header';
import { ProgressBar } from '../components/ProgressBar';
import { CURRICULUM_TOPICS, MOCK_USER } from '../data/mockData';
import { LearningTopic, Lesson } from '../types';

export const LearnScreen = ({ navigation }: any) => {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);

  const handleNodePress = (topic: LearningTopic) => {
    if (topic.status !== 'locked') {
      setSelectedTopic(topic);
    }
  };

  const startLesson = (lesson: Lesson) => {
    setSelectedTopic(null);
    navigation.navigate('Lesson', { lesson });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        streakDays={MOCK_USER.streakDays}
        xp={MOCK_USER.xp}
        levelTitle={MOCK_USER.levelTitle}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.mainTitle}>SQL Journey</Text>
          <Text style={styles.subTitle}>Follow the structured path to database mastery</Text>
        </View>

        {/* Visual Learning Path */}
        <View style={styles.pathContainer}>
          {CURRICULUM_TOPICS.map((topic, index) => {
            const isCompleted = topic.status === 'completed';
            const isCurrent = topic.status === 'current';
            const isLocked = topic.status === 'locked';

            return (
              <View key={topic.id} style={styles.nodeWrapper}>
                {/* Node Line Connector */}
                {index > 0 && (
                  <View
                    style={[
                      styles.connectorLine,
                      isCompleted ? styles.connectorCompleted : styles.connectorLocked,
                    ]}
                  />
                )}

                {/* Main Interactive Node */}
                <TouchableOpacity
                  style={[
                    styles.nodeCircle,
                    isCompleted && styles.nodeCircleCompleted,
                    isCurrent && styles.nodeCircleCurrent,
                    isLocked && styles.nodeCircleLocked,
                  ]}
                  onPress={() => handleNodePress(topic)}
                  activeOpacity={isLocked ? 1 : 0.8}
                >
                  {isCompleted && <CheckCircle2 size={24} color="#FFF" />}
                  {isCurrent && <Play size={24} color="#FFF" fill="#FFF" />}
                  {isLocked && <Lock size={20} color={colors.dark.textMuted} />}
                </TouchableOpacity>

                {/* Node Details Card */}
                <TouchableOpacity
                  style={[
                    styles.topicCard,
                    isCurrent && styles.topicCardCurrent,
                    isLocked && styles.topicCardLocked,
                  ]}
                  onPress={() => handleNodePress(topic)}
                  activeOpacity={isLocked ? 1 : 0.8}
                >
                  <View style={styles.topicCardHeader}>
                    <Text style={styles.levelTag}>LEVEL {topic.level}</Text>
                    {isCurrent && (
                      <View style={styles.activePill}>
                        <Text style={styles.activeText}>IN PROGRESS</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDesc}>{topic.description}</Text>

                  {!isLocked && (
                    <View style={styles.progressRow}>
                      <ProgressBar progress={topic.progressPercentage} height={6} />
                      <Text style={styles.progressText}>
                        {topic.completedLessons}/{topic.totalLessons} Lessons
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Lesson Selection Modal */}
      <Modal
        visible={selectedTopic !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedTopic(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalLevelTag}>LEVEL {selectedTopic?.level}</Text>
                <Text style={styles.modalTitle}>{selectedTopic?.title}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedTopic(null)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>{selectedTopic?.description}</Text>

            <Text style={styles.sectionHeader}>LESSONS IN THIS TOPIC</Text>

            {selectedTopic?.lessons.length === 0 ? (
              <View style={styles.emptyLessonsBox}>
                <BookOpen size={24} color={colors.dark.textMuted} />
                <Text style={styles.emptyLessonsText}>
                  Lesson content ready! Tap below to launch your first SELECT interactive session.
                </Text>
                <TouchableOpacity
                  style={styles.startModalButton}
                  onPress={() =>
                    startLesson({
                      id: 'demo_lesson',
                      level: selectedTopic.level,
                      topicId: selectedTopic.id,
                      title: 'Your First SELECT',
                      subtitle: 'Learn how to query database columns',
                      description: 'SELECT tells SQL which columns you want to view.',
                      conceptText:
                        'Tables store data in columns and rows. The SELECT statement is used to pick the exact columns you want to inspect.',
                      codeExample: 'SELECT name, age FROM students;',
                      codeExplanation:
                        '• SELECT name, age: target columns\n• FROM students: source table',
                      xpReward: 50,
                      exercises: CURRICULUM_TOPICS[1].lessons[0].exercises,
                    })
                  }
                >
                  <Sparkles size={16} color="#FFF" />
                  <Text style={styles.startModalButtonText}>START LESSON (+50 XP)</Text>
                </TouchableOpacity>
              </View>
            ) : (
              selectedTopic?.lessons.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonRow}
                  onPress={() => startLesson(lesson)}
                >
                  <View style={styles.lessonIconBox}>
                    <BookOpen size={18} color={colors.dark.primaryLight} />
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonRowTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonRowSub}>{lesson.subtitle}</Text>
                  </View>
                  <Text style={styles.xpTag}>+{lesson.xpReward} XP</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  headerTitleContainer: {
    marginBottom: 20,
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
  pathContainer: {
    alignItems: 'center',
    gap: 16,
  },
  nodeWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    position: 'relative',
  },
  connectorLine: {
    position: 'absolute',
    left: 23,
    top: -24,
    width: 4,
    height: 28,
    zIndex: -1,
  },
  connectorCompleted: {
    backgroundColor: colors.dark.secondary,
  },
  connectorLocked: {
    backgroundColor: colors.dark.surfaceBorder,
  },
  nodeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.dark.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.dark.surfaceBorder,
  },
  nodeCircleCompleted: {
    backgroundColor: colors.dark.secondary,
    borderColor: colors.dark.secondaryLight,
  },
  nodeCircleCurrent: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primaryLight,
  },
  nodeCircleLocked: {
    backgroundColor: colors.dark.surface,
    borderColor: colors.dark.surfaceBorder,
  },
  topicCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 4,
  },
  topicCardCurrent: {
    borderColor: colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  topicCardLocked: {
    opacity: 0.6,
  },
  topicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.dark.primaryLight,
    letterSpacing: 0.5,
  },
  activePill: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark.textPrimary,
  },
  topicDesc: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  progressRow: {
    marginTop: 6,
    gap: 4,
  },
  progressText: {
    fontSize: 11,
    color: colors.dark.textMuted,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.dark.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  modalLevelTag: {
    color: colors.dark.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalDesc: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    color: colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  emptyLessonsBox: {
    backgroundColor: colors.dark.surfaceHighlight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  emptyLessonsText: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  startModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    width: '100%',
  },
  startModalButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surfaceHighlight,
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  lessonIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonRowTitle: {
    color: colors.dark.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  lessonRowSub: {
    color: colors.dark.textMuted,
    fontSize: 12,
  },
  xpTag: {
    color: colors.dark.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
