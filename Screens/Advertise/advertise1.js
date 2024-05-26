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
import Advertise1Menu from '../../Components/Menus/advertise1Menu';
import {useTheme} from '../../Components/Contexts/colorTheme';

const Advertise1 = ({navigation}) => {
  const {theme} = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleString(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString()); // Updates the time every second
    }, 1000);

    return () => clearInterval(timer); // Clear the interval on component unmount
  }, []);

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF', // Dynamic background color
      width: '100%',
    },
    DivContainer: {
      backgroundColor:
        theme === 'dark' ? '#171717' : 'rgba(177, 177, 177, 0.20)', // Dynamic background color
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
          <View
            style={[
              {paddingBottom: 20, paddingHorizontal: 20},
              dynamicStyles.DivContainer,
            ]}>
            <TouchableOpacity
              style={[
                {flexDirection: 'row', gap: 5},
                dynamicStyles.DivContainer,
              ]}
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
                source={require('../../assets/Frame131.png')}
                style={{
                  height: 'auto',
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 20,
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontFamily: 'CamptonLight',
                    fontSize: 10,
                  }}>
                  {currentDateTime}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonMedium',
                    fontSize: 30,
                  }}>
                  Get People to Post Your Advert on Instagram
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

                <Text
                  style={{
                    color: '#909090',
                    fontFamily: 'CamptonBook',
                    fontSize: 12,
                    paddingTop: 10,
                  }}>
                  Get real people to post your advert on their Instagram account
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
          <Advertise1Menu />
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
export default Advertise1;
