/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';

import EarnModalContent from '../modalContents/earnModalContent';

const deviceHeight = Dimensions.get('window').height;

export class Earn1Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  show = () => {
    this.setState({show: true});
  };

  close = () => {
    this.setState({show: false});
  };

  renderOutsideTouchable(onTouch) {
    const view = <View style={{flex: 1, width: '100%'}} />;
    if (!onTouch)
      // eslint-disable-next-line curly
      return view;

    return (
      <TouchableWithoutFeedback
        onPress={onTouch}
        style={{flex: 1, width: '100%'}}>
        {view}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    let {show} = this.state;
    const {onTouchOutside} = this.props;

    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={show}
        onRequestClose={this.close}>
        <TouchableWithoutFeedback onPress={onTouchOutside}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000AA',
              justifyContent: 'flex-end',
            }}>
            {this.renderOutsideTouchable(onTouchOutside)}
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
                }}>
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
                  <ImageBackground
                    source={require('../../assets/close cross.png')}
                    style={{
                      width: 25,
                      height: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {this.renderOutsideTouchable(onTouchOutside)}
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <EarnModalContent closePopup={this.close} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
