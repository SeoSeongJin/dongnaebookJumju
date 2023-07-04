import { View, Text, Pressable, TextInput, Linking } from "react-native";
import React from 'react';
import CBTicket from '../components/CBTicket';
import {PrimaryColor} from '../../../styles/Base';
import {Shadow} from 'react-native-shadow-2';
import {Fonts} from '../../../styles/Fonts';
import {FlatList} from 'react-native-gesture-handler';
import Api from '../../../Api';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';

const CBMainTabFirst = ({navigation}) => {
  const [cpList, setCpList] = useState([]);
  const userInfo = useSelector(state => state.login);
  const isFocused = useIsFocused();
  const [config, setConfig] = React.useState('')

  const renderItem = item => {
    return <CBTicket element={item.item} navigation={navigation} />;
  };

  const _getCBList = (expiry, reset) => {
    const data = {
      item_count: reset ? 0 : cpList.length,
      limit_count: 10,
      jumju_id: userInfo.mt_id,
      jumju_code: userInfo.mt_jumju_code,
      expiry: expiry,
    };
    console.log('_getCBList', data);
    console.log('LENGHT :::', cpList.length);

    Api.send('lifestyle_coupon_list', data, args => {
      const arrItems = args.arrItems;
      const resultItem = args.resultItem;
      console.log('res', resultItem);
      console.log('arrItems', arrItems);
      if (resultItem.result === 'Y') {
        setCpList(arrItems);
      } else {
        setCpList([]);
      }
    });
  };

  const _getCBListMore = expiry => {
    const data = {
      item_count: cpList.length,
      limit_count: 10,
      jumju_id: userInfo.mt_id,
      jumju_code: userInfo.mt_jumju_code,
      expiry: expiry,
    };
    Api.send('lifestyle_coupon_list', data, args => {
      const arrItems = args.arrItems;
      const resultItem = args.resultItem;
      console.log('res', resultItem);
      console.log('arrItems', arrItems);
      if (resultItem.result === 'Y') {
        setCpList(prev => prev.concat(arrItems));
      }
    });
  };
  useEffect(() => {
    if (isFocused) _getCBList('N', true);
    // _getCBList('N', true);
  }, [isFocused]);

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
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: 20}}>
      <View style={{flexDirection: 'row', marginHorizontal: 14, height: 70}}>
        <View style={{
          flex: 0.7,
          marginRight: 5,
        }}>
          <Shadow
            style={{width: '100%', borderRadius: 10, overflow: 'hidden'}}
            containerStyle={{
              marginBottom: 20,
              borderRadius: 10,
            }}
            distance={4}
            offset={[0, 2]}>
          <Pressable
            onPress={() => {
              navigation.navigate('CBAddCoupon');
            }}
            style={{
              backgroundColor: PrimaryColor,
              height: 55,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{fontFamily: Fonts.NotoSansM, color: 'white', lineHeight:22, fontSize: 16}}>
              쿠폰 추가하기 +
            </Text>
          </Pressable>
          </Shadow>
        </View>

        <View style={{
          flex: 0.3,
          marginleft: 5,
        }}>
          <Shadow
            style={{width: '100%', borderRadius: 10, overflow: 'hidden'}}
            containerStyle={{
              marginBottom: 20,
              borderRadius: 10,
            }}
            distance={4}
            offset={[0, 2]}>
          <Pressable
            onPress={() => {
                Linking.openURL(config.cf_link1);
            }}
            style={{
              backgroundColor: PrimaryColor,
              height: 55,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{fontFamily: Fonts.NotoSansM, color: 'white', lineHeight:22, fontSize: 16}}>
              광고문의 +
            </Text>
          </Pressable>
          </Shadow>
        </View>

      </View>


      <FlatList
        data={cpList}
        keyExtractor={(item, index) => index}
        renderItem={item => renderItem(item)}
        onEndReachedThreshold={1}
        onEndReached={() => {
          _getCBListMore('N');
        }}
      />

    </View>
  );
};

export default CBMainTabFirst;
