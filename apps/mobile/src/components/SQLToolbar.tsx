import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface SQLToolbarProps {
  onInsertSnippet: (snippet: string) => void;
}

const SNIPPETS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'JOIN',
  'ON',
  'GROUP BY',
  'ORDER BY',
  'COUNT(*)',
  '=',
  '>',
  '<',
  ',',
  ';',
];

export const SQLToolbar: React.FC<SQLToolbarProps> = ({ onInsertSnippet }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SNIPPETS.map((snippet, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keyButton}
            onPress={() => onInsertSnippet(snippet)}
            activeOpacity={0.7}
          >
            <Text style={styles.keyText}>{snippet}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.surfaceHighlight,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    paddingVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 8,
  },
  keyButton: {
    backgroundColor: colors.dark.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
  },
  keyText: {
    color: colors.dark.editorKeyword,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
