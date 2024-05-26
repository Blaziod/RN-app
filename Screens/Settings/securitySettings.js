/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {useState} from 'react';
import {useTheme} from '../../Components/Contexts/colorTheme';
import {Svg, Path} from 'react-native-svg';

const SecuritySettings = () => {
  const [isEmailEnabled, setEmailEnabled] = useState(false);
  const [isPhoneEnabled, setPhoneEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isGoogleAuthEnabled, setGoogleAuthEnabled] = useState(false);

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
      color: theme === 'dark' ? '#FFD0FE' : '#FFF', // Dynamic text color
    },
  });
  return (
    <View>
      <Text style={[styles.Header, dynamicStyles.TextColor]}>Security</Text>
      <View style={styles.InputBox}>
        <Text style={[styles.InputLabel, dynamicStyles.TextColor]}>
          Old Password
        </Text>
        <TextInput
          style={[styles.Input, dynamicStyles.DivContainer]}
          placeholder="Enter your old password"
          placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.InputBox}>
        <Text style={[styles.InputLabel, dynamicStyles.TextColor]}>
          New Password
        </Text>
        <TextInput
          style={[styles.Input, dynamicStyles.DivContainer]}
          placeholder="Enter your new password"
          placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.InputBox}>
        <Text style={[styles.InputLabel, dynamicStyles.TextColor]}>
          Confirm Password
        </Text>
        <TextInput
          style={[styles.Input, dynamicStyles.DivContainer]}
          placeholder="Confirm your new password"
          placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
          secureTextEntry={true}
        />
      </View>
      <View style={{paddingTop: 10}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            backgroundColor: '#FF6DFB',
            height: 40,
            padding: 4,
            borderRadius: 10,
            width: '50%',
            justifyContent: 'center',
          }}>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <Path
              d="M3 21H21"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M7 17V13L17 3L21 7L11 17H7Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M14 6L18 10"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={{color: 'fff', fontSize: 14, fontFamily: 'Campton Bold'}}>
              Update
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.Header2, dynamicStyles.TextColor]}>
        2 Factor Authentication
      </Text>

      <View>
        <View style={[styles.row, dynamicStyles.DivContainer]}>
          <TextInput
            style={[styles.Input2]}
            placeholder="Email"
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
            editable={isEmailEnabled}
          />
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEmailEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={newValue => {
              setEmailEnabled(newValue);
              if (newValue) {
                setPhoneEnabled(false);
              }
            }}
            value={isEmailEnabled}
          />
        </View>
        <View style={[styles.row2, dynamicStyles.DivContainer]}>
          <TextInput
            style={styles.Input2}
            placeholder="Phone"
            placeholderTextColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
            editable={isPhoneEnabled}
          />
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isPhoneEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={newValue => {
              setPhoneEnabled(newValue);
              if (newValue) {
                setEmailEnabled(false);
              }
            }}
            value={isPhoneEnabled}
          />
        </View>
        <View style={[{paddingTop: 5, paddingBottom: 50}]}>
          <TouchableOpacity
            style={[
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1C1C1C',
                padding: 10,
                height: 50,
              },
              dynamicStyles.DivContainer,
            ]}>
            <Text
              style={[
                {
                  color: '#b1b1b1',
                  fontSize: 13,
                  fontFamily: 'CamptonMedium',
                },
                dynamicStyles.TextColor,
              ]}>
              Google Auth App
            </Text>
            <Text
              style={[
                {
                  color: '#FFD0FE',
                  fontSize: 13,
                  fontFamily: 'CamptonMedium',
                },
              ]}>
              Activate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
    marginTop: 5,
  },
  Header2: {
    fontSize: 14,
    fontFamily: 'Campton Bold',
    color: '#fff',
    paddingVertical: 20,
  },
  InputBox: {
    marginTop: 20,
  },
  InputLabel: {
    fontSize: 12,
    fontFamily: 'CamptonMedium',
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
    color: '#fff',
    marginTop: 5,
    padding: 10,
  },
});

export default SecuritySettings;
