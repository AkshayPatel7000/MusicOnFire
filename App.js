import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Routes from './src/Routes';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './src/Screens/NoInternet';
import {COLORS} from './src/Utils/Constants';

const App = () => {
  const [netConnected, setNetConnected] = useState(undefined);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetConnected(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
      {netConnected && <Routes />}
      {netConnected === false && <NoInternet />}
    </SafeAreaView>
  );
};

export default App;
