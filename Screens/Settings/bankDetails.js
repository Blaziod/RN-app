/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {useState} from 'react';
import {Svg, Path} from 'react-native-svg';

const BankSettings = () => {
  return (
    <View>
      <Text
        style={[
          {
            fontSize: 14,
            fontFamily: 'Manrope-ExtraBold',
            color: '#fff',
            paddingBottom: 20,
          },
        ]}>
        Bank Details
      </Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          paddingHorizontal: 15,
          paddingVertical: 50,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none">
            <Path
              d="M18.0016 44H30.0016M10.0016 18C10.0016 10.268 16.2696 4 24.0016 4C31.7336 4 38.0016 10.268 38.0016 18V23.1556C38.0016 26.3144 38.9366 29.4025 40.6888 32.0308L41.668 33.4996C41.836 33.7516 41.7184 34.0944 41.4311 34.1902C30.1174 37.9614 17.8858 37.9614 6.5721 34.1902C6.28478 34.0944 6.16718 33.7516 6.33517 33.4996L7.31441 32.0308C9.0666 29.4025 10.0016 26.3144 10.0016 23.1556V18Z"
              stroke="#FF6DFB"
              stroke-width="3"
              stroke-linecap="round"
            />
          </Svg>
        </View>

        <Text
          style={{
            color: 'fff',
            fontSize: 14,
            fontFamily: 'Manrope-Regular',
            textAlign: 'center',
            paddingBottom: 20,
          }}>
          You have not added your account details. please update your bank
          account.
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            backgroundColor: '#CB29BE',
            height: 40,
            padding: 4,
            borderRadius: 100,
            width: '80%',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none">
            <Path
              d="M9.25 3V15M15.25 9L3.25 9"
              stroke="white"
              stroke-linecap="round"
            />
          </Svg>
          <Text
            style={{
              color: 'fff',
              fontSize: 14,
              fontFamily: 'Manrope-ExtraBold',
              alignSelf: 'center',
            }}>
            Add Bank
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BankSettings;
