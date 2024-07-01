import * as React from 'react';
import Svg, {SvgProps, G, Rect, ClipPath, Path, Defs} from 'react-native-svg';

const SearchIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G clip-path="url(#clip0_2596_5956)">
      <Path
        d="M14.9497 14.9498C12.2161 17.6835 7.78392 17.6835 5.05025 14.9498C2.31658 12.2162 2.31658 7.784 5.05025 5.05033C7.78392 2.31666 12.2161 2.31666 14.9497 5.05033C17.6834 7.784 17.6834 12.2162 14.9497 14.9498ZM14.9497 14.9498L20.5 20.5001"
        stroke="#0E0E2C"
        strokeWidth="1.5"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_2596_5956">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SearchIcon;
