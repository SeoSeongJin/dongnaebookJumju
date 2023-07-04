import React, { useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseStyle from '../styles/Base';
import {DrawerMenus, DrawerMenusCB} from '../data/drawerMenus';
import cusToast from '../components/CusToast';
import Divider from '../components/Divider';
import {useSelector} from 'react-redux';
import Api from "../Api";

const DrawerMenu = props => {
  const userInfo = useSelector(state => state.login);
  const {navigation} = props;

  const [config, setConfig] = React.useState('')

  // 로그아웃
  const onLogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('@dongnaebookownerUser');
      cusToast('로그아웃 하였습니다.');
      navigation.navigate('Home', {screen: 'Login'});
    } catch (err) {
      cusToast(`로그아웃 중 에러가 발생하였습니다.\n오류:${err}`, 2500);
    }
  };


  /*
  Api.send('site_config', param,args => {
    const resultItem = args.resultItem;
    const arrItems = args.arrItems;
    if (resultItem.result === 'Y') {
      setConfig(arrItems);
    }
  })
*/

  //광고문의 외부 URL
  const _configInfo = () => {
    const data = {}
    Api.send('site_config', data,args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        setConfig(arrItems);
      }
    })
  };

  useEffect(() => {
    _configInfo();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          height:
            Platform.OS === 'ios' ? Dimensions.get('window').height : '100%',
          backgroundColor: '#fff',
          borderTopLeftRadius: 50,
        }}>
        <View
          style={{
            position: 'relative',
            ...BaseStyle.container0,
            ...BaseStyle.pv10,
            height: Platform.OS === 'ios' ? 55 : 60,
          }}>
          <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold}}>설정</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.closeDrawer()}
            style={{position: 'absolute', right: 20, top: 20}}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Image
              source={require('../images/pop_close_bk.png')}
              style={{width: 22, height: 22}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Divider backgroundColor="#E3E3E3" />

        <ScrollView
          testID="drawerMenuScrollView"
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View
            style={{
              ...BaseStyle.mv5,
              marginBottom: Platform.OS === 'ios' ? 60 : 0,
            }}>
            {userInfo.mt_order_type === 'Y'
              ? DrawerMenus.map((menu, index) => (
                  <TouchableOpacity
                    testID={menu.route ? menu.route : 'logout'}
                    key={`${menu.name}-${index}`}
                    activeOpacity={1}
                    onPress={() => {
                      if (menu.name === '로그아웃') {
                        onLogoutHandler();
                      } else if (menu.name === '광고문의') {
                        Linking.openURL(config.cf_link1);
                      } else {
                        navigation.navigate('Home', {screen: menu.route});
                      }
                    }}
                    style={{
                      ...BaseStyle.container5,
                      ...BaseStyle.ph20,
                      ...BaseStyle.pv13,
                      borderBottomColor: '#f1f1f1',
                      borderBottomWidth:
                        index !== DrawerMenus.length - 1 ? 1 : 0,
                    }}>
                    <View style={{...BaseStyle.container}}>
                      <Image
                        source={menu.icon}
                        style={{width: 30, height: 30, ...BaseStyle.mr10}}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          ...BaseStyle.ko15,
                          ...BaseStyle.lh20,
                          ...BaseStyle.font_bold,
                        }}>
                        {menu.name}
                      </Text>
                    </View>
                    <Image
                      source={require('../images/set_arrow.png')}
                      style={{width: 30, height: 12}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))
              : DrawerMenusCB.map((menu, index) => (
                  <TouchableOpacity
                    testID={menu.route ? menu.route : 'logout'}
                    key={`${menu.name}-${index}`}
                    activeOpacity={1}
                    onPress={() => {
                      if (menu.name === '로그아웃') {
                        onLogoutHandler();
                      } else if (menu.name === '광고문의') {
                        Linking.openURL(config.cf_link1);
                      } else {
                        navigation.navigate('Home', {screen: menu.route});
                      }
                    }}
                    style={{
                      ...BaseStyle.container5,
                      ...BaseStyle.ph20,
                      ...BaseStyle.pv13,
                      borderBottomColor: '#f1f1f1',
                      borderBottomWidth:
                        index !== DrawerMenus.length - 1 ? 1 : 0,
                    }}>
                    <View style={{...BaseStyle.container}}>
                      <Image
                        source={menu.icon}
                        style={{width: 30, height: 30, ...BaseStyle.mr10}}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          ...BaseStyle.ko15,
                          ...BaseStyle.lh20,
                          ...BaseStyle.font_bold,
                        }}>
                        {menu.name}
                      </Text>
                    </View>
                    <Image
                      source={require('../images/set_arrow.png')}
                      style={{width: 30, height: 12}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DrawerMenu;
