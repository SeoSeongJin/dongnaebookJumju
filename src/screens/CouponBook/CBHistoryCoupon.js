import { View, Text, TextInput, Pressable, Alert, Image } from "react-native";
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Base, {PrimaryColor} from '../../styles/Base';
import Header from '../../components/Headers/SubHeader';
import {Fonts} from '../../styles/Fonts';
import {useState} from 'react';
import { FlatList, ScrollView } from "react-native-gesture-handler";
import {Shadow} from 'react-native-shadow-2';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {add, format} from "date-fns";
import {ko} from "date-fns/locale";
import Api from '../../Api';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import cusToast from '../../components/CusToast';
import BaseStyle from "../../styles/Base";
import colors from "../../styles/colors";
import CBTicket from "./components/CBTicket";

const CBHistoryCoupon = ({navigation, route}) => {
  const userState = useSelector(state => state.login);
  const isEdit = route.params?.isEdit;
  console.log('userState', userState);

  const [cpDetail, setCpDetail] = useState([]);
  const [cpTxtList, setCpTxtList] = useState([]);

  const _getCpnOriginData = () => {
    const data = {
      jumju_id: userState?.mt_id,
      jumju_code: userState?.mt_jumju_code,
      cp_no: route.params?.editEle?.cp_no,
    };
    console.log('DATA :::', data);
    Api.send('lifestyle_coupon_view', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('lifestyle_coupon_view ::', arrItems);
      if (resultItem.result === 'Y') {
        setCpDetail(arrItems);
        setCpTxtList(arrItems.cp_detail_txt);
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      _getCpnOriginData();
    }
  }, []);

  const renderItem = ({ item }) => {
    console.log(item.coupon_count)
    return (
      <Shadow
        distance={5}
        offset={[0, 2]}
        style={{width: '100%'}}
        containerStyle={{
          marginTop: 14,
          marginHorizontal: 14,
        }}>
        <Pressable
          onPress={() => {
          }}
          style={{
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 10,
            height: 75,
            marginBottom: 15,
            paddingVertical: 10,
            paddingHorizontal: 5,
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.fontColor2,
                fontFamily: Fonts.NotoSansB,
              }}>
              {item?.coupon_txt}
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: 60,
              backgroundColor: PrimaryColor,
              alignSelf: 'center',
              marginRight: 8,
            }}
          />
          <Pressable
            onPress={() => {
            }}
            style={{width: '40%', justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.NotoSansM,
                lineHeight: 20,
                fontSize: 16,
                color: PrimaryColor,
              }}>
              {item?.coupon_count}
            </Text>
          </Pressable>
        </Pressable>
      </Shadow>
    );
  };

  return (
    <SafeAreaView style={{...Base.safeArea}}>
      {/* <CBHeader navigation={navigation} title="쿠폰추가" /> */}
      <Header
        navigation={navigation}
        title={'쿠폰 내역'}
      />
      <View style={{flex: 1, backgroundColor: 'white', paddingTop: 20}}>
        <Shadow
          style={{width: '100%', borderRadius: 10, overflow: 'hidden'}}
          containerStyle={{
            marginHorizontal: 14,
            marginBottom: 20,
            borderRadius: 10,
          }}
          distance={4}
          offset={[0, 2]}>
          <View
            style={{
              backgroundColor: PrimaryColor,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: Fonts.NotoSansM, color: 'white', fontSize: 17
            }}>
            <Text
              style={{fontFamily: Fonts.NotoSansM, color: 'white', fontSize: 20, lineHeight:30}}>
              {cpDetail.cp_subject}
            </Text>
            <Text
              style={{fontFamily: Fonts.NotoSansM, color: 'white', fontSize: 17, lineHeight:30}}>
              {cpDetail.cp_id}
            </Text>
          </View>
        </Shadow>
        <FlatList
          data={cpTxtList}
          keyExtractor={(item, index) => index}
          renderItem={item => renderItem(item)}
          onEndReachedThreshold={1}
          onEndReached={() => {
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CBHistoryCoupon;
