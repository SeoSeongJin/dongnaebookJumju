import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {Dimensions, Image, Platform, StatusBar, Text, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {useEffect, useState} from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';

import DrawerMenu from './src/screens/DrawerMenu';

import CheckScreen from './src/screens/Auth/Check'; // 체크
import LoginScreen from './src/screens/Auth/Login'; // 로그인
import FindIdScreen from './src/screens/Auth/FindId'; // 아이디 찾기
import FindPwdScreen from './src/screens/Auth/FindPwd'; // 비밀번호 찾기
import SetNewPwdScreen from './src/screens/Auth/SetNewPwd'; // 비밀번호 찾기
import OrderListScreen from './src/screens/Orders'; // 메인
import CancelOrdersScreen from './src/screens/Orders/CancelOrders'; // 주문취소건
import OrderDetailScreen from './src/screens/Orders/OrderDetail'; // 주문내역 상세
import SetDayTimeScreen from './src/screens/BusinessHoursAndHolidays/SetDayTime'; // 영업 운영시간 설정
import SetTimeScreen from './src/screens/BusinessHoursAndHolidays/SetTime'; // 영업 시간 추가
import SetClosedScreen from './src/screens/BusinessHoursAndHolidays/SetClosed'; // 정기 휴일 추가
import SetCloseDayScreen from './src/screens/BusinessHoursAndHolidays/SetCloseDay'; // 휴무일 설정
import SetRestTimeScreen from './src/screens/BusinessHoursAndHolidays/SetRestTime'; // 휴게시간 설정
import SelectStoreScreen from './src/screens/SelectStore'; // 매장선택 및 추가
// Swipeout 모듈 수정필요
import SetTipsScreen from './src/screens/Tips'; // 배달팁 설정
import CalculateScreen from './src/screens/Calculate'; // 정산내역
//모듈 사용 x
import ReviewsScreen from './src/screens/Reviews'; // 리뷰

import ReviewNoticeScreen from './src/screens/Reviews/ReviewNotice'; // 리뷰 공지사항
import NoticeScreen from './src/screens/Notice'; // 공지사항
import NoticeDetailScreen from './src/screens/Notice/NoticeDetail'; // 공지사항 상세 - 웹뷰
import CouponScreen from './src/screens/Coupons'; // 쿠폰관리
import CouponAddOrEditScreen from './src/screens/Coupons/CouponAddOrEdit'; // 쿠폰 추가 또느 수정
import SetCategoryScreen from './src/screens/Categories'; // 메뉴 카테고리 설정(리스트)
import SetMenuScreen from './src/screens/Menus'; // 메뉴설정(리스트)
import SetMenuAddOrEditScreen from './src/screens/Menus/SetMenuAddOrEdit'; // 메뉴등록 또는 수정
import StoreInfoScreen from './src/screens/StoreInfo'; // 매장소개
import StoreSettingScreen from './src/screens/StoreSettings'; // 매장설정
import CBSignIn from './src/screens/CouponBook/CBSignIn';
import IamCertification from './src/screens/CouponBook/iamport/IamCertification';
import CBAddCoupon from './src/screens/CouponBook/CBAddCoupon';
import CBHistoryCoupon from './src/screens/CouponBook/CBHistoryCoupon';
import CBStoreInfoSetting from './src/screens/CouponBook/cbMenus/CBStoreInfoSetting';
import CBTimeSetting from './src/screens/CouponBook/CBTimeSetting';
import CBAgreement from './src/screens/CouponBook/CBAgreement';
import Policy from './src/screens/CouponBook/Policy';
import * as orderAction from './src/redux/actions/orderAction';
import Splash from './src/components/Splash';

const App = () => {
  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();
  const dispatch = useDispatch();
  const [splash, setSplash] = useState(false);

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: token => {
      console.log('PushNotification onRegister TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: notification => {
      console.log(
        'PushNotification onNotification notification:',
        notification,
      );

      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
      alert: true,
      sound: true,
      announcement: false,
      badge: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getToken();
    }
  };

  const getToken = async () => {
    const fcmToken = await messaging()
      .getToken()
      .then(token => token);
    if (fcmToken) {
      console.log('FCM ::', fcmToken);
    } else {
      console.log('FCM token is nothing');
    }
  };

  const sendLocalNotificationWithSound = remoteMessage => {
    console.log('remoteMessage ?', remoteMessage);

    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: remoteMessage.notification.notificationId
          ? remoteMessage.notification.notificationId
          : new Date().toString(),
        title: remoteMessage.notification.title,
        subtitle: remoteMessage.notification.message
          ? remoteMessage.notification.message
          : '',
        body: remoteMessage.notification.body,
        sound: remoteMessage.notification.sound,
      });
    } else {
      PushNotification.localNotification({
        channelId: remoteMessage.notification.android.channelId,
        id: remoteMessage.notification.notificationId
          ? remoteMessage.notification.notificationId
          : new Date().toString(),
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        soundName: remoteMessage.notification.android.sound,
        playSound: true,
        smallIcon: 'ic_stat_ic_notification',
        color: '#FFFFFF',
        largeIcon: '',
        largeIconUrl: '',
        vibrate: true,
        groupSummary: true,
      });
    }
  };

  const onRemoteNotification = notification => {
    console.log('ios notification ??', notification);
    const isClicked = notification.getData().userInteraction === 1;

    console.log('isClicked ??', isClicked);
    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  };

  useEffect(() => {
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 1000);
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    } else {
      PushNotification.setApplicationIconBadgeNumber(0);
    }

    requestUserPermission();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const type = 'notification';
      PushNotificationIOS.addEventListener(type, onRemoteNotification);
      return () => {
        PushNotificationIOS.removeEventListener(type);
      };
    }
  });

  useEffect(() => {
    const getMessage = messaging().onMessage(remoteMessage => {
      if (Platform.OS === 'ios') {
        sendLocalNotificationWithSound(remoteMessage);
      }
      sendLocalNotificationWithSound(remoteMessage);
      dispatch(orderAction.getNewOrder());
    });

    return () => getMessage();
  }, []);

  const toastConfig = {
    custom_type: internalState => (
      <View
        style={{
          width: '90%',
          backgroundColor: '#000000e0',
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 17,
        }}
      >
        <Text style={{textAlign: 'center', color: '#fff', fontSize: 11.5}}>
          {internalState.text1}
        </Text>
      </View>
    ),
  };

  const StackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: 'transparent'},
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({current: {progress}}) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
      >
        <Stack.Screen name="Check" component={CheckScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="FindId" component={FindIdScreen} />
        <Stack.Screen name="FindPwd" component={FindPwdScreen} />
        <Stack.Screen name="SetNewPwd" component={SetNewPwdScreen} />
        <Stack.Screen name="Main" component={OrderListScreen} />
        <Stack.Screen name="CancelOrders" component={CancelOrdersScreen} />
        <Stack.Screen name="SelectStore" component={SelectStoreScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="SetDayTime" component={SetDayTimeScreen} />
        <Stack.Screen name="SetTime" component={SetTimeScreen} />
        <Stack.Screen name="SetClosed" component={SetClosedScreen} />
        <Stack.Screen name="SetCloseDay" component={SetCloseDayScreen} />
        <Stack.Screen name="SetRestTime" component={SetRestTimeScreen} />
        <Stack.Screen name="SetTips" component={SetTipsScreen} />
        <Stack.Screen name="Calculate" component={CalculateScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="ReviewNotice" component={ReviewNoticeScreen} />
        <Stack.Screen name="Notice" component={NoticeScreen} />
        <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
        <Stack.Screen name="Coupon" component={CouponScreen} />
        <Stack.Screen
          name="CouponAddOrEdit"
          component={CouponAddOrEditScreen}
        />
        <Stack.Screen name="setCategory" component={SetCategoryScreen} />
        <Stack.Screen name="SetMenu" component={SetMenuScreen} />
        <Stack.Screen
          name="SetMenuAddOrEdit"
          component={SetMenuAddOrEditScreen}
        />
        <Stack.Screen name="StoreInfo" component={StoreInfoScreen} />
        <Stack.Screen name="StoreSetting" component={StoreSettingScreen} />

        {/* 221209 쿠폰북 추가 */}
        <Stack.Screen name="CBSignIn" component={CBSignIn} />
        <Stack.Screen name="CBAgreement" component={CBAgreement} />
        <Stack.Screen name="Policy" component={Policy} />

        {/* 본인인증 */}
        <Stack.Screen name="IamCertification" component={IamCertification} />
        {/* 쿠폰추가 */}
        <Stack.Screen name="CBAddCoupon" component={CBAddCoupon} />
        <Stack.Screen name="CBHistoryCoupon" component={CBHistoryCoupon} />
        {/* Draw Menus */}
        <Stack.Screen
          name="CBStoreInfoSetting"
          component={CBStoreInfoSetting}
        />
        {/* 영업시간 */}
        <Stack.Screen name="CBTimeSetting" component={CBTimeSetting} />
      </Stack.Navigator>
    );
  };
  useEffect(() => {
    setTimeout(() => {
      setSplash(true);
    }, 2000);
  }, []);

  if (!splash) return <Splash />;

  return (
    <>
      {/* <StatusBar
        translucent
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="##"
        hidden={Platform.OS !== 'ios'}
      /> */}
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            drawerPosition: 'right',
            drawerType: 'front',
            drawerStyle: {
              width: '100%',
              height: Dimensions.get('window').height,
            },
            overlayColor: 'rgba(0,0,0,0.7)',
            gestureEnabled: false,
            swipeEnabled: false,
          }}
          drawerContent={props => <DrawerMenu {...props} />}
        >
          <Drawer.Screen name="Home" component={StackNavigator} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Toast
        config={toastConfig}
        topOffset={10}
        ref={ref => Toast.setRef(ref)}
      />
    </>
  );
};

export default App;
