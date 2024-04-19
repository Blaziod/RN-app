/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Path, G, Svg} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

const Earn1FBMenu = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  return (
    <>
      <View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 70,
          }}>
          <Svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <G id="Software/apps add">
              <Path
                id="Icon"
                d="M17.5 14.8901V18.3901M17.5 18.3901V21.8901M17.5 18.3901H21M17.5 18.3901H14M5 10.8901H8C9.10457 10.8901 10 9.99471 10 8.89014V5.89014C10 4.78557 9.10457 3.89014 8 3.89014H5C3.89543 3.89014 3 4.78557 3 5.89014V8.89014C3 9.99471 3.89543 10.8901 5 10.8901ZM5 21.8901H8C9.10457 21.8901 10 20.9947 10 19.8901V16.8901C10 15.7856 9.10457 14.8901 8 14.8901H5C3.89543 14.8901 3 15.7856 3 16.8901V19.8901C3 20.9947 3.89543 21.8901 5 21.8901ZM16 10.8901H19C20.1046 10.8901 21 9.99471 21 8.89014V5.89014C21 4.78557 20.1046 3.89014 19 3.89014H16C14.8954 3.89014 14 4.78557 14 5.89014V8.89014C14 9.99471 14.8954 10.8901 16 10.8901Z"
                stroke="#FFD0FE"
                stroke-width="2"
                stroke-linecap="round"
              />
            </G>
          </Svg>

          <Text
            style={{color: '#fff', fontFamily: 'Campton Bold', paddingTop: 15}}>
            Need quick cash to earn?
          </Text>
          <Text
            style={{
              color: '#B1B1B1',
              fontFamily: 'CamptonBook',
              paddingTop: 7,
              fontSize: 12,
              paddingHorizontal: 50,
              textAlign: 'center',
            }}>
            Earn steady income by posting adverts of businesses and top brands
            on your social media page. To post adverts on Facebook, Instagram,
            Twitter or Tiktok, you MUST have atleast 1,000 Followers on your
            social media account.
          </Text>
          <View style={{paddingTop: 15}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                height: 50,
                width: 300,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                flexDirection: 'row',
              }}
              onPress={() => setIsModalVisible(true)}>
              <Text
                style={{
                  color: '#000000',
                  fontFamily: 'CamptonMedium',
                  fontSize: 13,
                }}>
                Generate Task
              </Text>
            </TouchableOpacity>
            <Modal
              animationType={'slide'}
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#000000aa',
                  padding: 20,
                  justifyContent: 'flex-end',
                }}>
                <>
                  <SafeAreaView>
                    <View
                      style={{
                        backgroundColor: '#121212',
                        width: '100%',
                        paddingHorizontal: 10,
                        paddingVertical: 20,
                        maxHeight: deviceHeight * 0.7,
                        position: 'relative',
                      }}>
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                          position: 'absolute',
                          top: -10,
                          alignSelf: 'center',
                        }}
                        onPress={() => setIsModalVisible(false)}>
                        <View
                          style={{
                            backgroundColor: '#FF6DFB',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            position: 'absolute',
                            top: -20,
                            alignSelf: 'center',
                          }}>
                          <Svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <Path
                              d="M18 6L6 18M18 18L6 6.00001"
                              stroke="white"
                              stroke-width="2"
                              stroke-linecap="round"
                            />
                          </Svg>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingHorizontal: 30,
                          paddingVertical: 30,
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            fontFamily: 'Campton Bold',
                            paddingBottom: 10,
                            paddingTop: 20,
                          }}>
                          Generate Next Facebook Advert Task?
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 400,
                            fontFamily: 'CamptonBook',
                            textAlign: 'center',
                            paddingHorizontal: 20,
                          }}>
                          Are you sure you want to generate your next Facebook
                          Advert task now. You have 1 hour to perform this task.
                          Please confirm only if you are ready to perform the
                          task.
                        </Text>
                      </View>
                      <View style={{paddingHorizontal: 10, paddingBottom: 30}}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#CB29BE',
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 110,
                          }}
                          onPress={() => navigation.navigate('Earn2FB')}>
                          <Text
                            style={{
                              color: '#fff',
                              fontFamily: 'CamptonBook',
                              fontSize: 14,
                            }}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </SafeAreaView>
                </>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    </>
  );
};

export default Earn1FBMenu;
