import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Check, Sparkles, AlertCircle, Play, HelpCircle } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { SQLToolbar } from '../components/SQLToolbar';
import { ResultTable } from '../components/ResultTable';
import { Lesson, Exercise } from '../types';
import { mockExecuteSQL } from '../data/mockData';

export const LessonScreen = ({ route, navigation }: any) => {
  const lesson: Lesson = route.params?.lesson || {
    title: 'Your First SELECT',
    subtitle: 'Learn how to query database columns',
    conceptText: 'SELECT tells SQL which columns you want to view from a database table.',
    codeExample: 'SELECT name, age FROM students;',
    codeExplanation: '• SELECT name, age: columns to retrieve\n• FROM students: source table',
    xpReward: 50,
    exercises: [
      {
        id: 'ex_1',
        type: 'predict',
        question: 'What will this query return?',
        codeSnippet: 'SELECT name, cgpa FROM students;',
        options: [
          'All columns in the students table',
          'Only the "name" and "cgpa" columns for all students',
          'Only students with CGPA > 8.0',
        ],
        explanation: 'SELECT name, cgpa fetches only those two columns for every row in the students table.',
        xp: 20,
      },
      {
        id: 'ex_2',
        type: 'write',
        question: 'Write a SQL query to display the name and email of all students from the students table.',
        expectedQuery: 'SELECT name, email FROM students;',
        hints: ['Use: SELECT name, email FROM students;'],
        explanation: 'Excellent! SELECT name, email FROM students; extracts student names and email addresses.',
        xp: 30,
      },
    ],
  };

  const [stepIndex, setStepIndex] = useState(0); // 0 = Concept, 1 = Exercise 1, 2 = Exercise 2...
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userQuery, setUserQuery] = useState('SELECT name, email FROM students;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const currentExercise: Exercise | undefined = lesson.exercises?.[stepIndex - 1];

  const handlePredictSubmit = () => {
    if (selectedOption === 1) {
      setFeedback({
        isCorrect: true,
        message: '🎉 Correct! SELECT name, cgpa extracts only those two columns.',
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: '❌ Not quite. Notice how SELECT specifies name and cgpa without filtering rows.',
      });
    }
  };

  const handleExecuteQuery = () => {
    const res = mockExecuteSQL(userQuery);
    setQueryResult(res);

    if (res.success) {
      setFeedback({
        isCorrect: true,
        message: '🎉 Perfect! Your query executed successfully and returned the correct columns.',
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: res.error?.friendlyMessage || 'Query execution failed.',
      });
    }
  };

  const insertSnippet = (snippet: string) => {
    setUserQuery((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const handleNextStep = () => {
    setFeedback(null);
    setSelectedOption(null);
    setQueryResult(null);

    if (stepIndex < (lesson.exercises?.length || 0)) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Completed lesson
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.dark.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>{lesson.title}</Text>
          <View style={styles.xpBadge}>
            <Sparkles size={14} color={colors.dark.secondary} />
            <Text style={styles.xpText}>+{lesson.xpReward} XP</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {stepIndex === 0 ? (
            /* STEP 0 — CONCEPT & EXAMPLE */
            <View style={styles.card}>
              <Text style={styles.sectionTag}>STEP 1: CONCEPT</Text>
              <Text style={styles.conceptTitle}>What does SELECT do?</Text>
              <Text style={styles.conceptText}>{lesson.conceptText}</Text>

              <Text style={[styles.sectionTag, { marginTop: 16 }]}>EXAMPLE QUERY</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{lesson.codeExample}</Text>
              </View>
              <Text style={styles.explanationText}>{lesson.codeExplanation}</Text>
            </View>
          ) : currentExercise?.type === 'predict' ? (
            /* STEP — PREDICT QUESTION */
            <View style={styles.card}>
              <Text style={styles.sectionTag}>PREDICT THE OUTPUT</Text>
              <Text style={styles.conceptTitle}>{currentExercise.question}</Text>

              {currentExercise.codeSnippet && (
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{currentExercise.codeSnippet}</Text>
                </View>
              )}

              <View style={styles.optionsList}>
                {currentExercise.options?.map((opt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionButton,
                      selectedOption === idx && styles.optionSelected,
                    ]}
                    onPress={() => setSelectedOption(idx)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedOption === idx && styles.optionTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            /* STEP — PRACTICE WRITE SQL */
            <View style={styles.card}>
              <Text style={styles.sectionTag}>PRACTICE EXERCISE</Text>
              <Text style={styles.conceptTitle}>{currentExercise?.question}</Text>

              <Text style={styles.label}>WRITE YOUR SQL QUERY:</Text>
              <TextInput
                style={styles.editorInput}
                multiline
                value={userQuery}
                onChangeText={setUserQuery}
                placeholder="Enter SQL here..."
                placeholderTextColor={colors.dark.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <SQLToolbar onInsertSnippet={insertSnippet} />

              <TouchableOpacity
                style={styles.runButton}
                onPress={handleExecuteQuery}
                activeOpacity={0.85}
              >
                <Play size={16} color="#FFF" fill="#FFF" />
                <Text style={styles.runButtonText}>RUN QUERY ▶</Text>
              </TouchableOpacity>

              {queryResult?.success && (
                <ResultTable
                  columns={queryResult.columns}
                  rows={queryResult.rows}
                  rowCount={queryResult.rowCount}
                  executionTimeMs={queryResult.executionTimeMs}
                />
              )}
            </View>
          )}

          {/* Feedback Card */}
          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                feedback.isCorrect ? styles.feedbackSuccess : styles.feedbackError,
              ]}
            >
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </View>
          )}
        </ScrollView>

        {/* Footer Navigation Action */}
        <View style={styles.footerAction}>
          {stepIndex === 0 ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStepIndex(1)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>GOT IT, LET'S PRACTICE!</Text>
            </TouchableOpacity>
          ) : currentExercise?.type === 'predict' && !feedback ? (
            <TouchableOpacity
              style={[styles.primaryButton, selectedOption === null && styles.disabledButton]}
              disabled={selectedOption === null}
              onPress={handlePredictSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>CHECK ANSWER</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNextStep}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {stepIndex < (lesson.exercises?.length || 0)
                  ? 'NEXT EXERCISE'
                  : 'COMPLETE LESSON 🎉'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    backgroundColor: colors.dark.surface,
  },
  backButton: {
    padding: 4,
  },
  topTitle: {
    color: colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.dark.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: colors.dark.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 10,
  },
  sectionTag: {
    color: colors.dark.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  conceptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.textPrimary,
  },
  conceptText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    lineHeight: 20,
  },
  codeBox: {
    backgroundColor: colors.dark.editorBg,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  codeText: {
    color: colors.dark.editorKeyword,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
  },
  explanationText: {
    color: colors.dark.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  optionsList: {
    gap: 10,
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: colors.dark.surfaceHighlight,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  optionSelected: {
    borderColor: colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  optionText: {
    color: colors.dark.textPrimary,
    fontSize: 14,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: colors.dark.primaryLight,
  },
  label: {
    color: colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  editorInput: {
    backgroundColor: colors.dark.editorBg,
    color: colors.dark.editorText,
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.secondary,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  runButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: colors.dark.successBg,
    borderColor: colors.dark.successBorder,
  },
  feedbackError: {
    backgroundColor: colors.dark.errorBg,
    borderColor: colors.dark.errorBorder,
  },
  feedbackText: {
    color: colors.dark.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  footerAction: {
    padding: 16,
    backgroundColor: colors.dark.surface,
    borderTopWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  primaryButton: {
    backgroundColor: colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
