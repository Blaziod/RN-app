/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import Headers from '../../Components/Headers/Headers';
// import Wallet from '../../assets/SVG/post-earn.svg';
// import Exp from '../../assets/SVG/exp';
// import Plus from '../../assets/SVG/pluss';
// import Left from '../../assets/SVG/left';
// import Info from '../../assets/SVG/info';
// import Clock from '../../assets/SVG/sandclock';
// import Warning from '../../assets/SVG/hexagon';
import {useNavigation} from '@react-navigation/native';

const Earn3FB = () => {
  const navigation = useNavigation();
  const [time, setTime] = useState(60 * 60); // 60 minutes * 60 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup on component unmount
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.AppContainer}>
          <Headers />
          <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={{flexDirection: 'row', gap: 5}}
              onPress={() => navigation.navigate('Earn1FB')}>
              {/* <Left /> */}
              <Text style={{color: '#FFD0FE', paddingBottom: 20}}>Go Back</Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#2F2F2F',
                opacity: 0.9,
                height: 190,
              }}>
              <ImageBackground
                source={require('../../assets/Frame131.png')}
                style={{
                  height: 200,
                  paddingHorizontal: 20,
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    color: '#B1B1B1',
                    fontFamily: 'CamptonLight',
                    fontSize: 10,
                  }}>
                  Jan 12th 9:27
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonMedium',
                    fontSize: 30,
                  }}>
                  Post an Advert on your facebook page
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <View style={{flexDirection: 'row', gap: 3}}>
                    {/* <Wallet style={styles.wallet} /> */}
                    <Text
                      style={{
                        color: '#808080',
                        fontFamily: 'CamptonMedium',
                        fontSize: 12,
                      }}>
                      Earning:
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Campton Bold',
                      fontSize: 12,
                    }}>
                    ₦140 Per Advert Post
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      fontSize: 10,
                    }}>
                    20+ PEOPLE
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      fontSize: 10,
                    }}>
                    134 LIKES
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonBook',
                      fontSize: 10,
                    }}>
                    453 COMMENTS
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View
              style={{
                backgroundColor: '#ADFFB0',
                height: 80,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 7,
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'CamptonBook',
                    fontSize: 12,
                    color: '#006304',
                  }}>
                  Your task has been approved and completed successfully. Your
                  money has been deposited into your wallet for withdrawal.
                  Thank you.
                </Text>

                <View style={{alignSelf: 'center'}}>{/* <Info /> */}</View>
              </View>
            </View>
            <View style={{paddingVertical: 10}}>
              <View
                style={{
                  height: 100,
                  backgroundColor: '#FFA2A2',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{paddingBottom: 5}} />
                <Text style={{fontFamily: 'Campton Bold', fontSize: 15}}>
                  {`${minutes.toString().padStart(2, '0')}:${seconds
                    .toString()
                    .padStart(2, '0')}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 20,
                backgroundColor: '#1E1E1E',
                borderRadius: 10,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonSemiBold',
                    fontSize: 22,
                    paddingTop: 20,
                  }}>
                  Task
                </Text>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CamptonSemiBold',
                      fontSize: 12,
                      paddingBottom: 10,
                      paddingTop: 60,
                    }}>
                    Please follow the step-by-step instructions below to do your
                    task:
                  </Text>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 1:{' '}
                      <Text style={styles.StepText}>
                        Open the Task Link above on your Facebook Mobile App or
                        browser
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 2:{' '}
                      <Text style={styles.StepText}>
                        The link will direct you to a Facebook Page which you
                        are meant to like and follow.
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 3:{' '}
                      <Text style={styles.StepText}>
                        Click on the Like or Follow button on the Facebook Page
                        to start liking or following the page. You MUST NOT
                        Unfollow the account after you have followed the
                        account.
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.StepView}>
                    <Text style={styles.Step}>
                      Step 4:{' '}
                      <Text style={styles.StepText}>
                        Create a screenshot of the page that shows you have
                        liked or followed the page and upload the screenshot
                        under the Proof of Work Form below. You are also
                        required to enter your Facebook Username or Name which
                        you used to perform the task
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{paddingVertical: 10}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'grey',
                    opacity: 0.5,
                    height: 'auto',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'CamptonBook',
                      fontSize: 13,
                    }}>
                    Hi Guys, i sell comfy sneakers, cover shoes, crocs and high
                    fashion dress with durable and quality materials, do well to
                    patronize me pleas, you can message me on WhatsApp on
                    09012345678
                  </Text>
                  {/* <Exp /> */}
                </TouchableOpacity>
              </View>
              <View style={styles.Box2}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 7,
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    alignItems: 'center',
                  }}>
                  <Text style={styles.Box2Text}>
                    You must NOT DELETE THE ADVERT POST on the Facebook page
                    after you have post the advert on your account Your Trendit3
                    account will be suspended once you Delete the advert on your
                    Facebook Page.{' '}
                  </Text>
                  <View style={{alignSelf: 'center'}}>{/* <Warning /> */}</View>
                </View>
              </View>
            </View>
            <View style={{paddingVertical: 20}}>
              <View
                style={{
                  backgroundColor: '#1e1e1e',
                  justifyContent: 'center',
                  // alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'CamptonMedium',
                    fontSize: 24,
                    alignSelf: 'center',
                  }}>
                  Upload proof
                </Text>
                <View style={{paddingVertical: 20, alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#262626',
                      height: 155,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 250,
                    }}>
                    {/* <Plus /> */}
                  </TouchableOpacity>
                </View>
                <Text style={{color: '#fff', fontFamily: 'CamptonSemiBold'}}>
                  Please enter the name on your Facebook account that performed
                  this task
                </Text>
                <View style={{paddingVertical: 10}}>
                  <TextInput
                    style={{
                      backgroundColor: 'grey',
                      opacity: 0.5,
                      height: 40,
                      paddingHorizontal: 10,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'CamptonBook',
                        fontSize: 13,
                      }}>
                      Blaziod
                    </Text>
                  </TextInput>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                    // paddingHorizontal: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 10,
                      backgroundColor: '#FF6DFB1A',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 6,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'CamptonBook',
                        fontSize: 12,
                      }}>
                      Upload Proof
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <Text
                      style={{
                        color: '#FFD0FE',
                        fontFamily: 'CamptonBook',
                        fontSize: 12,
                      }}>
                      Save
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{paddingVertical: 20, alignItems: 'center'}}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    backgroundColor: '#ADFFB0',
                    height: 50,
                    width: 290,
                  }}
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'Earn',
                        },
                      ],
                    })
                  }>
                  <Text
                    style={{
                      fontFamily: 'CamptonMedium',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#000',
                    }}>
                    Mark as Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },

  Box2: {
    backgroundColor: '#FFE9E9',
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  Box2Text: {
    color: 'red',
    fontFamily: 'CamptonBook',
    fontSize: 12,
  },

  Step: {
    color: '#fff',
    fontFamily: 'CamptonSemiBold',
    fontSize: 12,
  },
  StepText: {
    color: '#fff',
    fontFamily: 'CamptonBook',
    fontSize: 12,
  },
  StepView: {
    paddingVertical: 7,
  },
});
export default Earn3FB;
