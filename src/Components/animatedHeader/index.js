import {Animated, Dimensions, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HEADER_HEIGHT = 300;

const AnimatedHeader = ({animatedValue}) => {
  const insets = useSafeAreaInsets();

  const headerHeight = animatedValue.interpolate({
    inputRange: [0, HEADER_HEIGHT + insets.top],
    outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: headerHeight,
        backgroundColor: '#2E2E2E',
      }}>
      {<Animated.Image
        source={{
          uri: 'https://c.saavncdn.com/482/Merre-Liye-Hindi-2022-20220817194916-500x500.jpg?bch=464002',
        }}
        style={{height: headerHeight, width: Dimensions.get('screen').width}}
      />}
    </Animated.View>
  );
};

export default AnimatedHeader;
