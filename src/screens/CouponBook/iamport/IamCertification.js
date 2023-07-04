import React from 'react';
import IMP from 'iamport-react-native';
import axios from 'axios';

import {IAM_API_KEY, IAM_SECRET} from '@env';
import {SafeAreaView} from 'react-native-safe-area-context';
import Base from '../../../styles/Base';
import {ActivityIndicator, View} from 'react-native';

const IamCertification = ({navigation, route}) => {
  const _router = res => {
    console.log('res ::', res);
    if (res.success === 'false') {
      navigation.goBack();
    }
    // switch (route.params.target) {
    //   case CertificationList.isSign:
    //     return navigation.navigate('SignForm', {res: res});
    //   case CertificationList.isEdit:
    //     return navigation.navigate('EditSummit', {
    //       res: res,
    //       target: EditConfig.target.phone,
    //       addData: route.params?.addData,
    //     });
    //   case CertificationList.isOrder:
    //     return navigation.navigate('WriteOrderForm', {res: res});
    //   default:
    //     Errorhandler(res);
    // }
  };

  const _getIamInfo = async res => {
    try {
      const {imp_uid, merchant_uid} = res;

      const getToken = await axios.post(
        'https://api.iamport.kr/users/getToken',
        {
          imp_key: IAM_API_KEY,
          imp_secret: IAM_SECRET,
        },
        {headers: {'Content-Type': 'application/json'}},
      );

      const {access_token} = getToken.data.response;
      console.log('getToken data', getToken.data);

      const getCertifications = await axios.get(
        `https://api.iamport.kr/certifications/${imp_uid}`,
        {
          headers: {Authorization: access_token},
        },
      );
      const certificationsInfo = getCertifications.data.response; // 조회한 인증 정보

      console.log('certificationsInfo', certificationsInfo);

      //회원가입시, 비밀번호 변경 시, 회원 가입 이후
      navigation.navigate('CBSignIn', {res: res, info: certificationsInfo});
      //   _router(certificationsInfo);
    } catch (e) {
      console.error('Certification', e);
    }
  };

  const data = {
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
    company: '어스닉', // 회사명 또는 URL
    // carrier: 'SKT', // 통신사
    // name: '홍길동', // 이름
    // phone: '01012341234', // 전화번호
  };

  const _callback = res => {
    console.log('res', res);
    if (res.success === 'false') {
      _router(res);
    } else _getIamInfo(res);
    // navigation.navigate('OrderFinish', res);
  };
  const Loading = () => {
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{...Base.safeArea}}>
      <IMP.Certification
        userCode={'imp72538339'}
        loading={<Loading />} // 로딩 컴포넌트
        data={data}
        callback={_callback}
      />
    </SafeAreaView>
  );
};

export default IamCertification;
