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
import {useTheme} from '../../Components/Contexts/colorTheme';

const Settings = () => {
  const [earnMenu, setEarnMenu] = useState(1);

  const onSelectSwitch = value => {
    setEarnMenu(value);
  };

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
  return (
    <SafeAreaView style={[styles.container, dynamicStyles.AppContainer]}>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Headers />
          <View style={[styles.box]}>
            <Text style={[styles.Headers, dynamicStyles.TextColor]}>
              Profile Settings
            </Text>
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                },
              ]}>
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
    fontFamily: 'Manrope-Regular',
    marginBottom: 20,
  },
  box: {width: '93%', marginTop: 20, alignSelf: 'center'},
});
export default Settings;
