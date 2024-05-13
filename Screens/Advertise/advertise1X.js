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
// import Wallet from '../../assets/SVG/post-earn.svg';

// import Left from '../../assets/SVG/left';
// import Info from '../../assets/SVG/info';
import Advertise1XMenu from '../../Components/Menus/advertise1XMenu';

const Advertise1X = ({navigation}) => {
  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.AppContainer}>
          <Headers />
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={() => navigation.navigate('Advertise')}>
              {/* <Left /> */}
              <Text style={{color: '#FFD0FE', paddingBottom: 20}}>Go Back</Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#2F2F2F6B',
                opacity: 0.9,
                height: 'auto',
              }}>
              <ImageBackground
                source={require('../../assets/xi.png')}
                style={{
                  height: 'auto',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}>
                <Text
                  style={{
                    color: '#B1B1B1',
                    fontFamily: 'CamptonLight',
                    fontSize: 10,
                  }}>
                  Jan 12th 9:27
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonMedium',
                    fontSize: 30,
                  }}>
                  Get People to Post Your Advert on Twitter
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
                      style={{
                        color: '#808080',
                        fontFamily: 'CamptonMedium',
                        fontSize: 12,
                      }}>
                      Pricing:
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                      fontSize: 12,
                    }}>
                    ₦140 Per Advert Post
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      fontSize: 10,
                    }}>
                    20+ PEOPLE
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      fontSize: 10,
                    }}>
                    134 LIKES
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      fontSize: 10,
                    }}>
                    453 COMMENTS
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#909090',
                    fontFamily: 'CamptonBook',
                    fontSize: 12,
                    paddingTop: 10,
                  }}>
                  Get real people to post your advert on their Twitter account
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
                style={{
                  color: '#fff',
                  fontFamily: 'CamptonMedium',
                  fontSize: 25,
                  //   paddingTop: 10,
                }}>
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
          <Advertise1XMenu />
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
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  Box2Text: {
    color: 'red',
    fontFamily: 'CamptonBook',
    fontSize: 12,
  },

  Step: {
    color: '#fff',
    fontFamily: 'CamptonSemiBold',
    fontSize: 12,
  },
  StepText: {
    color: '#fff',
    fontFamily: 'CamptonBook',
    fontSize: 12,
  },
  StepView: {
    paddingVertical: 7,
  },
});
export default Advertise1X;
