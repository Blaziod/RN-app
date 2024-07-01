import React from 'react';
import {Text} from 'react-native';
import tw from '../../lib/tailwind';

const StyledText = ({children, style = {}, numberOfLines = undefined}) => {
  return (
    <Text
      style={tw.style('text-black font-custom', style)}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

export default StyledText;
