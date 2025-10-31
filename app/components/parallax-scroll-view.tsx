import React, { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

export default function ParallaxScrollView({ headerImage, children }: { headerImage?: ReactNode; children: ReactNode; headerBackgroundColor?: any }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {headerImage ? <View style={{ marginBottom: 16 }}>{headerImage}</View> : null}
      {children}
    </ScrollView>
  );
}


