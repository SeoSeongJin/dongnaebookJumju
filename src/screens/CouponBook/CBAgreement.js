import {View, Text, ScrollView, Image, Pressable, Alert} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
// import commonStyles from '../../styles/commonStyle';
// import Header from '../../component/Header';
import colors from '../../styles/colors';
import policyConfig from './policyConfig';
import CBHeader from './components/CBHeader';

const CBAgreement = ({navigation}) => {
  const [policy, setPolicy] = useState({
    checkAll: false,
    checkUse: false,
    checkPersonal: false,
    checkLocation: false,
  });

  const _setPolicy = prop => {
    setPolicy(prev => {
      let temp = {...prev};
      if (prop === 'checkAll') {
        let arr = Object.keys(policy);

        for (let i = 0; i < Object.keys(policy).length; i++) {
          temp[arr[i]] = !policy.checkAll;
        }

        return temp;
      } else {
        temp[prop] = !prev[prop];
        return temp;
      }
    });
  };

  const PolicyDetail = ({target}) => {
    return (
      <Pressable
        hitSlop={5}
        onPress={() => {
          navigation.navigate('Policy', {
            target: target,
          });
        }}
        style={{marginLeft: 'auto'}}>
        <Text style={{color: colors.fontColorA}}>자세히</Text>
      </Pressable>
    );
  };

  const _vaildation = () => {
    if (!policy.checkLocation || !policy.checkPersonal || !policy.checkUse)
      Alert.alert('약관 동의 필요', '필수 약관에 동의하셔야 합니다.', [
        {text: '확인'},
      ]);
    else navigation.navigate('CBSignIn');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Header title={'회원가입'} navigation={navigation} /> */}
      <CBHeader title={'약관동의'} navigation={navigation} />

      <ScrollView>
        <View style={{paddingHorizontal: 22, paddingTop: 50}}>
          <Text style={{color: colors.fontColor2, fontSize: 20}}>
            서비스 이용을 위해
          </Text>
          <Text style={{color: colors.fontColor2, fontSize: 20}}>
            약관에 동의해 주세요.
          </Text>

          <View style={{marginTop: 30}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkAll');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkAll
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text>전체 약관에 동의합니다.</Text>
            </Pressable>
          </View>

          <View style={{marginTop: 20}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkUse');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkUse
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text>이용약관 (필수)</Text>
              <PolicyDetail target={policyConfig.target.use} />
            </Pressable>
          </View>

          <View style={{marginTop: 20}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkPersonal');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkPersonal
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text>개인정보 처리방침 (필수)</Text>
              <PolicyDetail target={policyConfig.target.personal} />
            </Pressable>
          </View>

          <View style={{marginTop: 20}}>
            <Pressable
              hitSlop={10}
              onPress={() => {
                _setPolicy('checkLocation');
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  policy.checkLocation
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text>위치기반서비스 약관 (필수)</Text>
              <PolicyDetail target={policyConfig.target.location} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              _vaildation();
            }}
            style={{marginTop: 80}}>
            <View
              style={{
                height: 50,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text style={{color: 'white'}}>다음</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CBAgreement;
