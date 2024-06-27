/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {useTheme} from '../../Components/Contexts/colorTheme';
import Headers from '../../Components/Headers/Headers';
import {Svg, Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const NotificationSettings = () => {
  const navigation = useNavigation();
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
  const [isChecked5, setIsChecked5] = useState(false);
  const [isChecked6, setIsChecked6] = useState(false);
  const [isChecked7, setIsChecked7] = useState(false);
  const [isChecked8, setIsChecked8] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked9, setIsChecked9] = useState(false);
  const {theme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    AppContainer: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#000' : '#FFFFFF', // Dynamic background color
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

  const strokeColor = theme === 'dark' ? '#b1b1b1' : '#000';
  return (
    <ScrollView style={[dynamicStyles.AppContainer]}>
      <Headers />
      <View style={{padding: 10}}>
        <View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              paddingVertical: 10,
              paddingBottom: 20,
            }}
            onPress={() => navigation.navigate('Settings')}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill={strokeColor}>
              <Path
                d="M16.3332 7L10.1581 13.175C9.7025 13.6307 9.7025 14.3693 10.1581 14.825L16.3332 21"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </Svg>
            <Text
              style={[
                {
                  color: '#fff',
                  fontFamily: 'Manrope-Bold',
                  fontSize: 20,
                },
                dynamicStyles.TextColor,
              ]}>
              Notifications
            </Text>
          </TouchableOpacity>
          <Text style={[styles.Header2, dynamicStyles.TextColor]}>
            Email Alert
          </Text>
          <View style={[styles.row, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked1}
              onValueChange={setIsChecked1}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>
              New Features and Updates
            </Text>
          </View>
          <View style={[styles.row2, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked2}
              onValueChange={setIsChecked2}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>New Tasks</Text>
          </View>
          <View style={[styles.row2, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked3}
              onValueChange={setIsChecked3}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>Money Earned</Text>
          </View>
        </View>

        <View style={{paddingTop: 20}}>
          <Text style={[styles.Header2, dynamicStyles.TextColor]}>
            In-app Alert
          </Text>
          <View style={[styles.row, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked4}
              onValueChange={setIsChecked4}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>
              New Features and Updates
            </Text>
          </View>
          <View style={[styles.row2, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked5}
              onValueChange={setIsChecked5}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>New Tasks</Text>
          </View>
          <View style={[styles.row2, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked6}
              onValueChange={setIsChecked6}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>Money Earned</Text>
          </View>
        </View>
        <View style={{paddingTop: 20}}>
          <Text style={[styles.Header2, dynamicStyles.TextColor]}>
            Push Notifications
          </Text>
          <View style={[styles.row, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked7}
              onValueChange={setIsChecked7}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
              onCheckColor="grey"
            />
            <Text style={dynamicStyles.TextColor}>
              New Features and Updates
            </Text>
          </View>
          <View style={[styles.row2, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked8}
              onValueChange={setIsChecked8}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
              onCheckColor="grey"
            />
            <Text style={dynamicStyles.TextColor}>New Tasks</Text>
          </View>
          <View style={[styles.row2, dynamicStyles.DivContainer]}>
            <CheckBox
              value={isChecked9}
              onValueChange={setIsChecked9}
              tintColors={{true: '#FF6DFB', false: 'grey'}}
            />
            <Text style={dynamicStyles.TextColor}>Money Earned</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  Header: {
    fontSize: 14,
    fontFamily: 'Manrope-ExtraBold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
    padding: 10,
    height: 50,
    // paddingTop: 5,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
    marginTop: 5,
    padding: 10,
    height: 50,
  },
  Header2: {
    fontSize: 14,
    fontFamily: 'Manrope-ExtraBold',
    color: '#fff',
    paddingVertical: 10,
  },
  InputBox: {
    marginTop: 20,
  },
  InputLabel: {
    fontSize: 12,
    fontFamily: 'Manrope-Medium',
    color: '#fff',
  },
  Input: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  Input2: {
    backgroundColor: '#1C1C1C',
    color: '#fff',
    marginTop: 5,
    padding: 10,
  },
});

export default NotificationSettings;
