import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1 or percentage 0 to 100
  height?: number;
  barColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  barColor = colors.dark.primary,
}) => {
  const normalizedProgress = progress > 1 ? progress / 100 : progress;
  const clamped = Math.min(Math.max(normalizedProgress, 0), 1);

  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: barColor,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.dark.surfaceHighlight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 10,
  },
});
