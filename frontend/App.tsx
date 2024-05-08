/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './navigations/Routers';
import {createNotifications} from 'react-native-notificated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {NotificationsProvider} = createNotifications();
function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NotificationsProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}

export default App;
