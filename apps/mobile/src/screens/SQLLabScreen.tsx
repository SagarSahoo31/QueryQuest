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
import { Play, Database, Table, RotateCcw, Copy, History, Sparkles, ChevronDown } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Header } from '../components/Header';
import { SQLToolbar } from '../components/SQLToolbar';
import { ResultTable } from '../components/ResultTable';
import { ErrorBanner } from '../components/ErrorBanner';
import { COLLEGE_DATABASE, MOCK_USER, mockExecuteSQL } from '../data/mockData';
import { SQLExecutionResult, TableSchema } from '../types';

export const SQLLabScreen = ({ route }: any) => {
  const [selectedTable, setSelectedTable] = useState<TableSchema>(COLLEGE_DATABASE.tables[0]);
  const [userQuery, setUserQuery] = useState(
    route.params?.initialQuery || 'SELECT name, age, cgpa\nFROM students\nWHERE cgpa >= 8.5;'
  );
  const [executionResult, setExecutionResult] = useState<SQLExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'explorer' | 'history'>('editor');
  const [queryHistory, setQueryHistory] = useState<string[]>([
    'SELECT * FROM students;',
    'SELECT name, email FROM students WHERE department_id = 101;',
    'SELECT * FROM courses;',
  ]);

  const handleRunQuery = () => {
    const res = mockExecuteSQL(userQuery);
    setExecutionResult(res);

    if (userQuery && !queryHistory.includes(userQuery)) {
      setQueryHistory((prev: string[]) => [userQuery, ...prev.slice(0, 9)]);
    }
  };

  const handleClear = () => {
    setUserQuery('');
    setExecutionResult(null);
  };

  const insertSnippet = (snippet: string) => {
    setUserQuery((prev: string) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const insertSampleQueryForTable = (tableName: string) => {
    const sample = `SELECT * FROM ${tableName} LIMIT 10;`;
    setUserQuery(sample);
    setActiveTab('editor');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        streakDays={MOCK_USER.streakDays}
        xp={MOCK_USER.xp}
        levelTitle={MOCK_USER.levelTitle}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Top Playground Header */}
        <View style={styles.topSelectorBar}>
          <View style={styles.dbSelector}>
            <Database size={16} color={colors.dark.primaryLight} />
            <Text style={styles.dbName}>{COLLEGE_DATABASE.name}</Text>
            <View style={styles.engineBadge}>
              <Text style={styles.engineText}>PostgreSQL</Text>
            </View>
          </View>

          {/* Module Sub-Tabs */}
          <View style={styles.tabToggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, activeTab === 'editor' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('editor')}
            >
              <Text style={[styles.toggleText, activeTab === 'editor' && styles.toggleTextActive]}>
                Editor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, activeTab === 'explorer' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('explorer')}
            >
              <Text style={[styles.toggleText, activeTab === 'explorer' && styles.toggleTextActive]}>
                Schema
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, activeTab === 'history' && styles.toggleBtnActive]}
              onPress={() => setActiveTab('history')}
            >
              <Text style={[styles.toggleText, activeTab === 'history' && styles.toggleTextActive]}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'editor' && (
          <ScrollView contentContainerStyle={styles.scrollEditor}>
            {/* Editor Box */}
            <View style={styles.editorCard}>
              <View style={styles.editorHeader}>
                <Text style={styles.editorTitle}>SQL EDITOR</Text>
                <View style={styles.editorActions}>
                  <TouchableOpacity style={styles.iconBtn} onPress={handleClear}>
                    <RotateCcw size={14} color={colors.dark.textMuted} />
                    <Text style={styles.iconBtnText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                style={styles.editorInput}
                multiline
                value={userQuery}
                onChangeText={setUserQuery}
                placeholder="Write your SQL query here..."
                placeholderTextColor={colors.dark.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <SQLToolbar onInsertSnippet={insertSnippet} />

              <TouchableOpacity
                style={styles.runButton}
                onPress={handleRunQuery}
                activeOpacity={0.85}
              >
                <Play size={18} color="#FFF" fill="#FFF" />
                <Text style={styles.runButtonText}>RUN QUERY ▶</Text>
              </TouchableOpacity>
            </View>

            {/* Results Section */}
            {executionResult && (
              <View style={styles.resultSection}>
                {executionResult.success ? (
                  <ResultTable
                    columns={executionResult.columns || []}
                    rows={executionResult.rows || []}
                    rowCount={executionResult.rowCount || 0}
                    executionTimeMs={executionResult.executionTimeMs || 0}
                  />
                ) : (
                  <ErrorBanner
                    friendlyMessage={executionResult.error?.friendlyMessage || ''}
                    hint={executionResult.error?.hint}
                    suggestedFix={executionResult.error?.suggestedFix}
                    onApplyFix={(fix) => {
                      setUserQuery(fix);
                      setExecutionResult(null);
                    }}
                  />
                )}
              </View>
            )}
          </ScrollView>
        )}

        {/* Database Explorer Tab */}
        {activeTab === 'explorer' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionHeader}>TABLES IN COLLEGE DB</Text>
            <View style={styles.tablesPillRow}>
              {COLLEGE_DATABASE.tables.map((t) => (
                <TouchableOpacity
                  key={t.name}
                  style={[
                    styles.tablePill,
                    selectedTable.name === t.name && styles.tablePillActive,
                  ]}
                  onPress={() => setSelectedTable(t)}
                >
                  <Table size={14} color={selectedTable.name === t.name ? '#FFF' : colors.dark.textMuted} />
                  <Text
                    style={[
                      styles.tablePillText,
                      selectedTable.name === t.name && styles.tablePillTextActive,
                    ]}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Table Details */}
            <View style={styles.schemaCard}>
              <View style={styles.schemaCardHeader}>
                <View>
                  <Text style={styles.schemaName}>{selectedTable.name}</Text>
                  <Text style={styles.schemaSub}>{selectedTable.rowCount} sample rows</Text>
                </View>
                <TouchableOpacity
                  style={styles.sampleBtn}
                  onPress={() => insertSampleQueryForTable(selectedTable.name)}
                >
                  <Sparkles size={14} color={colors.dark.primaryLight} />
                  <Text style={styles.sampleBtnText}>Sample Query</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.columnHeaderLabel}>COLUMNS & TYPES</Text>
              {selectedTable.columns.map((col, i) => (
                <View key={i} style={styles.columnRow}>
                  <View style={styles.colNameBox}>
                    <Text style={styles.colName}>{col.name}</Text>
                    {col.isPk && <View style={styles.pkBadge}><Text style={styles.keyText}>PK</Text></View>}
                    {col.isFk && <View style={styles.fkBadge}><Text style={styles.keyText}>FK</Text></View>}
                  </View>
                  <Text style={styles.colType}>{col.type}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionHeader}>RECENT QUERIES</Text>
            {queryHistory.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={styles.historyCard}
                onPress={() => {
                  setUserQuery(q);
                  setActiveTab('editor');
                }}
              >
                <History size={16} color={colors.dark.primaryLight} />
                <Text style={styles.historyText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
  topSelectorBar: {
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 8,
  },
  dbSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dbName: {
    color: colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  engineBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  engineText: {
    color: colors.dark.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.dark.surfaceHighlight,
    borderRadius: 8,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: colors.dark.primary,
  },
  toggleText: {
    color: colors.dark.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  scrollEditor: {
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  editorCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 10,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editorTitle: {
    color: colors.dark.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  editorActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtnText: {
    color: colors.dark.textMuted,
    fontSize: 12,
  },
  editorInput: {
    backgroundColor: colors.dark.editorBg,
    color: colors.dark.editorText,
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 4,
  },
  runButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  resultSection: {
    marginTop: 8,
  },
  sectionHeader: {
    color: colors.dark.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tablesPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  tablePillActive: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primaryLight,
  },
  tablePillText: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tablePillTextActive: {
    color: '#FFF',
  },
  schemaCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    gap: 10,
    marginTop: 8,
  },
  schemaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.surfaceBorder,
    paddingBottom: 10,
  },
  schemaName: {
    color: colors.dark.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  schemaSub: {
    color: colors.dark.textMuted,
    fontSize: 12,
  },
  sampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sampleBtnText: {
    color: colors.dark.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  columnHeaderLabel: {
    color: colors.dark.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  columnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  colNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colName: {
    color: colors.dark.textPrimary,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  pkBadge: {
    backgroundColor: colors.dark.warningBg,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fkBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  keyText: {
    color: colors.dark.accent,
    fontSize: 9,
    fontWeight: '800',
  },
  colType: {
    color: colors.dark.editorKeyword,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.dark.surface,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  historyText: {
    color: colors.dark.textPrimary,
    fontSize: 13,
    fontFamily: 'monospace',
    flex: 1,
  },
});
