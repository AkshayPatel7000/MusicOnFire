//import liraries
import LottieView from 'lottie-react-native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../Utils/Constants';
import NoWifi from '../Utils/assets/no-wifi.json'

// create a component
const NoInternet = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={NoWifi}
        autoPlay={true}
        resizeMode="cover"
        style={{height: 200, width: 200}}
      />
      <Text style={styles.heading}>No Internet</Text>
      <Text style={styles.subHeading}>
        Note:- Please check your internet connection or Try again.
      </Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
  },
  heading: {
    fontSize: 28,
    color: COLORS.title,
  },
  subHeading: {
    fontSize: 14,
    color: COLORS.subtitle,
    marginTop: 15,
    width: "68%",
    textAlign: 'center'
  },
});

//make this component available to the app
export default NoInternet;
