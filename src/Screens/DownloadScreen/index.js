import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../Utils/Constants';

const DownloadScreen = () => {
  
  return (
    <View style={styles.HomeContainer}>
      <Text
        style={{
          fontSize: 26,
          letterSpacing: 2,
          fontWeight: '700',
          color: COLORS.primary,
        }}>
        Coming Soon
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  HomeContainer: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DownloadScreen;
