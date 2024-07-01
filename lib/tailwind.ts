// lib/tailwind.js
import {create} from 'twrnc';
import {useColorScheme, useWindowDimensions} from 'react-native';

// create the customized version...
const tw = create(require('../tailwind.config')); // <- your path may differ

export function useTw() {
  useWindowDimensions();
  useColorScheme();

  return tw;
}

// ... and then this becomes the main function your app uses
export default tw;
