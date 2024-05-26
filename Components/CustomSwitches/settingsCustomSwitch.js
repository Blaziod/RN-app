/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useState} from 'react';
import {useTheme} from '../../Components/Contexts/colorTheme';

const SettingsCustomSwitch = ({
  selectionMode,
  option1,
  option2,
  option3,
  option4,
  option5,
  onSelectSwitch,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const {theme} = useTheme();

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  // Dynamic styles moved inside the component for context-sensitive theme updates
  const styles = getStyles(theme, getSelectionMode);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {[option1, option2, option3, option4, option5].map((option, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={() => updateSwitchData(index + 1)}
            style={[
              styles.button,
              {
                borderBottomColor:
                  getSelectionMode === index + 1
                    ? '#FF6DFB'
                    : theme === 'dark'
                    ? '#fff'
                    : index + 20
                    ? '#000'
                    : '#fff',
              },
            ]}>
            <Text
              style={[
                styles.text,
                {
                  color:
                    getSelectionMode === index + 1
                      ? '#FF6DFB'
                      : theme === 'dark'
                      ? '#B1B1B1'
                      : '#000',
                },
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const getStyles = (theme, selectionMode) =>
  StyleSheet.create({
    container: {
      height: 44,
      backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    button: {
      flex: 1,
      borderBottomWidth: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 13,
      fontFamily: 'Campton Bold',
      paddingRight: 20,
    },
  });

export default SettingsCustomSwitch;
