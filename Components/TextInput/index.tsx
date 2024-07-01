import React, {useState} from 'react';
import {View, TextInput as TI, ViewStyle, TextInputProps} from 'react-native';
import tw from '../../lib/tailwind';
import SearchIcon from '../../customSvg/SearchIcon';
import EyeIcon from '../../customSvg/EyeIcon';

interface IProps extends TextInputProps {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  variant?: 'default' | 'success' | 'danger';
  password?: boolean;
  isSearch?: boolean;
  iconRight?: React.ReactNode;
}

const TextInput = React.forwardRef<TI, IProps>(
  (
    {
      style,
      containerStyle,
      variant = 'default',
      password,
      isSearch,
      iconRight,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(password);

    return (
      <View
        style={tw.style(
          'h-[44px] items-center justify-center relative',
          containerStyle,
        )}>
        <TI
          ref={ref}
          {...props}
          placeholderTextColor={'#667085'}
          style={tw.style(
            'h-[44px] px-3.5 flex-1 w-full justify-center border-[1px] rounded-lg text-black dark:text-white text-left shadow-[rgba(16,24,40,0.05)]',
            props.value && 'pb-2',
            variant === 'default' && 'border-[#D0D5DD]',
            variant === 'success' && {
              borderBottomWidth: 1,
              borderColor: '#1CB66C',
            },
            variant === 'danger' && {
              borderBottomWidth: 1,
              borderColor: '#E31B23',
            },
            style,
          )}
          secureTextEntry={showPassword}
          autoComplete="off"
          autoCapitalize="none"
        />
        <View style={tw`absolute right-4 `}>
          {isSearch ? <SearchIcon fill={'#fff'} /> : null}
          {password && <EyeIcon onPress={() => setShowPassword(pr => !pr)} />}
          {iconRight ? iconRight : null}
        </View>
      </View>
    );
  },
);

export default TextInput;
