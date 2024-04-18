/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useState} from 'react';
import {Svg, Path} from 'react-native-svg';

const Earn1CustomSwitch = ({
  selectionMode,
  option1,
  option2,
  option3,
  option4,
  option5,
  onSelectSwitch,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };
  return (
    <ScrollView scrollEnabled={true}>
      <View
        style={{
          height: 44,
          backgroundColor: '#121212',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(1)}
          style={{
            paddingLeft: 5,
            paddingRight: 5,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 1 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
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
            paddingLeft: 20,
            paddingRight: 5,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 2 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: getSelectionMode === 2 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            <Text>
              {option2}
              <Text style={{color: '#fff', fontSize: 10}}> 23+</Text>
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(5)}
          style={{
            paddingLeft: 20,
            paddingRight: 70,
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 5 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: getSelectionMode === 5 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            {option5}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 3 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Svg
            width="30"
            height="30"
            viewBox="0 0 24 25"
            fill={getSelectionMode === 3 ? '#FF6DFB' : 'none'}
            onPress={() => updateSwitchData(3)}>
            <Path
              d="M19.5858 3.5H4.41421C3.63316 3.5 3 4.13317 3 4.91421C3 5.28929 3.149 5.649 3.41421 5.91421L8.41421 10.9142C8.78929 11.2893 9 11.798 9 12.3284V17.2639C9 18.0215 9.428 18.714 10.1056 19.0528L14.2764 21.1382C14.6088 21.3044 15 21.0627 15 20.691V12.3284C15 11.798 15.2107 11.2893 15.5858 10.9142L20.5858 5.91421C20.851 5.649 21 5.28929 21 4.91421C21 4.13317 20.3668 3.5 19.5858 3.5Z"
              stroke={getSelectionMode === 3 ? '#FF6DFB' : '#fff'}
              stroke-width="2"
              stroke-linecap="round"
            />
            {option3}
          </Svg>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 4 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
          }}>
          <Svg
            width="30"
            height="30"
            viewBox="0 0 24 25"
            fill="none"
            onPress={() => updateSwitchData(4)}>
            <Path
              d="M5 17.5L5 7.5M7 16.5L5.35355 18.1464C5.15829 18.3417 4.84171 18.3417 4.64645 18.1464L3 16.5M12 4.5H21M12 12.5H18M12 20.5H14M12 8.5H20M12 16.5H16"
              stroke={getSelectionMode === 4 ? '#FF6DFB' : '#fff'}
              stroke-width="2"
              stroke-linecap="round"
            />
            {option4}
          </Svg>
        </View>
      </View>
    </ScrollView>
  );
};

export default Earn1CustomSwitch;
