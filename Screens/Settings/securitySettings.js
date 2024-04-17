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
} from 'react-native';
import {useState} from 'react';

const SecuritySettings = () => {
  const [isEmailEnabled, setEmailEnabled] = useState(false);
  const [isPhoneEnabled, setPhoneEnabled] = useState(false);
  //   const [isGoogleAuthEnabled, setGoogleAuthEnabled] = useState(false);

  return (
    <View>
      <Text style={styles.Header}>Security</Text>
      <View style={styles.InputBox}>
        <Text style={styles.InputLabel}>Old Password</Text>
        <TextInput
          style={styles.Input}
          placeholder="Enter your old password"
          secureTextEntry={true}
        />
      </View>
      <View style={styles.InputBox}>
        <Text style={styles.InputLabel}>New Password</Text>
        <TextInput
          style={styles.Input}
          placeholder="Enter your new password"
          secureTextEntry={true}
        />
      </View>
      <View style={styles.InputBox}>
        <Text style={styles.InputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.Input}
          placeholder="Confirm your new password"
          secureTextEntry={true}
        />
      </View>
      <Text style={styles.Header2}>2 Factor Authentication</Text>

      <View>
        <View style={styles.row}>
          <TextInput
            style={styles.Input2}
            placeholder="Email"
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
        <View style={styles.row2}>
          <TextInput
            style={styles.Input2}
            placeholder="Phone"
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
        <View style={{paddingTop: 5, paddingBottom: 50}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1C1C1C',
              padding: 10,
              height: 50,
            }}>
            <Text
              style={{
                color: '#b1b1b1',
                fontSize: 13,
                fontFamily: 'CamptonMedium',
              }}>
              Google Auth App
            </Text>
            <Text
              style={{
                color: '#FFD0FE',
                fontSize: 13,
                fontFamily: 'CamptonMedium',
              }}>
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
    backgroundColor: '#1C1C1C',
    color: '#fff',
    marginTop: 5,
    padding: 10,
  },
});

export default SecuritySettings;
