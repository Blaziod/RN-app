/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Headers from '../../Components/Headers/Headers';
// import Instagram from '../../assets/SVG/Instagram';
// import X from '../../assets/SVG/Earn1Image';
// import Cross from '../../assets/SVG/close cross.svg';
// import InstagramSmall from '../../assets/SVG/InstagramSmall.svg';
// import Left from '../../assets/SVG/left';
import Earn1FBMenu from '../../Components/Menus/earn1FBMenu';
import Earn1CustomSwitch from '../../Components/CustomSwitches/earn1CustomSwitch';
import {Svg, Path} from 'react-native-svg';
import Earn1Image from '../../assets/SVG/earn1Image';

const Earn1FB = ({navigation}) => {
  const [earnMenu, setEarnMenu] = useState(1);

  const onSelectSwitch = value => {
    setEarnMenu(value);
  };

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
              onPress={() => navigation.navigate('Earn')}>
              {/* <Left /> */}
              <Text style={{color: '#FFD0FE', paddingBottom: 20}}>Go Back</Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: '#fff',
                height: 240,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
              <View style={{position: 'absolute', top: 0}}>
                <Earn1Image />
              </View>
              <View style={{paddingTop: 30}}>
                <Svg
                  width="47"
                  height="48"
                  viewBox="0 0 47 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M47 24.0898C47 11.1112 36.4786 0.589844 23.5 0.589844C10.5214 0.589844 0 11.1112 0 24.0898C0 35.8193 8.59366 45.5415 19.8281 47.3044V30.8828H13.8613V24.0898H19.8281V18.9125C19.8281 13.0228 23.3366 9.76953 28.7045 9.76953C31.2756 9.76953 33.9648 10.2285 33.9648 10.2285V16.0117H31.0016C28.0823 16.0117 27.1719 17.8232 27.1719 19.6818V24.0898H33.6895L32.6476 30.8828H27.1719V47.3044C38.4063 45.5415 47 35.8195 47 24.0898Z"
                    fill="#1877F2"
                  />
                  <Path
                    d="M32.6476 30.8828L33.6895 24.0898H27.1719V19.6818C27.1719 17.8231 28.0823 16.0117 31.0016 16.0117H33.9648V10.2285C33.9648 10.2285 31.2756 9.76953 28.7043 9.76953C23.3366 9.76953 19.8281 13.0228 19.8281 18.9125V24.0898H13.8613V30.8828H19.8281V47.3044C21.0428 47.4947 22.2705 47.5902 23.5 47.5898C24.7295 47.5902 25.9572 47.4948 27.1719 47.3044V30.8828H32.6476Z"
                    fill="white"
                  />
                </Svg>
              </View>

              <View
                style={{
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    fontFamily: 'Campton Bold',
                    textAlign: 'center',
                    paddingBottom: 5,
                    color: '#000',
                  }}>
                  Post advert on FaceBook
                </Text>
                <Text
                  style={{
                    fontFamily: 'CamptonMedium',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#000',
                  }}>
                  Like and Follow Facebook Pages for Business and Organizations
                  and earn 10 per Like/Follow. The more pages you like, the more
                  you earn
                </Text>
                <TouchableOpacity style={{paddingTop: 10}}>
                  <Text>124 Task Available</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <View style={styles.ProfileSetUp}>
                <View style={styles.ProfileTexting}>
                  <Text style={styles.SetUpText}>
                    Link Your Facebook Account
                  </Text>
                  <Text style={styles.SetUpSubText}>
                    You need to link your Facebook Account to Trendit before you
                    can start earning with your Facebook Account. Click the
                    button below to link your Facebook account now.
                  </Text>
                  <View style={{paddingTop: 10}} />
                  <TouchableOpacity style={styles.GotoButton2}>
                    <Svg
                      width="24"
                      height="24"
                      viewBox="0 0 47 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Path
                        d="M47 24.0898C47 11.1112 36.4786 0.589844 23.5 0.589844C10.5214 0.589844 0 11.1112 0 24.0898C0 35.8193 8.59366 45.5415 19.8281 47.3044V30.8828H13.8613V24.0898H19.8281V18.9125C19.8281 13.0228 23.3366 9.76953 28.7045 9.76953C31.2756 9.76953 33.9648 10.2285 33.9648 10.2285V16.0117H31.0016C28.0823 16.0117 27.1719 17.8232 27.1719 19.6818V24.0898H33.6895L32.6476 30.8828H27.1719V47.3044C38.4063 45.5415 47 35.8195 47 24.0898Z"
                        fill="#1877F2"
                      />
                      <Path
                        d="M32.6476 30.8828L33.6895 24.0898H27.1719V19.6818C27.1719 17.8231 28.0823 16.0117 31.0016 16.0117H33.9648V10.2285C33.9648 10.2285 31.2756 9.76953 28.7043 9.76953C23.3366 9.76953 19.8281 13.0228 19.8281 18.9125V24.0898H13.8613V30.8828H19.8281V47.3044C21.0428 47.4947 22.2705 47.5902 23.5 47.5898C24.7295 47.5902 25.9572 47.4948 27.1719 47.3044V30.8828H32.6476Z"
                        fill="white"
                      />
                    </Svg>
                    <Text style={styles.GotoText}> Link Facebook account</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.IconAA}>{/* <Cross /> */}</View>
              </View>
            </View>
          </View>
          <View>
            <Earn1CustomSwitch
              selectionMode={1}
              option1="Pending"
              option2="In review"
              option5="Failed"
              onSelectSwitch={onSelectSwitch}
            />
          </View>

          {earnMenu === 1 && (
            <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
              <Earn1FBMenu />
            </View>
          )}
          {earnMenu === 2 && (
            <View style={{paddingVertical: 15, paddingHorizontal: 10}}>
              <Earn1FBMenu />
            </View>
          )}
          {earnMenu === 3 && <Earn1FBMenu />}
          {earnMenu === 4 && <Earn1FBMenu />}

          {earnMenu === 5 && <Earn1FBMenu />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  ProfileSetUp: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    paddingVertical: 30,
  },
  SetUpText: {
    color: '#fff',
    fontFamily: 'Campton Bold',
    fontSize: 17,
    paddingBottom: 10,
  },
  SetUpSubText: {
    color: '#fff',
    fontFamily: 'CamptonBook',
    fontSize: 13,
  },
  IconAA: {
    paddingLeft: 30,
  },
  ProfileTexting: {
    width: 300,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  GotoButton: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 1,
  },
  GotoButton2: {
    width: 230,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 5,
  },
  GotoText: {
    color: '#fff',
    fontFamily: 'Campton Bold',
  },
});
export default Earn1FB;
