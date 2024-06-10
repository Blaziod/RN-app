/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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
import Advertise1WAMenu from '../../Components/Menus/advertise1WAMenu';

const Advertise1WA = ({navigation}) => {
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString()); // Updates the time every second
    }, 1000);

    return () => clearInterval(timer); // Clear the interval on component unmount
  }, []);
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
                source={require('../../assets/wai2.png')}
                style={{
                  height: 'auto',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'Manrope-Light',
                    fontSize: 10,
                  }}>
                  {currentDateTime}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Manrope-Medium',
                    fontSize: 30,
                  }}>
                  Get People to Post Your Advert on WhatsApp
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
                        fontFamily: 'Manrope-Medium',
                        fontSize: 12,
                      }}>
                      Pricing:
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Manrope-ExtraBold',
                      fontSize: 12,
                    }}>
                    ₦80 per advert post
                  </Text>
                </View>

                <Text
                  style={{
                    color: '#909090',
                    fontFamily: 'Manrope-Regular',
                    fontSize: 12,
                    paddingTop: 10,
                  }}>
                  Get real people to post your advert on their WhatsApp account
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
                  fontFamily: 'Manrope-Medium',
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
          <Advertise1WAMenu />
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
export default Advertise1WA;
