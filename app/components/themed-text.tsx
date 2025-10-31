import React from 'react';
import { Text, TextProps } from 'react-native';

type ThemedTextProps = TextProps & { type?: 'title' | 'subtitle' | 'defaultSemiBold' | 'link' };

export function ThemedText({ type, style, ...rest }: ThemedTextProps) {
  let fontWeight: any;
  if (type === 'title' || type === 'subtitle' || type === 'defaultSemiBold' || type === 'link') {
    fontWeight = '600';
  }
  return <Text style={[fontWeight ? { fontWeight } : null, style]} {...rest} />;
}


