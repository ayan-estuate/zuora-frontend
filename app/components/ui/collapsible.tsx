import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

export function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ marginTop: 16, gap: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{title}</Text>
      <View style={{ gap: 8 }}>{children}</View>
    </View>
  );
}


