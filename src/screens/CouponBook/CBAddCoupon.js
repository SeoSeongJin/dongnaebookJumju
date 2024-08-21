import {View, Text, TextInput, Pressable, Alert} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Base, {PrimaryColor} from '../../styles/Base';
import Header from '../../components/Headers/SubHeader';
import {Fonts} from '../../styles/Fonts';
import {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Shadow} from 'react-native-shadow-2';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {add, format} from 'date-fns';
import {ko} from 'date-fns/locale';
import Api from '../../Api';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import cusToast from '../../components/CusToast';
import {useTrack} from '@hackler/react-native-sdk';

const CBAddCoupon = ({navigation, route}) => {
  const track = useTrack();
  const userState = useSelector(state => state.login);
  const isEdit = route.params?.isEdit;
  console.log('userState', userState);

  const today = format(new Date(), 'yyyy-MM-dd');
  const newDateFnsDate = format(add(new Date(), {days: 360}), 'yyyy-MM-dd');

  const [form, setForm] = useState({
    jumju_id: userState.mt_id,
    jumju_code: userState.mt_jumju_code,
    cp_subject: '',
    cp_start: today,
    cp_end: newDateFnsDate,
    cp_period: '',
    cp_memo: '',
    cp_coupon_number: '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    visible: false,
    target: 'start',
  });

  // const _numChecker = (str, target) => {
  //   // str.replace(/[^0-9]/g, ''),
  //   console.log(str.replace(/[^0-9]/g, ''));
  //   // setForm(prev => ({...prev, cp_start: str.replace(/[^0-9]/g, '')}));
  // };

  const showDatePicker = target => {
    setDatePickerVisibility({visible: true, target: target});
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(prev => ({...prev, visible: false}));
  };

  const handleConfirm = date => {
    if (isDatePickerVisible.target === 'start')
      setForm(prev => ({...prev, cp_start: moment(date).format('YYYY-MM-DD')}));
    else
      setForm(prev => ({...prev, cp_end: moment(date).format('YYYY-MM-DD')}));
    // console.log('A date has been picked: ', date);
    // console.log('A date has been picked: ', ;
    hideDatePicker();
  };

  const _onPress = () => {
    console.log('form ::', form);
    let data;

    if (
      !form.cp_coupon_number ||
      !form.cp_end ||
      !form.cp_start ||
      !form.cp_memo ||
      !form.cp_period ||
      !form.cp_subject
    ) {
      return Alert.alert('알림', '모든 정보를 입력해주세요.');
    }

    if (form.cp_coupon_number < 1) {
      return Alert.alert('알림', '발행 건수는 1이상 입력해주세요');
    }

    if (isEdit) {
      data = {
        ...form,
        cp_no: route.params.editEle.cp_no,
      };
    } else {
      data = {...form};
    }

    //hackle event
    const event = {
      key: 'complete_add_coupon',
      properties: {
        title: form.cp_subject,
      },
    };

    console.log('data', data);
    if (!isEdit) {
      Api.send('lifestyle_coupon_input', data, args => {
        const resultItem = args.resultItem;
        const arrItems = args.arrItems;
        console.log('args', args);
        if (resultItem.result === 'Y') {
          track(event);
          navigation.navigate('Main');
        } else {
          Alert.alert('쿠폰추가', resultItem.message);
        }
      });
    } else {
      Api.send('lifestyle_coupon_update', data, args => {
        const resultItem = args.resultItem;
        const arrItems = args.arrItems;
        console.log('args edit', args);
        if (resultItem.result === 'Y') {
          navigation.navigate('Main');
          cusToast(
            '쿠폰 수정이 완료되었습니다. 메인페이지로 이동합니다.',
            1500,
          );
        } else {
          Alert.alert('쿠폰수정', resultItem.message);
        }
      });
    }
  };

  const _onPressCancle = () => {
    const data = {
      jumju_id: userState?.mt_id,
      jumju_code: userState?.mt_jumju_code,
      cp_no: route.params?.editEle?.cp_no,
    };
    Api.send('lifestyle_coupon_delete', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        navigation.navigate('Main');
        cusToast('쿠폰이 삭제되었습니다. 메인화면으로 이동합니다.', 1500);
      }
      console.log('res', resultItem);
      console.log('arr', arrItems);
    });
  };

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
        setForm({
          jumju_id: userState.mt_id,
          jumju_code: userState.mt_jumju_code,
          cp_subject: arrItems.cp_subject,
          cp_start: arrItems.cp_start,
          cp_end: arrItems.cp_end,
          cp_period: arrItems.cp_period,
          cp_memo: arrItems.cp_memo,
          cp_coupon_number: String(arrItems.cp_coupon_number),
        });
      }
    });
  };

  useEffect(() => {
    if (isEdit) {
      _getCpnOriginData();
    }
  }, []);

  return (
    <SafeAreaView style={{...Base.safeArea}}>
      {/* <CBHeader navigation={navigation} title="쿠폰추가" /> */}
      <Header
        navigation={navigation}
        title={isEdit ? '쿠폰 수정' : '쿠폰 추가'}
      />
      <View style={{marginHorizontal: 20, marginTop: 25, flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{fontFamily: Fonts.NotoSansB}}>쿠폰명</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str => setForm(prev => ({...prev, cp_subject: str}))}
            value={form.cp_subject}
            maxLength={20}
            style={{
              height: 50,
              marginBottom: 20,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
            placeholder={'쿠폰명 입력'}
          />

          <Text style={{fontFamily: Fonts.NotoSansB}}>쿠폰 상세 조건</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str => setForm(prev => ({...prev, cp_memo: str}))}
            value={form.cp_memo}
            style={{
              height: 50,
              marginBottom: 20,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
            placeholder={'쿠폰 상세 조건 입력'}
          />

          <Text style={{fontFamily: Fonts.NotoSansB}}>발행 건수 제한</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str =>
              setForm(prev => ({...prev, cp_coupon_number: str}))
            }
            value={form.cp_coupon_number}
            style={{
              height: 50,
              marginBottom: 20,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
            placeholder={'최대 999개'}
            maxLength={3}
            keyboardType={'numeric'}
          />

          <Text style={{fontFamily: Fonts.NotoSansB}}>다운로드 유효 기간</Text>
          <Pressable
            onPress={() => {
              showDatePicker('start');
            }}
            style={{
              height: 50,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}>
            <Text style={{color: form?.cp_start ? undefined : undefined}}>
              {form?.cp_start ? form?.cp_start : today}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              showDatePicker('end');
            }}
            style={{
              height: 50,
              marginTop: 10,
              marginBottom: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}>
            <Text style={{color: form?.cp_end ? undefined : undefined}}>
              {form?.cp_end ? form?.cp_end : newDateFnsDate}
            </Text>
          </Pressable>
          <Text style={{fontFamily: Fonts.NotoSansB}}>
            쿠폰함에서 쿠폰 유지기간
          </Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str =>
              setForm(prev => ({
                ...prev,
                cp_period: str.replace(/[^0-9]/g, ''),
              }))
            }
            maxLength={3}
            value={form.cp_period}
            keyboardType="numeric"
            style={{
              height: 50,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
            placeholder="유지기간 입력"
          />
          {isEdit && (
            <Pressable
              onPress={() => {
                Alert.alert('쿠폰 삭제', '쿠폰을 삭제하시겠습니까?', [
                  {
                    text: '확인',
                    onPress: () => {
                      _onPressCancle();
                    },
                  },
                  {
                    text: '취소',
                    onPress: () => {},
                  },
                ]);
              }}
              style={{alignSelf: 'flex-end', marginTop: 10}}>
              <Text
                style={{
                  fontSize: 13,
                  borderBottomWidth: 1,
                  color: '#C7C7CD',
                  borderColor: '#C7C7CD',
                }}>
                쿠폰 삭제
              </Text>
            </Pressable>
          )}

          <Shadow
            style={{width: '100%', borderRadius: 10, overflow: 'hidden'}}
            containerStyle={{
              marginTop: isEdit ? 20 : 40,
              marginBottom: 40,
            }}
            distance={4}
            offset={[0, 2]}>
            <Pressable
              onPress={() => {
                _onPress();
                // navigation.navigate('CBAddCoupon');
              }}
              style={{
                backgroundColor: PrimaryColor,
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NotoSansM,
                  color: 'white',
                  fontSize: 17,
                }}>
                {isEdit ? '쿠폰 수정' : '쿠폰 추가'}
              </Text>
            </Pressable>
          </Shadow>
        </ScrollView>
        <DateTimePickerModal
          isVisible={isDatePickerVisible.visible}
          minimumDate={new Date()}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        {/* <DateTimePickerModal
          isVisible={show}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          cancelTextIOS="취소"
          confirmTextIOS="적용"
          pickerStyleIOS={{backgroundColor: 'white'}}
          customHeaderIOS={() => (
            <View
              style={{
                ...BaseStyle.pv15,
                backgroundColor: Primary.PointColor01,
                ...BaseStyle.container0,
              }}>
              <Text
                style={{
                  ...BaseStyle.ko18,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.font_white,
                }}>
                {dateType === 'start' ? '시작날짜' : '종료날짜'}
              </Text>
            </View>
          )}
          buttonTextColorIOS={Primary.PointColor01}
          locale="ko_KR"
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default CBAddCoupon;
