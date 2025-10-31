import React, { ReactNode } from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(href)}>
      <Text style={{ color: '#2563eb' }}>{children}</Text>
    </TouchableOpacity>
  );
}


