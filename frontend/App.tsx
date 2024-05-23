/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './navigations/Routers';
import {createNotifications} from 'react-native-notificated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {en, enGB, registerTranslation} from 'react-native-paper-dates';
import {Provider} from 'react-redux';
import {Store} from './redux/Store';
import {PaperProvider} from 'react-native-paper';
registerTranslation('pl', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',
  notAccordingToDateFormat: inputFormat => `Date format must be ${inputFormat}`,
  mustBeHigherThan: date => `Must be later then ${date}`,
  mustBeLowerThan: date => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Day is not allowed',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',
  hour: '',
  minute: '',
});
registerTranslation('en-GB', enGB);
registerTranslation('en', en);

const {NotificationsProvider} = createNotifications();
function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={Store}>
        <PaperProvider>
          <NotificationsProvider>
            <NavigationContainer>
              <Router />
            </NavigationContainer>
          </NotificationsProvider>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
