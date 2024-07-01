import {View, ViewStyle} from 'react-native';
import React from 'react';
import {Style} from 'twrnc';
import tw from '../../lib/tailwind';

export default function Divider({style}: {style?: ViewStyle | Style}) {
  return <View style={tw.style('w-full h-[1px] bg-[#EBEBEB]', style)} />;
}
