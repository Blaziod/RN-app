import {TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import tw from '../../lib/tailwind';
import StyledText from '../Styledtext';
import {Loading} from '../Loader';

interface IButton {
  title?: string;
  primary?: boolean;
  full?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  onPress?: () => void;
  loadingPadding?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}
const Button = ({
  children,
  title = '',
  primary = true,
  full = true,
  onPress,
  style = {},
  loading = false,
  textStyle = {},
  loadingPadding = 8,
  disabled = false,
}: IButton) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={!loading ? onPress : () => null}
      style={tw.style(
        'py-2.5 flex justify-center rounded-lg',
        'shadow-offset-[0px]/[6px] elevation-2',
        'shadow-[rgba(16,24,40,0.05)]',
        primary && 'bg-primary',
        full && 'w-full',
        style,
      )}>
      {!loading ? (
        <StyledText
          style={tw.style(
            'text-center text-white dark:text-white font-medium',
            textStyle,
          )}>
          {children ? children : title}
        </StyledText>
      ) : (
        <Loading
          style={tw.style('flex-1 justify-center items-center h-4', {
            paddingVertical: loadingPadding,
          })}
          fill="#fff"
        />
      )}
    </TouchableOpacity>
  );
};

export default Button;
