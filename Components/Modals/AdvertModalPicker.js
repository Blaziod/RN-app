/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {ApiLink} from '../../enums/apiLink';

const OPTIONS = [
  'Facebook',
  'Instagram',
  'Twitter',
  'Youtube',
  'TikTok',
  'WhatsApp',
  'AudioMack',
  'Apple',
  'Social',
  'Follow',
  'Google Play Store',
  'Spotify',
];
const OPTIONS3 = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];
const OPTIONS4 = ['All Gender', 'Male', 'Female'];

const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;

const AdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[1]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const FBAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[0]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const TKAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[4]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const YTAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[3]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const WAAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[5]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const XAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[2]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const AMAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[6]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const APAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[7]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const LSAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[8]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const FSAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[9]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const GPAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[10]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const SPAdvertiseModalPicker = props => {
  const onPressItem = option => {
    props.changeModalVisibility(false);
    props.setData(option);
  };

  const item = OPTIONS[11]; // Access the second item directly
  return (
    <TouchableOpacity
      onPress={() => props.changeModalVisibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onPressItem(item)}>
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const AdvertiseModalPicker2 = props => {
  const [isLoading, setIsLoading] = useState(true); // Add this line
  useEffect(() => {
    function FetchCountry() {
      setIsLoading(true); // Set loading to true when the fetch starts
      fetch(`${ApiLink.ENDPOINT_1}/countries`)
        .then(response => response.json())
        .then(data => {
          setLocations(data.countries);
          setIsLoading(false); // Set loading to false when the fetch completes
        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoading(false); // Also set loading to false on error
        });
    }
    FetchCountry();
  }, []);

  const [locations, setLocations] = useState([]); // Add this line

  const onPressItem = option2 => {
    props.changeModal2Visibility(false);
    props.setData2(option2);
  };

  const option2 = locations.map((item, index) => {
    // Replace OPTIONS2 with locations
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item.name)}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changeModal2Visibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          <ScrollView>{option2}</ScrollView>
        )}
      </View>
    </TouchableOpacity>
  );
};
const AdvertiseModalPicker5 = props => {
  const [isLoading, setIsLoading] = useState(true); // Add this line
  useEffect(() => {
    function FetchReligion() {
      setIsLoading(true); // Set loading to true when the fetch starts
      fetch(`${ApiLink.ENDPOINT_1}/religions`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setReligion(data.religions);
          setIsLoading(false); // Set loading to false when the fetch completes
        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoading(false); // Also set loading to false on error
        });
    }
    FetchReligion();
  }, []);

  const [religion, setReligion] = useState([]); // Add this line

  const onPressItem = option5 => {
    props.changeModal5Visibility(false);
    props.setData5(option5);
  };

  const option5 = religion.map((item, index) => {
    // Replace OPTIONS2 with locations
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <TouchableOpacity
      onPress={() => props.changeModal5Visibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          <ScrollView>{option5}</ScrollView>
        )}
      </View>
    </TouchableOpacity>
  );
};

const AdvertiseModalPicker3 = props => {
  const onPressItem = option3 => {
    props.changeModal3Visibility(false);
    props.setData3(option3);
  };

  const option3 = OPTIONS3.map((item, index) => {
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  });
  return (
    <TouchableOpacity
      onPress={() => props.changeModal3Visibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <ScrollView>{option3}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const AdvertiseModalPicker4 = props => {
  const onPressItem = option4 => {
    props.changeModal4Visibility(false);
    props.setData4(option4);
  };

  const option4 = OPTIONS4.map((item, index) => {
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  });
  return (
    <TouchableOpacity
      onPress={() => props.changeModal4Visibility(false)}
      style={styles.ModalPicker}>
      <View style={styles.modal}>
        <ScrollView>{option4}</ScrollView>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  ModalPicker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: WIDTH - 20,
    // height: HEIGHT / 4,
    borderRadius: 10,
    padding: 10,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 20,
    margin: 20,
    color: '#000',
    fontFamily: 'Campton Bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {
  AdvertiseModalPicker,
  AdvertiseModalPicker2,
  AdvertiseModalPicker3,
  AdvertiseModalPicker4,
  AdvertiseModalPicker5,
  FBAdvertiseModalPicker,
  TKAdvertiseModalPicker,
  YTAdvertiseModalPicker,
  WAAdvertiseModalPicker,
  XAdvertiseModalPicker,
  AMAdvertiseModalPicker,
  APAdvertiseModalPicker,
  LSAdvertiseModalPicker,
  FSAdvertiseModalPicker,
  GPAdvertiseModalPicker,
  SPAdvertiseModalPicker,
};
