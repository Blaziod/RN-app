/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {Svg, Path, G} from 'react-native-svg';

const EarnModalContent = () => {
  return (
    <>
      <SafeAreaView>
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 30,
              paddingVertical: 30,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Manrope-ExtraBold',
                paddingBottom: 10,
                paddingTop: 20,
              }}>
              How would you like to pay?
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 7,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(177, 177, 177, 0.1)',
                height: 200,
                width: '100%',
                borderRadius: 6,
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  paddingBottom: 39,
                  alignSelf: 'center',
                  paddingTop: 50,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    alignSelf: 'center',
                    fontFamily: 'Manrope-Regular',
                  }}>
                  Total Pay
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 30,
                    fontFamily: 'Manrope-Medium',
                  }}>
                  ₦589 .90
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Manrope-Regular',
                    color: '#B1B1B1',
                  }}>
                  Amount due to task
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#B1B1B1',
                    fontFamily: 'Manrope-Regular',
                  }}>
                  $500
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Manrope-Regular',
                    color: '#B1B1B1',
                  }}>
                  Wallet balance after this payment
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Manrope-Regular',
                    color: '#B1B1B1',
                  }}>
                  $500
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 22,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 60,
            }}>
            <View
              style={{
                backgroundColor: '#E5F0FF',
                height: 'auto',
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Manrope-Regular',
                      fontSize: 12,
                      color: 'blue',
                    }}>
                    You must NOT UNLIKE or UNFOLLOW the Facebook page after you
                    have like and followed the page. Your Trendit account will
                    be suspended once you UNLIKE or UNFOLLOW the Facebook Page.
                  </Text>
                </View>
                <View style={{alignSelf: 'center'}}>
                  <Svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <G id="Essentials/information/circle">
                      <Path
                        id="Icon"
                        d="M9.99935 13.3415V9.17483M9.99935 6.67483V6.66649M18.3327 10C18.3327 14.6024 14.6017 18.3334 9.99935 18.3334C5.39698 18.3334 1.66602 14.6024 1.66602 10C1.66602 5.39765 5.39698 1.66669 9.99935 1.66669C14.6017 1.66669 18.3327 5.39765 18.3327 10Z"
                        stroke="#1877F2"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </G>
                  </Svg>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingBottom: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#CB29BE',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                width: 300,
                borderRadius: 110,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Manrope-Regular',
                  fontSize: 14,
                }}>
                proceed
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EarnModalContent;
