import {View, Text, Pressable, ScrollView, Alert, Platform} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Base, {PrimaryColor} from '../../styles/Base';
import CBHeader from './components/CBHeader';
import {Fonts} from '../../styles/Fonts';
import {TextInput} from 'react-native-gesture-handler';
import {useEffect} from 'react';
import axios from 'axios';
import Api from '../../Api';
import {useSelector} from 'react-redux';
import cusToast from '../../components/CusToast';
import {useTrack} from '@hackler/react-native-sdk';

const CBSignIn = ({navigation, route}) => {
  const track = useTrack();
  const [idChecked, setIdChecked] = React.useState(false); // 아이디 중복 체크

  const [form, setForm] = useState({
    name: '',
    id: '',
    pw: '',
    pw_re: '',
    hp: '',
    recommender: '',
  });
  const params = route.params;
  console.log('route res::', route.params);
  const _checkForm = () => {};

  const _checkId = () => {
    const blank_pattern = /[\s]/g;
    const regExpHan = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;

    if (!form.id) {
      return Alert.alert('회원가입', '아이디를 입력해주세요');
    }

    if (blank_pattern.test(form.id) == true) {
      return Alert.alert('회원가입', '회원 아이디에 공백이 입력되었습니다.');
    }

    if (regExpHan.test(form.id) == true) {
      return Alert.alert('회원가입', '회원 아이디에 한글이 입력되었습니다.');
    }

    const params = {
      mt_id: form.id,
    };

    Api.send('member_id_chk', params, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('args', args);
      if (resultItem.result === 'Y') {
        setIdChecked(true);
        cusToast('사용 가능한 아이디입니다.', 1500);
      } else {
        form.id = '';
        setForm(prev => ({...prev, id: ''}));
        Alert.alert('회원가입', resultItem.message);
      }
    });
  };

  const _onPress = async () => {
    const blank_pattern = /[\s]/g;
    const regExpHan = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;

    if (idChecked == false) {
      return Alert.alert('회원가입', '아이디 중복확인을 해주세요.');
    }

    if (blank_pattern.test(form.name) == true) {
      return Alert.alert('회원가입', '회원 이름에 공백이 입력되었습니다.');
    }

    if (blank_pattern.test(form.id) == true) {
      return Alert.alert('회원가입', '회원 아이디에 공백이 입력되었습니다.');
    }

    if (regExpHan.test(form.id) == true) {
      return Alert.alert('회원가입', '회원 아이디에 한글이 입력되었습니다.');
    }

    if (blank_pattern.test(form.pw) == true) {
      return Alert.alert('회원가입', '비빌번호에 공백이 입력되었습니다.');
    }

    if (!form.id || !form.name || !form.pw || !form.pw_re || !form.hp) {
      return Alert.alert('회원가입', '모든 정보를 입력해주세요');
    }

    if (form.pw !== form.pw_re) {
      return Alert.alert('회원가입', '비밀번호를 확인해주세요');
    }

    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;

    const params = {
      mt_id: form.id,
      mt_pwd: form.pw,
      mt_pwd_re: form.pw_re,
      mt_name: form.name,
      mt_hp: form.hp,
      mt_recommender: form.recommender,
      mt_app_token: mtAppToken,
      mt_visit_device: Platform.OS,
    };

    const event = {
      key: 'sign_up',
      properties: {
        id: form.id,
        date: dateString,
        name: form.name,
        number: form.hp,
      },
    };
    console.log('hackle event =====>', event);
    Api.send('jumju_join', params, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('args', args);
      if (resultItem.result === 'Y') {
        track(event);
        cusToast('회원가입이 완료되었습니다. 메인화면으로 이동합니다.', 1500);
        navigation.navigate('Login');
      } else {
        Alert.alert('회원가입', resultItem.message);
      }
    });
  };
  const {mt_app_token: mtAppToken} = useSelector(state => state.login);
  useEffect(() => {
    console.log('## FORM', form);
  }, [form]);

  useEffect(() => {
    if (params?.info?.phone)
      setForm(prev => ({...prev, hp: params?.info?.phone}));
  }, [route.params]);

  const validateText = val => {
    return val.replace(/[`!@#$%^*():|?<>\{\}\[\]\\\/]/gi, '');
  };

  return (
    <SafeAreaView style={{...Base.safeArea}}>
      <CBHeader navigation={navigation} title={'회원가입'} />
      <ScrollView>
        <View style={{paddingHorizontal: 20, paddingTop: 20}}>
          <Text style={{fontFamily: Fonts.NotoSansB}}>이름</Text>
          <TextInput
            autoCapitalize="none"
            value={form.name}
            onChangeText={str => setForm(prev => ({...prev, name: str}))}
            style={{
              height: 50,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
          />
          <Text style={{fontFamily: Fonts.NotoSansB, paddingTop: 8}}>
            아이디
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 8}}>
            <TextInput
              autoCapitalize="none"
              value={form.id}
              onChangeText={str => setForm(prev => ({...prev, id: str}))}
              style={{
                height: 50,
                flex: 1,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#E3E3E3',
                paddingHorizontal: 10,
              }}
              placeholder={''}
            />
            <Pressable
              style={{
                marginLeft: 10,
                width: 90,
                height: 50,
                borderWidth: 1,
                borderColor: PrimaryColor,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => {
                _checkId();
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NotoSansR,
                  fontSize: 16,
                  ...Base.font_666,
                }}>
                중복 확인
              </Text>
            </Pressable>
          </View>
          <Text style={{fontFamily: Fonts.NotoSansB, paddingTop: 8}}>
            비밀번호
          </Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str => setForm(prev => ({...prev, pw: str}))}
            secureTextEntry
            style={{
              height: 50,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
          />

          <Text style={{fontFamily: Fonts.NotoSansB, paddingTop: 8}}>
            비밀번호 재입력
          </Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str => setForm(prev => ({...prev, pw_re: str}))}
            secureTextEntry
            style={{
              height: 50,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
          />

          <Text style={{fontFamily: Fonts.NotoSansB, paddingTop: 8}}>
            핸드폰번호
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 8}}>
            <TextInput
              autoCapitalize="none"
              keyboardType="phone-pad"
              onChangeText={str => setForm(prev => ({...prev, hp: str}))}
              style={{
                height: 50,
                flex: 1,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#E3E3E3',
                paddingHorizontal: 10,
              }}
              value={form.hp}
              editable={false}
              placeholder={'본인인증이 필요합니다.'}
            />
            <Pressable
              style={{
                marginLeft: 10,
                width: 90,
                height: 50,
                borderWidth: 1,
                borderColor: PrimaryColor,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => {
                navigation.navigate('IamCertification');
              }}>
              <Text
                style={{
                  fontFamily: Fonts.NotoSansR,
                  fontSize: 16,
                  ...Base.font_666,
                }}>
                본인 인증
              </Text>
            </Pressable>
          </View>

          <Text style={{fontFamily: Fonts.NotoSansB, paddingTop: 8}}>
            추천인코드
          </Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={str => setForm(prev => ({...prev, recommender: str}))}
            style={{
              height: 50,
              marginVertical: 10,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#E3E3E3',
              paddingHorizontal: 10,
            }}
          />

          <Pressable
            onPress={() => {
              _onPress();
            }}
            style={{
              marginTop: 30,
              width: '100%',
              height: 50,
              borderRadius: 10,
              backgroundColor: PrimaryColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.NotoSansM,
                color: 'white',
                fontSize: 18,
              }}>
              회원가입
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CBSignIn;
