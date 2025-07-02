import * as React from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import Router from './navigations/Routers';
import {createNotifications} from 'react-native-notificated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {en, enGB, registerTranslation} from 'react-native-paper-dates';
import {Provider} from 'react-redux';
import {Store} from './redux/Store';
import {PaperProvider} from 'react-native-paper';
import * as encoding from 'text-encoding';
import {encode as btoa} from 'base-64';
import {LogBox} from 'react-native';
import {ZegoCallInvitationDialog} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import analytics from '@react-native-firebase/analytics';
import {LoadingProvider, useLoading} from './utils/LoadingContext';
import LoadingUI from './utils/LoadingUI';

LogBox.ignoreAllLogs();

registerTranslation('pl', {
  save: 'Lưu',
  selectSingle: 'Chọn ngày',
  selectMultiple: 'Chọn ngày',
  selectRange: 'Chọn khoảng thời gian',
  notAccordingToDateFormat: inputFormat => `Date format must be ${inputFormat}`,
  mustBeHigherThan: date => `Must be later then ${date}`,
  mustBeLowerThan: date => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Ngày không được phép',
  previous: 'Trước',
  next: 'Tiếp',
  typeInDate: 'Nhập ngày',
  pickDateFromCalendar: 'Chọn ngày từ lịch',
  close: 'Đóng',
  hour: 'Giờ',
  minute: 'Phút',
});
registerTranslation('en-GB', enGB);
registerTranslation('en', en);
var encoder = new encoding.TextEncoder();

const {NotificationsProvider} = createNotifications();
function App() {
  const routeNameRef = React.useRef<string | undefined>(undefined);
  const navigationRef = React.useRef<NavigationContainerRef<any>>(null);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={Store}>
        <LoadingProvider>
          <PaperProvider>
            <NotificationsProvider>
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  routeNameRef.current =
                    navigationRef?.current?.getCurrentRoute()?.name ?? '';
                }}
                onStateChange={async () => {
                  const previousRouteName = routeNameRef.current;
                  const currentRouteName =
                    navigationRef.current?.getCurrentRoute()?.name;

                  if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                      screen_name: currentRouteName,
                      screen_class: currentRouteName,
                    });
                  }
                  routeNameRef.current = currentRouteName;
                }}>
                <ZegoCallInvitationDialog />
                <Router />
              </NavigationContainer>
              <GlobalLoading />
            </NotificationsProvider>
          </PaperProvider>
        </LoadingProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;

const GlobalLoading = () => {
  const {loading} = useLoading();
  return <LoadingUI visible={loading} />;
};
