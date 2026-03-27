/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import {StyleSheet} from 'react-native';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Main from './screens/Main';
import Contact from './screens/Contact';
import BottomBar from './components/BottomBar';
import ForgetPassword from './screens/ForgetPassword';
import NewPassword from './screens/NewPassword';
import Support from './screens/Support';
import AddContactFromPhone from './components/AddContactFromPhone';
import AddContact from './screens/AddContact';
import ContactProfile from './screens/ContactProfile';
import EditContact from './screens/EditContact';
import ContactHistory from './screens/ContactHistory';
import Profile from './screens/Profile';

import Gamification from './screens/Gamification';
import GetCodeVerifyUser from './screens/GetCodeVerifyUser';
import DecisionMaking from './screens/DecisionMaking';
import GetCode from './screens/GetCode';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
      
      <Stack.Screen
          name="SignIn"
          component={Login}
          options={{headerShown: false}}
        />
      <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="Contact"
          component={Contact}
          options={{headerShown: false}}
        />
     
     <Stack.Screen
          name="AddContactFromPhone"
          component={AddContactFromPhone}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="AddContact"
          component={AddContact}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DecisionMaking"
          component={DecisionMaking}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Gamification"
          component={Gamification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewPassword"
          component={NewPassword}
          options={{headerShown: false}}
        />
 <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GetCode"
          component={GetCode}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="GetCodeVerifyUser"
          component={GetCodeVerifyUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name="Support"
          component={Support}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BottomBar"
          component={BottomBar}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ContactProfile"
          component={ContactProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContactHistory"
          component={ContactHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditContact"
          component={EditContact}
          options={{headerShown: false}}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
