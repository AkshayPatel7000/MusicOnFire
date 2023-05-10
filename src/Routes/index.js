import {NavigationContainer} from '@react-navigation/native';
import MyStack from './StackRoutes';

const Routes = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default Routes;
