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
import Advertise1APMenu from '../../Components/Menus/advertise1APMenu';

const Advertise1AP = ({navigation}) => {
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
                source={require('../../assets/api.png')}
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
                  Get People to Download and Review Your App on Apple Store
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
                    ₦120 per Download and Review
                  </Text>
                </View>

                <Text
                  style={{
                    color: '#909090',
                    fontFamily: 'Manrope-Regular',
                    fontSize: 12,
                    paddingTop: 10,
                  }}>
                  Get people to download and review your apps on Apple store.
                  You can get any number of people you want to download and
                  review your app. simply by entering the download link to your
                  app.
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
                Create an Engagement Task
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </View>
          <Advertise1APMenu />
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
export default Advertise1AP;
