/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

const NotificationSettings = () => {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
  const [isChecked5, setIsChecked5] = useState(false);
  const [isChecked6, setIsChecked6] = useState(false);
  const [isChecked7, setIsChecked7] = useState(false);
  const [isChecked8, setIsChecked8] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked9, setIsChecked9] = useState(false);

  return (
    <View>
      <View>
        <Text style={styles.Header2}>Email Alert</Text>
        <View style={styles.row}>
          <CheckBox
            value={isChecked1}
            onValueChange={setIsChecked1}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>New Features and Updates</Text>
        </View>
        <View style={styles.row2}>
          <CheckBox
            value={isChecked2}
            onValueChange={setIsChecked2}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>New Tasks</Text>
        </View>
        <View style={styles.row2}>
          <CheckBox
            value={isChecked3}
            onValueChange={setIsChecked3}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>Money Earned</Text>
        </View>
      </View>

      <View style={{paddingTop: 20}}>
        <Text style={styles.Header2}>In-app Alert</Text>
        <View style={styles.row}>
          <CheckBox
            value={isChecked4}
            onValueChange={setIsChecked4}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>New Features and Updates</Text>
        </View>
        <View style={styles.row2}>
          <CheckBox
            value={isChecked5}
            onValueChange={setIsChecked5}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>New Tasks</Text>
        </View>
        <View style={styles.row2}>
          <CheckBox
            value={isChecked6}
            onValueChange={setIsChecked6}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>Money Earned</Text>
        </View>
      </View>
      <View style={{paddingTop: 20}}>
        <Text style={styles.Header2}>Push Notifications</Text>
        <View style={styles.row}>
          <CheckBox
            value={isChecked7}
            onValueChange={setIsChecked7}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
            onCheckColor="grey"
          />
          <Text>New Features and Updates</Text>
        </View>
        <View style={styles.row2}>
          <CheckBox
            value={isChecked8}
            onValueChange={setIsChecked8}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
            onCheckColor="grey"
          />
          <Text>New Tasks</Text>
        </View>
        <View style={styles.row2}>
          <CheckBox
            value={isChecked9}
            onValueChange={setIsChecked9}
            tintColors={{true: '#FF6DFB', false: 'grey'}}
          />
          <Text>Money Earned</Text>
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
    fontFamily: 'Campton Bold',
    color: '#fff',
    paddingVertical: 10,
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

export default NotificationSettings;
