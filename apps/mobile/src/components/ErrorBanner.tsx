import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface ErrorBannerProps {
  friendlyMessage: string;
  hint?: string;
  suggestedFix?: string;
  onApplyFix?: (fix: string) => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  friendlyMessage,
  hint,
  suggestedFix,
  onApplyFix,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertCircle size={18} color={colors.dark.error} />
        <Text style={styles.title}>Something went wrong</Text>
      </View>

      <Text style={styles.message}>{friendlyMessage}</Text>

      {hint && (
        <View style={styles.hintBox}>
          <HelpCircle size={14} color={colors.dark.accent} />
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}

      {suggestedFix && onApplyFix && (
        <TouchableOpacity
          style={styles.fixButton}
          onPress={() => onApplyFix(suggestedFix)}
          activeOpacity={0.8}
        >
          <CheckCircle2 size={14} color="#FFF" />
          <Text style={styles.fixButtonText}>Apply Suggested Fix</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.errorBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark.errorBorder,
    padding: 14,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  title: {
    color: colors.dark.error,
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    color: colors.dark.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  hintText: {
    color: colors.dark.accent,
    fontSize: 12,
    flex: 1,
  },
  fixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  fixButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
