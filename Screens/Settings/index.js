/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Headers from '../../Components/Headers/Headers';
import SettingsCustomSwitch from '../../Components/CustomSwitches/settingsCustomSwitch';
import GeneralSettings from './generalSettings';
import SecuritySettings from './securitySettings';
import NotificationSettings from './notificationSettings';
import BankSettings from './bankDetails';
import PreferencesSettings from './preferences';
import {Svg, Path} from 'react-native-svg';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Settings = () => {
  const [earnMenu, setEarnMenu] = useState(1);

  const onSelectSwitch = value => {
    setEarnMenu(value);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Headers />
          <View style={styles.box}>
            <Text style={styles.Headers}>Profile Settings</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}>
              <SettingsCustomSwitch
                selectionMode={1}
                option1="General"
                option2="Security"
                option3="Notifications"
                option4="Bank Details"
                option5="Preferences"
                // option6="Save"
                onSelectSwitch={onSelectSwitch}
              />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none">
                  <Path
                    d="M15 5.75L7.10355 13.6464C6.90829 13.8417 6.59171 13.8417 6.39645 13.6464L3 10.25"
                    stroke="#FFD0FE"
                    stroke-linecap="round"
                  />
                </Svg>
                <Text
                  style={{
                    color: '#FFD0FE',
                    fontFamily: 'CamptonMedium',
                    fontSize: 13,
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            {earnMenu === 1 && (
              <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
                <GeneralSettings />
              </View>
            )}
            {earnMenu === 2 && (
              <View style={{paddingVertical: 15}}>
                <SecuritySettings />
              </View>
            )}
            {earnMenu === 3 && (
              <View style={{paddingVertical: 15}}>
                <NotificationSettings />
              </View>
            )}
            {earnMenu === 4 && (
              <View style={{paddingVertical: 15}}>
                <BankSettings />
              </View>
            )}
            {earnMenu === 5 && (
              <View style={{paddingVertical: 15}}>
                <PreferencesSettings />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    width: '100%',
  },
  Headers: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'CamptonBook',
    marginBottom: 20,
  },
  box: {width: '93%', marginTop: 20, alignSelf: 'center'},
});
export default Settings;
