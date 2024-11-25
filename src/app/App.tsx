import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from './index';
import LoginScreen from './Login';
import CupomCrud from './Cupom';
import ProdutosScreen from './Produtos';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews'
]);

export type RootStackParamList = {
  Home: undefined;
  Produtos: undefined;
  Cupom: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Index} />
        <Stack.Screen name="Produtos" component={ProdutosScreen} />
        <Stack.Screen name="Cupom" component={CupomCrud} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;