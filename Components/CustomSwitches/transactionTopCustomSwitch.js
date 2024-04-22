/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useState} from 'react';

const TransactionsTopCustomSwitch = ({
  selectionMode,
  option1,
  option2,
  option3,
  option4,
  onSelectSwitch,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };
  return (
    <ScrollView scrollEnabled={true} contentContainerStyle={{width: '100%'}}>
      <View
        style={{
          height: 44,
          backgroundColor: '#121212',
          flexDirection: 'row',
          justifyContent: 'center',
          //   alignContent: 'stretch',
          width: '100%',
          padding: '2%',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(1)}
          style={{
            paddingLeft: 5,
            paddingRight: '3%',
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
            // paddingLeft: 20,
            paddingRight: '3%',
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
              {/* <Text style={{color: '#fff', fontSize: 10}}> 23+</Text> */}
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(3)}
          style={{
            // paddingLeft: 20,
            paddingRight: '30%',
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 3 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: getSelectionMode === 3 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            <Text>
              {option3}
              {/* <Text style={{color: '#fff', fontSize: 10}}> 23+</Text> */}
            </Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updateSwitchData(4)}
          style={{
            paddingLeft: 10,
            // paddingRight: '3%',
            borderBottomWidth: 0.5,
            borderBottomColor: getSelectionMode === 4 ? '#FF6DFB' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: getSelectionMode === 4 ? '#FF6DFB' : '#B1B1B1',
              fontFamily: 'Campton Bold',
            }}>
            <Text>
              {option4}
              {/* <Text style={{color: '#fff', fontSize: 10}}> 23+</Text> */}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TransactionsTopCustomSwitch;
