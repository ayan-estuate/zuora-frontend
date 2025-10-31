import React from 'react';
import { View } from 'react-native';

export function IconSymbol({ size = 24 }: { size?: number; name?: string; color?: string; style?: any }) {
  return <View style={{ width: size, height: size }} />;
}


