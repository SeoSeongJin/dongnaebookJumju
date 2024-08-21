import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import {PrimaryColor} from '../../../styles/Base';
import colors from '../../../styles/colors';
import {Shadow} from 'react-native-shadow-2';
import {Fonts} from '../../../styles/Fonts';
import {useTrack} from '@hackler/react-native-sdk';

const CBTicket = ({element, elementIdx, navigation}) => {
  const track = useTrack();
  return (
    <Shadow
      distance={5}
      offset={[0, 2]}
      style={{width: '100%'}}
      containerStyle={{
        marginTop: elementIdx === 0 ? 14 : 0,
        marginHorizontal: 14,
      }}>
      <Pressable
        onPress={() => {
          navigation.navigate('CBHistoryCoupon', {
            isEdit: true,
            editEle: element,
          });
        }}
        style={{
          borderWidth: 1,
          borderColor: colors.primary,
          borderRadius: 10,
          height: 90,
          marginBottom: 15,
          paddingVertical: 10,
          paddingHorizontal: 5,
          flexDirection: 'row',
          backgroundColor: 'white',
        }}>
        <Image
          source={
            element?.store_logo
              ? {uri: element?.store_logo}
              : require('../../../images/no_img.png')
          }
          style={{height: 70, width: 70}}
          resizeMode="cover"
        />
        <View
          style={{
            flex: 1,
            marginTop: 3,
            marginLeft: 3,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: colors.fontColor3,
                flex: 1,
                fontFamily: Fonts.NotoSansM,
              }}
              numberOfLines={1}>
              {element?.store_name}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.NotoSansR,
                color: colors.fontColorA,
                fontSize: 11,
                lineHeight: 12,
                marginRight: 8,
              }}>
              {element?.cp_end_txt}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 20,
              color: colors.fontColor2,
              fontFamily: Fonts.NotoSansB,
            }}
            numberOfLines={2}>
            {element?.cp_subject}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                lineHeight: 16,
                color: colors.fontColorA2,
                fontFamily: Fonts.NotoSansB,
              }}
              numberOfLines={1}>
              {element?.cp_memo}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: PrimaryColor,
                fontFamily: Fonts.NotoSansB,
                marginRight: 8,
                lineHeight: 12,
              }}
              numberOfLines={2}>
              남은 쿠폰: {element?.cp_coupon_remaining}
            </Text>
          </View>
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
            const event = {
              key: 'click_coupon_edit',
            };
            track(event);
            navigation.navigate('CBAddCoupon', {
              isEdit: true,
              editEle: element,
            });
          }}
          style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
          {/* <Image
            source={require('../../../images/down_coupon.png')}
            style={{width: 45, height: 45}}
            // resizeMode="contain"
          /> */}
          <Text
            style={{
              fontFamily: Fonts.NotoSansM,
              lineHeight: 20,
              fontSize: 16,
              color: PrimaryColor,
            }}>
            {'쿠폰\n수정'}
          </Text>
        </Pressable>
      </Pressable>
    </Shadow>
  );
};

export default CBTicket;
