import React from 'react';
import {AppRegistry, Text, TextInput, Platform, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Provider} from 'react-redux';
import initStore from './src/redux/store';
import {createInstance, HackleProvider} from '@hackler/react-native-sdk';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (Platform.OS === 'ios') {
    PushNotificationIOS.getApplicationIconBadgeNumber(function (number) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number + 1);
    });
  }
});

async function registerAppWithFCM() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();

  if (authStatus) {
    console.log('Permission settings:', authStatus);
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Firebase push Token is:', fcmToken);
    }
  }
}
registerAppWithFCM();
requestUserPermission();

const store = initStore();
const config = {
  debug: true,
};
const hackleClient = createInstance('n2wEeLUKfPAOW0Ph56f5LfFYHxQB1vac', config);

const RNRedux = () => (
  <HackleProvider hackleClient={hackleClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </HackleProvider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
