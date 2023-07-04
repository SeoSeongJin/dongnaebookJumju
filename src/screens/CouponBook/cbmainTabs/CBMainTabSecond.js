import {View, Text, Pressable} from 'react-native';
import React from 'react';
import CBTicket from '../components/CBTicket';
import {FlatList} from 'react-native-gesture-handler';
import {useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import Api from '../../../Api';
import {useIsFocused} from '@react-navigation/native';

const CBMainTabSecond = ({navigation, couponList}) => {
  const [cpExpiredList, setCpExpiredList] = useState([]);
  const userInfo = useSelector(state => state.login);
  const isFocused = useIsFocused();

  const renderItem = item => {
    return <CBTicket element={item.item} navigation={navigation} />;
  };

  const _getCBList = (expiry, reset) => {
    const data = {
      item_count: reset ? 0 : cpExpiredList.length,
      limit_count: 10,
      jumju_id: userInfo.mt_id,
      jumju_code: userInfo.mt_jumju_code,
      expiry: expiry,
    };
    console.log('_getCBList', data);
    console.log('LENGHT :::', cpExpiredList.length);
    Api.send('lifestyle_coupon_list', data, args => {
      const arrItems = args.arrItems;
      const resultItem = args.resultItem;
      console.log('res', resultItem);
      console.log('arrItems', arrItems);
      if (resultItem.result === 'Y') {
        setCpExpiredList(arrItems);
      }
    });
  };

  const _getCBListMore = expiry => {
    const data = {
      item_count: cpExpiredList.length,
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
        setCpExpiredList(prev => [...prev, ...arrItems]);
      }
    });
  };

  useEffect(() => {
    if (isFocused) _getCBList('Y', true);
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: 'white', paddingTop: 20}}>
      <FlatList
        data={cpExpiredList}
        keyExtractor={(item, index) => item + index}
        renderItem={item => renderItem(item)}
        onEndReachedThreshold={1}
        onEndReached={() => {
          _getCBListMore('Y');
        }}
      />
    </View>
  );
};

export default CBMainTabSecond;
