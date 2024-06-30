/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Headers from '../../Components/Headers/Headers';
import Advertise1FBMenu from '../../Components/Menus/advertise1FBMenu';
import {useTheme} from '../../Components/Contexts/colorTheme';

const Advertise1FB = ({navigation}) => {
  const {theme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#2F2F2F6B' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
    },
    TextColor: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000', // Dynamic text color
    },
    Button: {
      backgroundColor: theme === 'dark' ? '#FFF' : '#CB29BE', // Dynamic background color
    },
    Btext: {
      color: theme === 'dark' ? '#FF6DFB' : '#FFF', // Dynamic text color
    },
  });

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.AppContainer, dynamicStyles.AppContainer]}>
          <Headers />
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={() => navigation.navigate('Advertise')}>
              {/* <Left /> */}
              <Text style={{color: '#FFD0FE', paddingBottom: 20}}>Go Back</Text>
            </TouchableOpacity>

            <View
              style={[
                {
                  backgroundColor: '#2F2F2F6B',
                  opacity: 0.9,
                  height: 'auto',
                },
                dynamicStyles.DivContainer,
              ]}>
              <ImageBackground
                source={require('../../assets/fbi2.png')}
                style={{
                  height: 'auto',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}>
                <Text
                  style={[
                    {
                      color: '#B1B1B1',
                      fontFamily: 'Manrope-Light',
                      fontSize: 10,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Jan 12th 9:27
                </Text>
                <Text
                  style={[
                    {
                      color: '#fff',
                      fontFamily: 'Manrope-Medium',
                      fontSize: 30,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Get People to Post Your Advert on Facebook
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    {/* <Wallet style={styles.wallet} /> */}
                    <Text
                      style={[
                        {
                          color: '#808080',
                          fontFamily: 'Manrope-Medium',
                          fontSize: 12,
                        },
                        dynamicStyles.TextColor,
                      ]}>
                      Pricing:
                    </Text>
                  </View>
                  <Text
                    style={[
                      {
                        color: '#fff',
                        fontFamily: 'Manrope-ExtraBold',
                        fontSize: 12,
                      },
                      dynamicStyles.TextColor,
                    ]}>
                    ₦140 Per Advert Post
                  </Text>
                </View>
                <Text
                  style={[
                    {
                      color: '#909090',
                      fontFamily: 'Manrope-Regular',
                      fontSize: 12,
                      paddingTop: 10,
                    },
                    dynamicStyles.TextColor,
                  ]}>
                  Get real people to post your advert on their Facebook account
                  having at least 1000 active followers each on their account to
                  post your advert to their followers. This will give your
                  advert massive views within a short period of time. You can
                  indicate any number of people you want to post your advert.
                </Text>
              </ImageBackground>
            </View>
            <View style={{paddingVertical: 10}} />
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
              }}>
              <Text
                style={[
                  {
                    color: '#fff',
                    fontFamily: 'Manrope-Medium',
                    fontSize: 25,
                    //   paddingTop: 10,
                  },
                  dynamicStyles.TextColor,
                ]}>
                Create Advert Task
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </View>
          <Advertise1FBMenu />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },

  Box2: {
    backgroundColor: '#FFE9E9',
    height: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  Box2Text: {
    color: 'red',
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
  },

  Step: {
    color: '#fff',
    fontFamily: 'Manrope-Bold',
    fontSize: 12,
  },
  StepText: {
    color: '#fff',
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
  },
  StepView: {
    paddingVertical: 7,
  },
});
export default Advertise1FB;
