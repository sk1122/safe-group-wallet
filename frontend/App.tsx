import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

import Login from './Screens/Login';
import Onboard from './Screens/Onboard';
import Squad from './Screens/Squad';
import Create from './Screens/Create';
import {config} from 'process';
const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        Onboard: '/Onboard',
        Squad: '/Squad',
        Create: '/Create',
      },
    },
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="Squad" component={Squad} />
        <Stack.Screen name="Create" component={Create} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
