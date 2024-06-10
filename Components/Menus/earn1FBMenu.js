/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Path,
  G,
  Svg,
  Stop,
  Defs,
  LinearGradient,
  RadialGradient,
} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {ApiLink} from '../../enums/apiLink';

const Earn1FBMenu = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetching, setFectching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [pendingTasks, setPendingTasks] = useState([]);
  const [tasks, setTasks] = useState(null);
  const [userAccessToken, setUserAccessToken] = useState(null);

  const platformPrices = {
    facebook: 110,
    instagram: 110,
    tiktok: 110,
    twitter: 110,
    threads: 110,
    whatsapp: 60,
  };
  const platformNav = {
    facebook: 'Earn2FB',
    instagram: 'Earn2IG',
    tiktok: 'Earn2TK',
    twitter: 'Earn2X',
    whatsapp: 'Earn2WB',
    threads: 'Earn2TR',
  };

  const platformImages = {
    whatsapp: (
      <Svg
        width="25"
        height="23"
        viewBox="0 0 47 48"
        fill="green"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M1.00869 23.8086C1.00759 27.7575 2.0472 31.6133 4.02401 35.0119L0.819641 46.6238L12.7928 43.508C16.1044 45.2973 19.8148 46.2348 23.5854 46.2351H23.5953C36.0425 46.2351 46.1749 36.1823 46.1802 23.8263C46.1826 17.8389 43.8354 12.2087 39.5709 7.97286C35.3071 3.7374 29.6364 1.40361 23.5944 1.40088C11.1456 1.40088 1.01402 11.453 1.00888 23.8086"
          fill="green"
        />
        <Path
          d="M0.202377 23.8013C0.201092 27.8923 1.27796 31.886 3.32525 35.4063L0.00598145 47.4345L12.4084 44.2069C15.8257 46.0561 19.6732 47.0311 23.5883 47.0326H23.5984C36.4922 47.0326 46.9885 36.6183 46.994 23.8199C46.9963 17.6173 44.5646 11.7848 40.1477 7.39719C35.7303 3.01016 29.8568 0.592394 23.5984 0.589844C10.7024 0.589844 0.207516 11.0027 0.202377 23.8013ZM7.5885 34.8L7.12541 34.0704C5.17871 30.9983 4.15121 27.4482 4.15268 23.8027C4.15672 13.1649 12.8796 4.51015 23.6057 4.51015C28.8001 4.51234 33.6817 6.52205 37.3534 10.1684C41.0249 13.8151 43.0452 18.6626 43.0439 23.8184C43.0392 34.4563 34.3161 43.1121 23.5984 43.1121H23.5907C20.1009 43.1103 16.6783 42.1801 13.6935 40.4223L12.9831 40.0043L5.62326 41.9194L7.5885 34.8Z"
          fill="green"
        />
        <Path
          d="M17.7509 14.0975C17.313 13.1315 16.8521 13.112 16.4356 13.095C16.0946 13.0805 15.7047 13.0816 15.3153 13.0816C14.9254 13.0816 14.292 13.2271 13.7566 13.8073C13.2206 14.3881 11.7104 15.7915 11.7104 18.646C11.7104 21.5006 13.8052 24.2592 14.0972 24.6467C14.3896 25.0334 18.1413 31.0786 24.0831 33.4041C29.0213 35.3368 30.0262 34.9524 31.0979 34.8555C32.1698 34.7589 34.5567 33.4524 35.0436 32.0976C35.531 30.743 35.531 29.5818 35.3849 29.3392C35.2387 29.0974 34.8489 28.9523 34.2643 28.6622C33.6795 28.372 30.8055 26.9684 30.2698 26.7748C29.7338 26.5813 29.3441 26.4848 28.9543 27.0657C28.5644 27.6457 27.445 28.9523 27.1038 29.3392C26.7629 29.727 26.4217 29.7753 25.8373 29.4851C25.2523 29.194 23.3697 28.5821 21.1361 26.6057C19.3983 25.0678 18.225 23.1687 17.884 22.5878C17.543 22.0077 17.8475 21.6933 18.1406 21.4042C18.4033 21.1442 18.7254 20.7267 19.018 20.3881C19.3094 20.0492 19.4067 19.8075 19.6016 19.4205C19.7967 19.0333 19.6991 18.6944 19.5532 18.4042C19.4067 18.114 18.2707 15.2447 17.7509 14.0975Z"
          fill="white"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_3189_16665"
            x1="2268.85"
            y1="4523.69"
            x2="2268.85"
            y2="1.40088"
            gradientUnits="userSpaceOnUse">
            <Stop stop-color="#1FAF38" />
            <Stop offset="1" stop-color="#60D669" />
          </LinearGradient>
          <LinearGradient
            id="paint1_linear_3189_16665"
            x1="2349.41"
            y1="4685.05"
            x2="2349.41"
            y2="0.589844"
            gradientUnits="userSpaceOnUse">
            <Stop stop-color="#F9F9F9" />
            <Stop offset="1" stop-color="white" />
          </LinearGradient>
        </Defs>
      </Svg>
    ),
    facebook: (
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
    ),
    instagram: (
      <Svg
        width="23"
        height="23"
        viewBox="0 0 47 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
          fill="url(#paint0_radial_3204_7466)"
        />
        <Path
          d="M35.9844 0H11.0156C4.93186 0 0 4.93186 0 11.0156V35.9844C0 42.0681 4.93186 47 11.0156 47H35.9844C42.0681 47 47 42.0681 47 35.9844V11.0156C47 4.93186 42.0681 0 35.9844 0Z"
          fill="url(#paint1_radial_3204_7466)"
        />
        <Path
          d="M23.5017 5.14062C18.5156 5.14062 17.8897 5.16247 15.9315 5.25152C13.977 5.34111 12.6428 5.65046 11.4755 6.10449C10.2678 6.57339 9.24358 7.20073 8.22316 8.22151C7.20183 9.24211 6.57449 10.2664 6.10413 11.4735C5.64881 12.6412 5.33909 13.9759 5.25115 15.9295C5.16357 17.8879 5.14062 18.514 5.14062 23.5002C5.14062 28.4864 5.16266 29.1103 5.25152 31.0685C5.34148 33.023 5.65083 34.3572 6.10449 35.5245C6.57376 36.7322 7.2011 37.7564 8.22188 38.7768C9.24211 39.7982 10.2664 40.427 11.4731 40.8959C12.6413 41.3499 13.9757 41.6593 15.9299 41.7489C17.8883 41.8379 18.5136 41.8597 23.4994 41.8597C28.486 41.8597 29.1099 41.8379 31.0681 41.7489C33.0226 41.6593 34.3583 41.3499 35.5265 40.8959C36.7336 40.427 37.7564 39.7982 38.7765 38.7768C39.7978 37.7564 40.425 36.7322 40.8955 35.525C41.3468 34.3572 41.6567 33.0226 41.7485 31.0688C41.8364 29.1106 41.8594 28.4864 41.8594 23.5002C41.8594 18.514 41.8364 17.8883 41.7485 15.9299C41.6567 13.9753 41.3468 12.6413 40.8955 11.4741C40.425 10.2664 39.7978 9.24211 38.7765 8.22151C37.7553 7.20036 36.734 6.57302 35.5254 6.10468C34.355 5.65046 33.0201 5.34093 31.0655 5.25152C29.1071 5.16247 28.4837 5.14062 23.496 5.14062H23.5017ZM21.8546 8.44917C22.3435 8.44843 22.889 8.44917 23.5017 8.44917C28.4038 8.44917 28.9847 8.46679 30.9205 8.55473C32.7105 8.63662 33.6821 8.93569 34.3293 9.18703C35.1861 9.5197 35.7969 9.91755 36.4391 10.5603C37.0817 11.2029 37.4794 11.8148 37.813 12.6716C38.0643 13.3179 38.3638 14.2895 38.4453 16.0795C38.5332 18.015 38.5523 18.5962 38.5523 23.496C38.5523 28.3957 38.5332 28.9772 38.4453 30.9124C38.3634 32.7025 38.0643 33.674 37.813 34.3205C37.4803 35.1773 37.0817 35.7874 36.4391 36.4296C35.7966 37.0722 35.1865 37.4698 34.3293 37.8027C33.6828 38.0551 32.7105 38.3535 30.9205 38.4354C28.985 38.5233 28.4038 38.5424 23.5017 38.5424C18.5993 38.5424 18.0183 38.5233 16.083 38.4354C14.293 38.3527 13.3214 38.0537 12.6737 37.8023C11.817 37.4695 11.2049 37.0718 10.5623 36.4292C9.91975 35.7866 9.52209 35.1762 9.1885 34.319C8.93716 33.6726 8.63772 32.701 8.5562 30.9109C8.46826 28.9755 8.45064 28.3942 8.45064 23.4914C8.45064 18.5887 8.46826 18.0104 8.5562 16.0749C8.63809 14.2849 8.93716 13.3133 9.1885 12.6661C9.52136 11.8093 9.91975 11.1974 10.5625 10.5548C11.2051 9.91223 11.817 9.51438 12.6738 9.18097C13.321 8.92853 14.293 8.63019 16.083 8.54794C17.7766 8.47138 18.433 8.44843 21.8546 8.44458V8.44917ZM33.3019 11.4976C32.0856 11.4976 31.0988 12.4835 31.0988 13.6999C31.0988 14.9163 32.0856 15.9031 33.3019 15.9031C34.5182 15.9031 35.505 14.9163 35.505 13.6999C35.505 12.4836 34.5182 11.4968 33.3019 11.4968V11.4976ZM23.5017 14.0717C18.2949 14.0717 14.0734 18.2933 14.0734 23.5002C14.0734 28.7071 18.2949 32.9266 23.5017 32.9266C28.7086 32.9266 32.9286 28.7071 32.9286 23.5002C32.9286 18.2935 28.7082 14.0717 23.5013 14.0717H23.5017ZM23.5017 17.3803C26.8814 17.3803 29.6216 20.12 29.6216 23.5002C29.6216 26.88 26.8814 29.6201 23.5017 29.6201C20.1217 29.6201 17.3819 26.88 17.3819 23.5002C17.3819 20.12 20.1217 17.3803 23.5017 17.3803Z"
          fill="white"
        />
        <Defs>
          <RadialGradient
            id="paint0_radial_3204_7466"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(12.4844 50.6199) rotate(-90) scale(46.5805 43.3235)">
            <Stop stop-color="#FFDD55" />
            <Stop offset="0.1" stop-color="#FFDD55" />
            <Stop offset="0.5" stop-color="#FF543E" />
            <Stop offset="1" stop-color="#C837AB" />
          </RadialGradient>
          <RadialGradient
            id="paint1_radial_3204_7466"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(-7.87268 3.38565) rotate(78.681) scale(20.8217 85.8279)">
            <Stop stop-color="#3771C8" />
            <Stop offset="0.128" stop-color="#3771C8" />
            <Stop offset="1" stop-color="#6600FF" stop-opacity="0" />
          </RadialGradient>
        </Defs>
      </Svg>
    ),
    twitter: (
      <Svg
        width="23"
        height="23"
        viewBox="0 0 47 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M37.0145 2.25781H44.2211L28.4761 20.2549L47 44.7399H32.4966L21.1382 29.8879L8.13883 44.7399H0.92825L17.7699 25.4895L0 2.25977H14.8716L25.1391 15.8349L37.0145 2.25781ZM34.4863 40.4277H38.4793L12.7018 6.34485H8.41692L34.4863 40.4277Z"
          fill="white"
        />
      </Svg>
    ),
    tiktok: (
      <Svg
        width="23"
        height="23"
        viewBox="0 0 47 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M34.8307 17.5134C38.2597 19.6762 42.4604 20.9488 46.9973 20.9488V13.2457C46.1386 13.2458 45.2822 13.1667 44.4422 13.0097V19.0732C39.9057 19.0732 35.7055 17.8008 32.2758 15.6381V31.3582C32.2758 39.2222 25.0507 45.5967 16.1389 45.5967C12.8137 45.5967 9.72286 44.7097 7.15546 43.1884C10.0858 45.8322 14.1723 47.4722 18.6933 47.4722C27.6058 47.4722 34.8311 41.0977 34.8311 33.2333V17.5134H34.8307ZM37.9828 9.7419C36.2303 8.05266 35.0796 5.86959 34.8307 3.45606V2.46533H32.4094C33.0189 5.53281 35.098 8.15347 37.9828 9.7419ZM12.7922 37.1539C11.8131 36.0213 11.2839 34.6355 11.2862 33.2108C11.2862 29.6142 14.5909 26.6979 18.6681 26.6979C19.4278 26.6975 20.183 26.8005 20.9073 27.0031V19.1276C20.0609 19.0254 19.2069 18.9818 18.3533 18.9978V25.1276C17.6287 24.9249 16.8731 24.822 16.113 24.8226C12.036 24.8226 8.73151 27.7385 8.73151 31.3356C8.73151 33.8792 10.3832 36.0812 12.7922 37.1539Z"
          fill="#FF004F"
        />
        <Path
          d="M32.2758 15.638C35.7057 17.8006 39.9055 19.073 44.4422 19.073V13.0095C41.9098 12.5335 39.6681 11.366 37.9826 9.7419C35.0976 8.1533 33.0189 5.53265 32.4094 2.46533H26.0496V33.233C26.0351 36.8199 22.7361 39.7242 18.6677 39.7242C16.2705 39.7242 14.1406 38.7159 12.7918 37.1538C10.3832 36.0812 8.73132 33.879 8.73132 31.3358C8.73132 27.739 12.0358 24.8227 16.1128 24.8227C16.894 24.8227 17.6468 24.93 18.3531 25.1278V18.998C9.59764 19.1576 2.55634 25.4699 2.55634 33.2331C2.55634 37.1085 4.30973 40.6217 7.15563 43.1887C9.72303 44.7097 12.8136 45.5971 16.1391 45.5971C25.0511 45.5971 32.276 39.2221 32.276 31.3582L32.2758 15.638Z"
          fill="black"
        />
        <Path
          d="M44.4423 13.0092V11.37C42.1587 11.3731 39.9203 10.8088 37.9828 9.74172C39.6978 11.3984 41.9561 12.5409 44.4423 13.0095M32.4094 2.46498C32.3513 2.1719 32.3067 1.87685 32.2758 1.58057V0.589844H23.4943V31.3578C23.4803 34.9444 20.1813 37.8487 16.1128 37.8487C14.9594 37.8502 13.8218 37.6122 12.7918 37.1539C14.1406 38.7158 16.2705 39.7238 18.6677 39.7238C22.7359 39.7238 26.0352 36.8199 26.0496 33.233V2.46514L32.4094 2.46498ZM18.3536 18.9976V17.2523C17.6198 17.1638 16.88 17.1195 16.1394 17.1197C7.22648 17.1197 0.00158691 23.4946 0.00158691 31.3578C0.00158691 36.2878 2.84106 40.6325 7.15598 43.1882C4.31009 40.6214 2.55669 37.108 2.55669 33.2328C2.55669 25.4697 9.59781 19.1573 18.3536 18.9976Z"
          fill="#00F2EA"
        />
      </Svg>
    ),
    threads: (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        viewBox="0 0 47 48"
        fill="none">
        <Path
          d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
          fill="white"
        />
        <Path
          d="M33.293 4.50652H13.7096C11.1127 4.50652 8.62218 5.53813 6.78588 7.37443C4.94959 9.21072 3.91797 11.7013 3.91797 14.2982V33.8815C3.91797 36.4784 4.94959 38.969 6.78588 40.8053C8.62218 42.6416 11.1127 43.6732 13.7096 43.6732H33.293C35.8899 43.6732 38.3804 42.6416 40.2167 40.8053C42.053 38.969 43.0846 36.4784 43.0846 33.8815V14.2982C43.0846 11.7013 42.053 9.21072 40.2167 7.37443C38.3804 5.53813 35.8899 4.50652 33.293 4.50652ZM14.728 29.0444C15.0366 30.075 15.513 31.0476 16.138 31.9232C17.0301 33.1555 18.2618 34.1014 19.6826 34.6453C20.5579 34.9703 21.4744 35.1818 22.4046 35.2719C23.3172 35.3601 24.2337 35.3601 25.1463 35.2719C26.2109 35.1903 27.2523 34.9183 28.2209 34.469C29.3171 33.9357 30.2554 33.1257 30.943 32.119C31.3566 31.5279 31.6298 30.8502 31.7418 30.1375C31.8538 29.4248 31.8016 28.696 31.5892 28.0065C31.3306 27.1347 30.7767 26.38 30.0226 25.8719L29.6309 25.5978C29.6309 25.774 29.6309 25.9307 29.533 26.0873C29.3959 26.9686 29.1021 27.8146 28.6713 28.594C28.29 29.2923 27.7521 29.8926 27.0997 30.348C26.4473 30.8033 25.6982 31.1012 24.9113 31.2182C23.8762 31.4209 22.8071 31.3671 21.7976 31.0615C20.96 30.8305 20.1973 30.385 19.5846 29.769C18.913 29.0857 18.4921 28.1954 18.3901 27.2428C18.292 26.4365 18.4238 25.619 18.7703 24.8844C19.1167 24.1498 19.6638 23.5282 20.3484 23.0911C21.0603 22.6185 21.8592 22.2923 22.6984 22.1315C23.5268 21.9944 24.3649 21.9357 25.2051 21.9553C25.8609 21.9725 26.515 22.0314 27.1634 22.1315H27.2809C27.1938 21.5957 27.0149 21.079 26.7521 20.604C26.5625 20.2873 26.31 20.0127 26.0103 19.7971C25.7105 19.5816 25.3699 19.4297 25.0092 19.3507C24.1478 19.0862 23.2269 19.0862 22.3655 19.3507C21.7447 19.5702 21.2052 19.9732 20.8184 20.5061V20.6432L18.8601 19.2919V19.1548C19.6761 17.972 20.9183 17.1509 22.3263 16.8636C23.5272 16.6017 24.7754 16.6557 25.9492 17.0203C26.6074 17.2218 27.2167 17.5572 27.7391 18.0054C28.2614 18.4536 28.6855 19.005 28.9846 19.6248C29.3293 20.3279 29.5623 21.0818 29.6701 21.8573C29.7273 22.194 29.76 22.5343 29.768 22.8757L30.3555 23.1498C31.274 23.6376 32.0861 24.3033 32.7446 25.1082C33.4222 25.9444 33.8668 26.9431 34.0371 28.0065C34.1762 28.6488 34.2232 29.3088 34.1742 29.9648C34.0741 31.5953 33.4332 33.1458 32.353 34.3711C30.9875 35.9854 29.1299 37.1068 27.0655 37.5632C26.1564 37.7535 25.2325 37.8649 24.3042 37.8961C23.4609 37.9316 22.616 37.8988 21.778 37.7982C20.4186 37.6388 19.0951 37.255 17.8613 36.6623C16.2715 35.8568 14.9209 34.648 13.9446 33.1569C13.2217 32.032 12.6737 30.8038 12.3192 29.5144C12.0568 28.5451 11.8668 27.5561 11.7513 26.5573V24.0898C11.7513 23.2673 11.7513 22.4448 11.8884 21.6223C11.9689 20.6919 12.1195 19.7689 12.3388 18.8611C12.6379 17.7175 13.0996 16.6227 13.7096 15.6103C14.9328 13.4277 16.9321 11.7849 19.3105 11.0082C20.1639 10.7185 21.0424 10.5087 21.9346 10.3815C23.0538 10.2542 24.1838 10.2542 25.303 10.3815C26.6554 10.5048 27.9784 10.8488 29.2196 11.3998C31.0108 12.1899 32.5346 13.4824 33.6063 15.1207C34.3578 16.3031 34.9133 17.5993 35.2513 18.959L32.9405 19.5857V19.429C32.6804 18.5014 32.2985 17.6124 31.8046 16.7853C30.8005 15.154 29.2437 13.9378 27.418 13.3582C26.4568 13.032 25.455 12.8409 24.4413 12.7903C23.6918 12.7313 22.9388 12.7313 22.1892 12.7903C21.0325 12.9035 19.9052 13.2218 18.8601 13.7303C17.5093 14.4357 16.3983 15.5262 15.668 16.8636C15.1623 17.7798 14.7867 18.7618 14.5517 19.7815C14.345 20.6108 14.2074 21.4558 14.1405 22.3078C14.0913 23.123 14.0913 23.9405 14.1405 24.7557C14.1499 26.2047 14.3474 27.6463 14.728 29.0444Z"
          fill="white"
        />
        <Path
          d="M27.4166 24.6969C27.3736 25.5194 27.1875 26.3282 26.8683 27.0861C26.6071 27.6636 26.1769 28.1484 25.6346 28.4765C25.2703 28.6723 24.8708 28.7996 24.4596 28.8486C23.8648 28.9663 23.2527 28.9663 22.6579 28.8486C22.2676 28.7448 21.9016 28.5651 21.5808 28.3198C21.3864 28.1485 21.228 27.9403 21.1147 27.7072C21.0015 27.4741 20.9356 27.2209 20.9211 26.9622C20.9065 26.7035 20.9435 26.4444 21.0298 26.2001C21.1162 25.9558 21.2502 25.7311 21.4241 25.539C21.7887 25.1802 22.2412 24.9236 22.7362 24.7948C23.2689 24.6284 23.8231 24.5501 24.3812 24.5598C24.8904 24.5305 25.3996 24.5305 25.9087 24.5598C26.3826 24.5971 26.8526 24.6617 27.3187 24.7557L27.4166 24.6969Z"
          fill="white"
        />
      </Svg>
    ),
  };

  const fetchUserAccessToken = () => {
    // Your code to run on screen focus
    AsyncStorage.getItem('accesstoken')
      .then(data => {
        // eslint-disable-next-line no-shadow
        const userAccessToken = JSON.parse(data);
        setUserAccessToken(userAccessToken);
        console.log('AccessToken Loading');

        if (!userAccessToken) {
          navigation.navigate('SignIn');
          console.log('AccessToken Not found', userAccessToken);
        }
      })
      .catch(error => {
        console.error('Error retrieving user token:', error);
      });
  };
  useEffect(() => {
    fetchUserAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPendingTasks = async () => {
    setFectching(true);
    if (userAccessToken) {
      try {
        const response = await fetch(
          `${ApiLink.ENDPOINT_1}/performed-tasks?status=pending`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAccessToken.accessToken}`,
            },
          },
        );
        const data = await response.json();

        const task = data.performed_tasks[0]?.task;
        if (response.ok && data.performed_tasks.length > 0) {
          setPendingTasks(data.performed_tasks);
          setTasks(task);
          console.log(tasks, 'hiiiiii');
          console.log(pendingTasks, 'h0000');
          console.log('Successful Tasks fetch:', data);
          console.log('Successful Tasks fetch:', data);
          setFectching(false);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            style: {
              borderLeftColor: 'pink',
              backgroundColor: 'yellow',
              width: '80%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            text1Style: {
              color: 'red',
              fontSize: 14,
            },
            text2Style: {
              color: 'green',
              fontSize: 14,
              fontFamily: 'Manrope-ExtraBold',
            },
          });
        } else {
          if (response.status === 401) {
            console.log('401 Unauthorized: Access token is invalid or expired');
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.data.message,
              style: {
                borderLeftColor: 'pink',
                backgroundColor: 'yellow',
                width: '80%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text1Style: {
                color: 'red',
                fontSize: 14,
              },
              text2Style: {
                color: 'green',
                fontSize: 14,
                fontFamily: 'Manrope-ExtraBold',
              },
            });
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          }
          setFectching(false);
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error during Tasks fetch:', error);
        setFectching(false);
        Toast.show({
          type: 'success',

          text2: error.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 14,
          },
          text2Style: {
            color: 'green',
            fontSize: 14,
            fontFamily: 'Manrope-ExtraBold',
          },
        });
      }
    }
  };

  useEffect(() => {
    fetchPendingTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccessToken]);

  const GenerateTasks = async () => {
    setGenerating(true);
    if (userAccessToken) {
      try {
        const response = await fetch(`${ApiLink.ENDPOINT_1}/generate-task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userAccessToken.accessToken}`, // Add the access token to the headers
          },
          body: JSON.stringify({
            task_type: 'advert',
            platform: 'facebook',
          }),
        });

        const data = await response.json();

        if (response.ok && response.status === 200) {
          setGenerating(false);
          console.log('Successful Generating Tasks', data);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            style: {
              borderLeftColor: 'pink',
              backgroundColor: 'yellow',
              width: '80%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            text1Style: {
              color: 'red',
              fontSize: 14,
            },
            text2Style: {
              color: 'green',
              fontSize: 14,
              fontFamily: 'Manrope-ExtraBold',
            },
          });
          AsyncStorage.setItem(
            'GeneratedTasks',
            JSON.stringify({
              Tasks: data,
            }),
          )
            .then(() => {
              navigation.navigate('Earn2FB');
            })
            .catch(error => {
              console.error('Error storing Generated Tasks:', error);
            });
        } else {
          if (response.status === 401) {
            setGenerating(false);
            console.log('401 Unauthorized: Access token is invalid or expired');
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: response.data.message,
              style: {
                borderLeftColor: 'pink',
                backgroundColor: 'yellow',
                width: '80%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text1Style: {
                color: 'red',
                fontSize: 14,
              },
              text2Style: {
                color: 'green',
                fontSize: 14,
                fontFamily: 'Manrope-ExtraBold',
              },
            });
            await AsyncStorage.removeItem('userbalance');
            await AsyncStorage.removeItem('userdata1');
            await AsyncStorage.removeItem('userdata');
            await AsyncStorage.removeItem('userdata2');
            await AsyncStorage.removeItem('userdatas');
            await AsyncStorage.removeItem('userdatafiles1');
            await AsyncStorage.removeItem('accesstoken');
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'SignIn',
                },
              ],
            });
          }
          setGenerating(false);
          throw new Error(data.message);
        }
      } catch (error) {
        setGenerating(false);
        Toast.show({
          type: 'error',
          text2: error.message,
          style: {
            borderLeftColor: 'pink',
            backgroundColor: 'yellow',
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          },
          text1Style: {
            color: 'red',
            fontSize: 14,
          },
          text2Style: {
            color: 'green',
            fontSize: 14,
            fontFamily: 'Manrope-ExtraBold',
          },
        });
        console.error('Error during Tasks Generation:', error);
      }
    } else {
      console.log('No access token found');
    }
  };

  return (
    <>
      {fetching ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View>
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  backgroundColor: 'rgba(47, 47, 47, 0.42)',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  padding: 10,
                  marginBottom: 10, // Add space between items
                }}
                onPress={() =>
                  navigation.navigate(
                    tasks && tasks.platform && platformNav[tasks.platform],
                  )
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  {tasks && tasks.platform && platformImages[tasks.platform]}
                  <View
                    style={{
                      backgroundColor: '#323232',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 4,
                      width: '30%',
                      borderRadius: 4,
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    <Text
                      style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>
                      Pending
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#fff',
                    paddingTop: 10,
                    fontFamily: 'Manrope-Medium',
                  }}>
                  {tasks.caption}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    gap: 7,
                    paddingRight: 50,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Manrope-ExtraBold',
                      fontSize: 12,
                    }}>
                    ₦{tasks && tasks.platform && platformPrices[tasks.platform]}{' '}
                    per task
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
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
                style={{
                  color: '#fff',
                  fontFamily: 'Manrope-ExtraBold',
                  paddingTop: 15,
                }}>
                Need quick cash to earn?
              </Text>
              <Text
                style={{
                  color: '#B1B1B1',
                  fontFamily: 'Manrope-Regular',
                  paddingTop: 7,
                  fontSize: 12,
                  textAlign: 'center',
                }}>
                Earn steady income by posting adverts of insividuals, businesses
                and top brands on your social media page. To post adverts on
                Facebook, Instagram, Twitter or Tiktok, you MUST have at
                least 500 Followers on your social media account.
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
                      fontFamily: 'Manrope-Medium',
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
                                fontFamily: 'Manrope-ExtraBold',
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
                                fontFamily: 'Manrope-Regular',
                                textAlign: 'center',
                                paddingHorizontal: 20,
                              }}>
                              Are you sure you want to generate your next
                              Facebook Advert task now. You have 1 hour to
                              perform this task. Please confirm only if you are
                              ready to perform the task.
                            </Text>
                          </View>
                          <View
                            style={{paddingHorizontal: 10, paddingBottom: 30}}>
                            <TouchableOpacity
                              style={{
                                backgroundColor: '#CB29BE',
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                borderRadius: 110,
                              }}
                              onPress={() => GenerateTasks()}>
                              {generating ? (
                                <ActivityIndicator size="small" color="#fff" />
                              ) : (
                                <Text
                                  style={{
                                    color: '#fff',
                                    fontFamily: 'Manrope-Regular',
                                    fontSize: 14,
                                  }}>
                                  Confirm
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </SafeAreaView>
                    </>
                  </View>
                </Modal>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default Earn1FBMenu;
