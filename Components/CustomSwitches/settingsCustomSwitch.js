/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {useState} from 'react';

const SettingsCustomSwitch = ({
  selectionMode,
  option1,
  option2,
  option3,
  option4,
  option5,
  //   option6,
  onSelectSwitch,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        style={{
          height: 44,
          backgroundColor: '#121212',
          flexDirection: 'row',
          justifyContent: 'space-around',
          //   gap: 10,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(1)}
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 1 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
            paddingLeft: 10,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: getSelectionMode === 1 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            {option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(2)}
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 2 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: getSelectionMode === 2 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            {option2}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(3)}
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 3 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: getSelectionMode === 3 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            {option3}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(4)}
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 4 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: getSelectionMode === 4 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            {option4}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(5)}
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 5 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
          }}>
          <Text
            style={{
              fontSize: 13,
              color: getSelectionMode === 5 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            {option5}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsCustomSwitch;
