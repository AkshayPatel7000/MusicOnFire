import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SongListScreen from '../Screens/OnlineScreen/SongList';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator initialRouteName="BottomTab" screenOptions={{headerShown:false}} >
      <Stack.Screen name="BottomTab" component={BottomTabs} />
      <Stack.Screen name="SongList" component={SongListScreen} />
    </Stack.Navigator>
  );
};

export default MyStack;
