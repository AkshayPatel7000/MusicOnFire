import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DownloadScreen from '../Screens/DownloadScreen';
import OnlineScreen from '../Screens/OnlineScreen';
import { COLORS } from '../Utils/Constants';

FontAwesome.loadFont();

const Tab = createMaterialBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Online"
      activeColor="#d9d9d9"
      inactiveColor="#626163"
      labelStyle={{color: '#b5770b'}}
      // shifting={true}
      labeled={false}
      barStyle={{backgroundColor: '#2E2E2E'}}>
      <Tab.Screen
        name="Online"
        options={{
          tabBarIcon: ({color, focused}) => (
            <FontAwesome
              name="music"
              color={focused ? COLORS.primary : color}
              size={24}
            />
          ),
        }}
        component={OnlineScreen}
      />
      <Tab.Screen
        name="Youtube"
        options={{
          tabBarIcon: ({color, focused}) => (
            <FontAwesome
              name="youtube-play"
              color={focused ? '#FF0000' : color}
              size={24}
            />
          ),
        }}
        component={DownloadScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
