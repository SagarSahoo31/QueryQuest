import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Clock, Database } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface ResultTableProps {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTimeMs: number;
}

export const ResultTable: React.FC<ResultTableProps> = ({
  columns,
  rows,
  rowCount,
  executionTimeMs,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.metricsBar}>
        <View style={styles.metricItem}>
          <Database size={14} color={colors.dark.primaryLight} />
          <Text style={styles.metricText}>
            {rowCount} {rowCount === 1 ? 'row' : 'rows'} returned
          </Text>
        </View>

        <View style={styles.metricItem}>
          <Clock size={14} color={colors.dark.secondary} />
          <Text style={styles.metricText}>{executionTimeMs} ms</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {columns.map((col, index) => (
              <View key={index} style={styles.headerCell}>
                <Text style={styles.headerText}>{col}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {rows.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Query executed successfully. 0 rows returned.</Text>
            </View>
          ) : (
            rows.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[
                  styles.dataRow,
                  rowIndex % 2 === 1 && styles.altRow,
                ]}
              >
                {row.map((val, cellIndex) => (
                  <View key={cellIndex} style={styles.dataCell}>
                    <Text style={styles.cellText}>{String(val ?? 'NULL')}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.surfaceBorder,
    overflow: 'hidden',
    marginTop: 12,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.dark.surfaceHighlight,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.surfaceBorder,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tableScroll: {
    maxHeight: 240,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.surfaceBorder,
  },
  headerCell: {
    width: 130,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: colors.dark.surfaceBorder,
  },
  headerText: {
    color: colors.dark.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  altRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  dataCell: {
    width: 130,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
  },
  cellText: {
    color: colors.dark.textPrimary,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.dark.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
