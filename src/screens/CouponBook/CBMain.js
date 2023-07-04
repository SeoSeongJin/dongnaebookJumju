import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import React from 'react';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Primary, PrimaryColor} from '../../styles/Base';
import CBMainTabFirst from './cbmainTabs/CBMainTabFirst';
import CBMainTabSecond from './cbmainTabs/CBMainTabSecond';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import Api from '../../Api';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Shadow} from 'react-native-shadow-2';
import CBTicket from './components/CBTicket';
import {Fonts} from '../../styles/Fonts';

const CBMain = ({navigation}) => {
  const userInfo = useSelector(state => state.login);

  useEffect(() => {
    if (!userInfo.mt_store) {
      Alert.alert(
        '매장등록',
        '등록된 매장이 없습니다. 매장등록화면으로 이동합니다',
        [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('CBStoreInfoSetting');
            },
          },
        ],
      );
    }
  }, []);

  const FirstRoute = () => <CBMainTabFirst navigation={navigation} />;
  const SecondRoute = () => <CBMainTabSecond navigation={navigation} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: '발행중'},
    {key: 'second', title: '기간만료'},
  ]);
  const renderTabBar = props => (
    <TabBar
      {...props}
      getTestID={({route}) => route.testID}
      getAccessibilityLabel={({route}) => route.accessibilityLabel}
      activeColor={PrimaryColor}
      inactiveColor="#222"
      indicatorStyle={{backgroundColor: PrimaryColor}}
      style={{backgroundColor: 'white'}}
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{width: layout.width}}
    />
  );
};

export default CBMain;
