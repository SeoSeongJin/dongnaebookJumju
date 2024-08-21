import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  BackHandler,
  Platform,
  Pressable,
  Modal as RNMdal,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import Header from '../../../components/Headers/SubHeader';
import BaseStyle, {Primary} from '../../../styles/Base';
import Api from '../../../Api';
import AnimateLoading from '../../../components/Loading/AnimateLoading';
// import {pickGalleryImage, takeCamera} from '../../modules/imagePickerOrCamera';
import cusToast from '../../../components/CusToast';
import {
  pickGalleryImage,
  takeCamera,
} from '../../../modules/imagePickerOrCamera';
import {useState} from 'react';
import Postcode from '@actbase/react-daum-postcode';
import {FlatList} from 'react-native-gesture-handler';
import {useEffect} from 'react';
import {template} from '@babel/core';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTrack} from '@hackler/react-native-sdk';

const MAIN_IMAGE_THUMB_WIDTH = (Dimensions.get('window').width - 40) / 5 - 4;

const CBStoreInfoSetting = props => {
  const track = useTrack();
  const {navigation} = props;
  const userState = useSelector(state => state.login);
  console.log('userState', userState);

  const [info, setInfo] = React.useState({
    mb_ca_code: '',
    mb_company: '',
    mb_homepage: '',
    mb_icon: '',
    mb_icon_del: '0',
    mb_tel: '',
    // mb_fax: '',
    mb_biz_no: '',
    mb_eobtae: '',
    mb_jongmog: '',
    mb_zip: '',
    mb_addr1: '',
    mb_addr2: '',
    mb_addr3: '',
    mb_addr_jibeon: '',
    mb_memo: '',
    mb_recommender: '',
    mb_hash_tag: '',
    rt_img1: '',
    rt_img2: '',
    rt_img3: '',
    rt_img4: '',
    rt_img5: '',
    rt_img_del1: '0',
    rt_img_del2: '0',
    rt_img_del3: '0',
    rt_img_del4: '0',
    rt_img_del5: '0',
  });

  const [storeInit, setStoreInit] = React.useState(false); // 매장 정보 초기값 유무

  const [showDefault, setShowDefault] = React.useState(true); // 이미지 로딩
  const [imageError, setImageError] = React.useState(false); // 이미지 에러

  const [fileImgs01, setFileImgs01] = React.useState(null); // File 대표이미지01
  const [fileImgs02, setFileImgs02] = React.useState(null); // File 대표이미지02
  const [fileImgs03, setFileImgs03] = React.useState(null); // File 대표이미지03
  const [fileImgs04, setFileImgs04] = React.useState(null); // File 대표이미지04
  const [fileImgs05, setFileImgs05] = React.useState(null); // File 대표이미지05

  const [detailImgs01, setDetailImgs01] = React.useState(''); // base64 대표이미지01
  const [detailImgs02, setDetailImgs02] = React.useState(''); // base64 대표이미지02
  const [detailImgs03, setDetailImgs03] = React.useState(''); // base64 대표이미지03
  const [detailImgs04, setDetailImgs04] = React.useState(''); // base64 대표이미지04
  const [detailImgs05, setDetailImgs05] = React.useState(''); // base64 대표이미지05

  const [storeLogoChange, setStoreLogoChange] = React.useState(false); // 로고 이미지 변경 사항 0: 변경없음 | 1 : 변경
  const [storeLogoFileObj, setStoreLogoFileObj] = React.useState(null); // 로고 이미지 파일 객체
  const [storeLogo, setStoreLogo] = React.useState(''); // 로고 이미지

  const [isLoading, setLoading] = React.useState(false);

  const [modalPost, setModalPost] = useState(false);
  const [postData, setPostData] = useState();

  const [category, setCategory] = useState([]); // 카테고리 설정 및 표시 위한 목록
  const [sltdCate, setSltdCate] = useState([]);

  const [bizNo, setBizNo] = useState({one: '', two: '', thr: ''});
  const [tel, setTel] = useState({one: '', two: '', thr: ''});
  // const [fax, setFax] = useState({one: '', two: '', thr: ''});

  const [disable, setDisable] = useState(false);

  // 연관 키워드
  const [keyword, setKeyword] = useState({
    one: '',
    two: '',
    thr: '',
    fur: '',
    fiv: '',
    six: '',
  });

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack();

    return true;
  };

  // React.useEffect(() => {
  //   let isSubscribed = true;

  //   if (isSubscribed) {
  //     getStoreInfo();
  //   }

  //   return () => {
  //     isSubscribed = false;
  //   };
  // }, []);

  // React.useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);
  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);

  const [modalRetire, setModalRetire] = useState(false);
  const onLogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('@dongnaebookownerUser');
      cusToast('회원탈퇴 하였습니다.');
      navigation.navigate('Home', {screen: 'Login'});
    } catch (err) {
      cusToast(`회원탈퇴 중 에러가 발생하였습니다.\n오류:${err}`, 2500);
    }
  };

  const _retire = () => {
    const data = {
      mt_id: userState.mt_id,
      jumju_code: userState.mt_jumju_code,
      act: 'retire',
    };
    // console.log('data', data);

    Api.send('jumju_retire', data, res => {
      console.log('res', res);
      const resultItem = res.resultItem;
      const arrItems = res.arrItems;
      console.log('res :: ', resultItem, arrItems);
      if (resultItem.result === 'Y') {
        onLogoutHandler();
      }
    });
  };

  const _convertCate = () => {
    let temp = [];
    sltdCate?.map(item => temp.push(item.ca_code));
    temp = temp.join('|');
    return temp;
  };

  const layout = useWindowDimensions();

  const _convertHash = () => {
    let temp = [];
    let keys = Object.keys(keyword);
    keys.map(item =>
      keyword[`${item}`] ? temp.push(keyword[`${item}`].trim()) : undefined,
    );
    temp = temp.join('|');
    return temp;
  };

  const onSubmitStoreInfo = () => {
    console.log('userInfo', userState);
    console.log('strologo', storeLogoFileObj);
    if (!storeLogoFileObj && !storeLogo) {
      return Alert.alert('매장등록', '로고를 설정해주세요.');
    }
    if (!fileImgs01 && !detailImgs01) {
      return Alert.alert('매장등록', '대표이미지를 설정해주세요.');
    }
    console.log('info', info);
    if (
      !info?.mb_company ||
      !info?.mb_memo ||
      !tel.one ||
      !tel.two ||
      !tel.thr ||
      !info?.mb_addr1 ||
      !_convertCate()
    ) {
      return Alert.alert('매장등록', '필수정보를 모두 입력해주세요.');
    }

    const data = {
      jumju_id: userState.mt_id,
      jumju_code: userState.mt_jumju_code,
      mb_ca_code: _convertCate(),
      mb_company: info?.mb_company,
      mb_homepage: info?.mb_homepage,
      // mb_icon: storeLogoFileObj,
      // mb_icon_del: '0',
      mb_tel: tel?.one + '-' + tel?.two + '-' + tel?.thr,
      // mb_fax: fax?.one + '-' + fax?.two + '-' + fax?.thr,
      mb_biz_no: bizNo?.one + '-' + bizNo?.two + '-' + bizNo?.thr,
      mb_eobtae: info?.mb_eobtae,
      mb_jongmog: info?.mb_jongmog,
      mb_zip: info?.mb_zip,
      mb_addr1: info?.mb_addr1,
      mb_addr2: info?.mb_addr2,
      mb_addr3: info?.mb_addr3,
      mb_addr_jibeon: info?.mb_addr_jibeon,
      mb_memo: info?.mb_memo,
      mb_recommender: info?.mb_recommender,
      mb_hash_tag: _convertHash(),
      rt_img_del1: detailImgs01 !== '' ? 0 : 1,
      rt_img_del2: detailImgs02 !== '' ? 0 : 1,
      rt_img_del3: detailImgs03 !== '' ? 0 : 1,
      rt_img_del4: detailImgs04 !== '' ? 0 : 1,
      rt_img_del5: detailImgs05 !== '' ? 0 : 1,
      mb_icon_del: storeLogoChange ? 1 : 0,
    };
    console.log('data', data);
    console.log('info.mb_company', info.mb_company);
    // return;
    const event = {
      key: 'complete_add_place',
      properties: {
        title: info.mb_company,
      },
    };

    const params2 = {
      rt_img1: fileImgs01 !== null ? fileImgs01 : '',
      rt_img2: fileImgs02 !== null ? fileImgs02 : '',
      rt_img3: fileImgs03 !== null ? fileImgs03 : '',
      rt_img4: fileImgs04 !== null ? fileImgs04 : '',
      rt_img5: fileImgs05 !== null ? fileImgs05 : '',
      mb_icon: storeLogoChange ? storeLogoFileObj : null,
    };

    Api.send3('lifestyle_setting', data, params2, args => {
      // return;
      // proc_lifestyle_setting
      // Api.send('store_guide_update', data, args => {
      // Api.send3('lifestyle_setting', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('res::', resultItem);
      console.log('res arrItems::', arrItems);
      if (resultItem.result === 'Y') {
        track(event);
        cusToast('매장정보를 등록하였습니다.메인화면으로 이동합니다.', 1500);
        setTimeout(() => {
          navigation.navigate('Home', {screen: 'Main'});
        }, 1500);
      }
    });
  };

  // const introduceRef = React.useRef(null); // 매장소개 ref

  // 대표이미지 업로드
  const openPickerHandler = () => {
    if (currentImageUploadType === 'logo') {
      setStoreLogoChange(true);
      pickGalleryImage(setStoreLogoFileObj, setStoreLogo, 300);
      imageOrCameraChoiceCloseHandler();
    } else {
      ImagePicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        multiple: true,
      })
        .then(image => {
          console.log('image', image);
          console.log('currentIndex', currentIndex);

          const imageExt = image[0].mime.split('/');
          console.log('imageExt', imageExt[1]);

          if (
            imageExt[1] !== 'jpeg' &&
            imageExt[1] !== 'jpg' &&
            imageExt[1] !== 'png' &&
            imageExt[1] !== 'bmp'
          ) {
            imageOrCameraChoiceCloseHandler();
            cusToast('업로드 가능한 이미지 형식이 아닙니다.');
          } else if (imageExt[0] !== 'image') {
            imageOrCameraChoiceCloseHandler();
            cusToast('이미지만 업로드 할 수 있습니다.');
          } else {
            if (currentIndex === 1) {
              setDetailImgs01(image[0].path);
              setFileImgs01({
                uri: image[0].path,
                type: image[0].mime,
                name: image[0].path.slice(image[0].path.lastIndexOf('/')),
              });
            } else if (currentIndex === 2) {
              setDetailImgs02(image[0].path);
              setFileImgs02({
                uri: image[0].path,
                type: image[0].mime,
                name: image[0].path.slice(image[0].path.lastIndexOf('/')),
              });
            } else if (currentIndex === 3) {
              setDetailImgs03(image[0].path);
              setFileImgs03({
                uri: image[0].path,
                type: image[0].mime,
                name: image[0].path.slice(image[0].path.lastIndexOf('/')),
              });
            } else if (currentIndex === 4) {
              setDetailImgs04(image[0].path);
              setFileImgs04({
                uri: image[0].path,
                type: image[0].mime,
                name: image[0].path.slice(image[0].path.lastIndexOf('/')),
              });
            } else if (currentIndex === 5) {
              setDetailImgs05(image[0].path);
              setFileImgs05({
                uri: image[0].path,
                type: image[0].mime,
                name: image[0].path.slice(image[0].path.lastIndexOf('/')),
              });
            } else {
              return false;
            }

            imageOrCameraChoiceCloseHandler();
          }
        })
        .catch(err => {
          console.log('이미지 업로드 error', err);
          imageOrCameraChoiceCloseHandler();
        });
    }
  };

  // 대표이미지 카메라 촬영
  const openCameraHandler = () => {
    if (currentImageUploadType === 'logo') {
      setStoreLogoChange(true);
      takeCamera(setStoreLogoFileObj, setStoreLogo, 300);
      imageOrCameraChoiceCloseHandler();
    } else {
      ImagePicker.openCamera({
        width: 1000,
        height: 800,
        cropping: true,
      })
        .then(image => {
          console.log('camera', image);

          if (currentIndex === 1) {
            setDetailImgs01(image.path);
            setFileImgs01({
              uri: image.path,
              type: image.mime,
              name: image.path.slice(image.path.lastIndexOf('/')),
            });
          } else if (currentIndex === 2) {
            setDetailImgs02(image.path);
            setFileImgs02({
              uri: image.path,
              type: image.mime,
              name: image.path.slice(image.path.lastIndexOf('/')),
            });
          } else if (currentIndex === 3) {
            setDetailImgs03(image.path);
            setFileImgs03({
              uri: image.path,
              type: image.mime,
              name: image.path.slice(image.path.lastIndexOf('/')),
            });
          } else if (currentIndex === 4) {
            setDetailImgs04(image.path);
            setFileImgs04({
              uri: image.path,
              type: image.mime,
              name: image.path.slice(image.path.lastIndexOf('/')),
            });
          } else if (currentIndex === 5) {
            setDetailImgs05(image.path);
            setFileImgs05({
              uri: image.path,
              type: image.mime,
              name: image.path.slice(image.path.lastIndexOf('/')),
            });
          } else {
            return false;
          }

          imageOrCameraChoiceHandler();
        })
        .catch(err => {
          console.log('camera error', err);
          imageOrCameraChoiceHandler();
        });
    }
  };

  // 대표이미지 업로드 선택시 이미지 설정 or 카메라 선택 모달
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mediaChoiceModalVisible, setMediaChoiceModalVisible] =
    React.useState(false);
  const [currentImageUploadType, setCurrentImageUploadType] =
    React.useState('');

  /**
   * 갤러리 선택 또는 카메라 촬영 핸들러 - 로고('logo') or 대표이미지('main') type 및 index 등 설정
   * @param {string} type 로고 또는 대표이미지 를 구별하는 고유 식별자 (로고: 'logo', 대표이미지: 'main')
   * @param {number} index type이 대표이미지일 경우, 올릴 이미지 인덱스(index)
   */
  const imageOrCameraChoiceHandler = (type, index) => {
    setCurrentImageUploadType(type);

    if (type === 'main') {
      setCurrentIndex(index);
    }
    setMediaChoiceModalVisible(!mediaChoiceModalVisible);
  };

  const imageOrCameraChoiceCloseHandler = () => {
    setMediaChoiceModalVisible(false);
  };

  /**
   * 대표이미지 삭제
   * @param {number} index 삭제할 대표이미지 인덱스(index)
   * @returns
   */
  // 대표이미지 삭제
  const deleteImage = index => {
    if (index == 1) {
      setDetailImgs01('');
      setFileImgs01(null);
    } else if (index == 2) {
      setDetailImgs02('');
      setFileImgs02(null);
    } else if (index == 3) {
      setDetailImgs03('');
      setFileImgs03(null);
    } else if (index == 4) {
      setDetailImgs04('');
      setFileImgs04(null);
    } else if (index == 5) {
      setDetailImgs05('');
      setFileImgs05(null);
    } else {
      return false;
    }
  };
  const _getCategory = () => {
    const data = {
      ca_type: 'lifestyle',
    };
    // Api.send('category_list', data, args => {
    Api.send('lifestyle_category_list', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('res :: ', resultItem, arrItems);
      if (resultItem.result === 'Y') {
        let temp = [];
        arrItems.map(item =>
          temp.push({ca_code: item.ca_code, ca_name: item.ca_name}),
        );
        // console.log('temp ::', temp);
        setCategory(temp);
        // cusToast('매장정보를 등록하였습니다.메인화면으로 이동합니다.', 1500);
        // setTimeout(() => {
        //   navigation.navigate('Home', {screen: 'Main'});
        // }, 1500);
      }
    });
  };

  useEffect(() => {
    _getCategory();
  }, []);

  useEffect(() => {
    console.log('sltdCate', sltdCate);
  }, [sltdCate]);

  const _getStoreInfo = () => {
    const data = {
      jumju_id: userState.mt_id,
      jumju_code: userState.mt_jumju_code,
    };
    Api.send('lifestyle_info', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('resultItem', resultItem);
      console.log('arrItems', arrItems);
      if (resultItem.result === 'Y') {
        if (arrItems?.mb_tel?.length > 1) {
          let temp = arrItems?.mb_tel.split('-');
          setTel({one: temp[0], two: temp[1], thr: temp[2]});
        }
        // if (arrItems?.mb_fax?.length > 1) {
        //   let temp = arrItems?.mb_fax.split('-');
        //   setFax({one: temp[0], two: temp[1], thr: temp[2]});
        // }
        if (arrItems?.mb_biz_no?.length > 1) {
          let temp = arrItems?.mb_biz_no.split('-');
          setBizNo({one: temp[0], two: temp[1], thr: temp[2]});
        }
        if (arrItems?.mb_ca_code) {
          let temp = arrItems.mb_ca_code.split('|');
          let temp2 = [];
          temp.map(item => temp2.push({ca_code: item}));
          setSltdCate(temp2);
          console.log('::::::::: TEMP :::::: ', temp, temp2);
        }
        // setTel();
        // setFax();
        // setBizNo();
        if (arrItems?.mb_hash_tag) {
          let temp = arrItems?.mb_hash_tag.split('|');
          setKeyword({
            one: temp[0] ? temp[0] : '',
            two: temp[1] ? temp[1] : '',
            thr: temp[2] ? temp[2] : '',
            fur: temp[3] ? temp[3] : '',
            fiv: temp[4] ? temp[4] : '',
            six: temp[5] ? temp[5] : '',
          });
        }
        setDisable(arrItems.mb_recommender ? false : true);
        setInfo({
          mb_ca_code: '',
          mb_company: arrItems.mb_company,
          mb_homepage: arrItems.mb_homepage,
          // mb_tel: arrItems.mb_tel,
          // mb_fax: arrItems.mb_fax,
          // mb_biz_no: arrItems.mb_biz_no,
          mb_eobtae: arrItems.mb_eobtae,
          mb_jongmog: arrItems.mb_jongmog,
          mb_zip: arrItems.mb_zip,
          mb_addr1: arrItems.mb_addr1,
          mb_addr2: arrItems.mb_addr2,
          mb_addr3: arrItems.mb_addr3,
          mb_addr_jibeon: arrItems.mb_addr_jibeon,
          mb_memo: arrItems.mb_memo,
          mb_recommender: arrItems.mb_recommender,
        });
        setDetailImgs01(arrItems.pic[0].img);
        setDetailImgs02(arrItems.pic[1].img);
        setDetailImgs03(arrItems.pic[2].img);
        setDetailImgs04(arrItems.pic[3].img);
        setDetailImgs05(arrItems.pic[4].img);
        setStoreLogo(arrItems.mt_icon);
      }
    });
  };

  useEffect(() => {
    _getStoreInfo();
  }, []);

  const renderItem = item => {
    const ele = item.item;
    return (
      <Pressable
        onPress={() => {
          let temp = [];
          temp = JSON.parse(JSON.stringify(sltdCate));
          if (
            temp.length !== 2 &&
            !temp.find(item => item.ca_code === ele.ca_code)
          ) {
            console.log('temp2', temp);
            temp.push(ele);
            setSltdCate(temp);
          } else {
            let temp2 = temp.filter(item => item.ca_code !== ele.ca_code);
            console.log('temp3', temp);
            // console.log('temp2', temp2);
            setSltdCate(temp2);
          }
          // console.log(sltdCate.findIndex(item => item.ca_code === ele.ca_code));
          // console.log('temp :::: ', temp);
          // console.log(sltdCate.includes(ele));
        }}
        style={{flex: 1, flexDirection: 'row'}}>
        <Image
          source={
            sltdCate.find(item => item.ca_code === ele.ca_code)
              ? require('../../../images/ic_check_on.png')
              : require('../../../images/ic_check_off.png')
          }
          style={{width: 20, height: 20, marginRight: 10, marginBottom: 10}}
          resizeMode="contain"
        />
        <Text>{ele.ca_name}</Text>
      </Pressable>
    );
  };

  /**
   * 업로드된 대표이미지 컴포넌트
   * @param {string} imgPath 이미지 패스
   * @param {number} index 이미지 인덱스(index)
   * @returns
   */
  const UploadedImageBox = ({imgPath, index}) => {
    console.log('imgPath', imgPath);
    return (
      <View style={{position: 'relative'}}>
        <Image
          source={{uri: `${imgPath}`}}
          style={{
            width: MAIN_IMAGE_THUMB_WIDTH,
            height: MAIN_IMAGE_THUMB_WIDTH - 10,
            borderRadius: 5,
          }}
          resizeMode="cover"
          onError={() => setImageError(true)}
          onLoadEnd={() => setShowDefault(false)}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => deleteImage(index)}
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#222',
            borderRadius: 30,
          }}>
          <Image
            source={require('../../../images/close_wh.png')}
            style={{
              width: 10,
              height: 10,
            }}
            resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * 대표이미지 비어있는 항목
   * @param {number} index 비어있는 항목의 인덱스(index)
   * @returns
   */
  const EmptyImageSelectBox = ({index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => imageOrCameraChoiceHandler('main', index)}
        style={{
          width: MAIN_IMAGE_THUMB_WIDTH,
          height: MAIN_IMAGE_THUMB_WIDTH - 10,
          borderRadius: 5,
          backgroundColor: '#ececec',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...BaseStyle.ko24,
            color: '#aaa',
            marginTop: Platform.OS === 'ios' ? -5 : 0,
          }}>
          +
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* {isLoading && (
        <AnimateLoading description="데이터를 불러오는 중입니다." />
      )} */}

      {!isLoading && (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Header
            isCB
            title="매장소개"
            navigation={navigation}
            storeExist={userState.mt_store ? true : false}
          />

          {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

          <Modal
            transparent
            statusBarTranslucent
            isVisible={mediaChoiceModalVisible}
            onBackdropPress={imageOrCameraChoiceCloseHandler}
            style={{...BaseStyle.ph10, ...BaseStyle.pv20}}
            animationIn="slideInUp"
            animationInTiming={100}>
            <View
              style={{
                ...BaseStyle.container2,
                ...BaseStyle.pv30,
                ...BaseStyle.ph20,
                position: 'relative',
                backgroundColor: '#fff',
                borderRadius: 5,
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={imageOrCameraChoiceCloseHandler}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  backgroundColor: Primary.PointColor01,
                  borderRadius: 30,
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../../images/close.png')}
                  style={{
                    width: 12,
                    height: 12,
                  }}
                  resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
                />
              </TouchableOpacity>
              <Text style={{...BaseStyle.ko14, ...BaseStyle.mb20}}>
                어떤 방식으로 대표이미지를 올리시겠습니까?
              </Text>
              <View
                style={{
                  ...BaseStyle.container4,
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={openPickerHandler}
                  style={{
                    ...BaseStyle.container1,
                    height: 45,
                    backgroundColor: Primary.PointColor01,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}>
                  <Text style={{...BaseStyle.ko1, ...BaseStyle.font_white}}>
                    갤러리선택
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={openCameraHandler}
                  style={{
                    ...BaseStyle.container1,
                    height: 45,
                    backgroundColor: Primary.PointColor02,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}>
                  <Text
                    style={{
                      ...BaseStyle.ko14,
                      color: '#fff',
                    }}>
                    사진촬영
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View>
              <View style={{...BaseStyle.ph20, ...BaseStyle.mv20}}>
                <Text
                  style={{
                    ...BaseStyle.ko12,
                    color: Primary.PointColor02,
                    lineHeight: 16,
                    ...BaseStyle.mb20,
                  }}>
                  ※ 표시는 필수 입력란 입니다.
                </Text>

                {/* 로고 설정 */}
                <View style={{...BaseStyle.container3}}>
                  <Text
                    style={{
                      ...BaseStyle.ko15,
                      ...BaseStyle.font_bold,
                      ...BaseStyle.mr10,
                    }}>
                    로고 설정
                  </Text>
                  {/* <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text> */}
                </View>

                <View
                  style={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    ...BaseStyle.mv10,
                    ...BaseStyle.mb20,
                  }}>
                  {storeLogo !== '' && (
                    <>
                      <Image
                        source={{uri: `${storeLogo}`}}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderWidth: 1,
                          borderColor: '#ececec',
                          borderRadius: 5,
                        }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setStoreLogo('')}
                        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: 20,
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#222',
                          borderRadius: 30,
                        }}>
                        <Image
                          source={require('../../../images/close_wh.png')}
                          style={{
                            width: 10,
                            height: 10,
                          }}
                          resizeMode={
                            Platform.OS === 'ios' ? 'contain' : 'center'
                          }
                        />
                      </TouchableOpacity>
                    </>
                  )}

                  {!storeLogo && (
                    <TouchableOpacity
                      activeOpacity={1}
                      // onPress={pickImageHandler}
                      onPress={() => imageOrCameraChoiceHandler('logo')}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 5,
                        backgroundColor: '#ececec',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          ...BaseStyle.ko24,
                          color: '#aaa',
                          marginTop: Platform.OS === 'ios' ? -5 : 0,
                        }}>
                        +
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* // 로고 설정 */}

                {/* 대표 이미지 설정 */}
                <View style={{...BaseStyle.container3}}>
                  <Text
                    style={{
                      ...BaseStyle.ko15,
                      ...BaseStyle.font_bold,
                      ...BaseStyle.mr10,
                    }}>
                    대표 이미지
                  </Text>
                  <View>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        color: '#aaa',
                        lineHeight: 16,
                        ...BaseStyle.mb3,
                      }}>
                      (대표 이미지는 5장까지 등록 가능합니다.)
                    </Text>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        lineHeight: 16,
                        color: '#aaa',
                      }}>
                      ※ 이미지는 4:3 비율을 권장합니다.
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    ...BaseStyle.mv10,
                  }}>
                  {/* 신규 */}
                  {detailImgs01 !== '' ? (
                    <UploadedImageBox imgPath={detailImgs01} index={1} />
                  ) : (
                    <EmptyImageSelectBox index={1} />
                  )}

                  {detailImgs02 !== '' ? (
                    <UploadedImageBox imgPath={detailImgs02} index={2} />
                  ) : (
                    <EmptyImageSelectBox index={2} />
                  )}

                  {detailImgs03 !== '' ? (
                    <UploadedImageBox imgPath={detailImgs03} index={3} />
                  ) : (
                    <EmptyImageSelectBox index={3} />
                  )}

                  {detailImgs04 !== '' ? (
                    <UploadedImageBox imgPath={detailImgs04} index={4} />
                  ) : (
                    <EmptyImageSelectBox index={4} />
                  )}

                  {detailImgs05 !== '' ? (
                    <UploadedImageBox imgPath={detailImgs05} index={5} />
                  ) : (
                    <EmptyImageSelectBox index={5} />
                  )}
                  {/* //신규 */}
                </View>
                {/* // 대표 이미지 설정 */}

                {/* 매장명 */}
                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      매장명
                    </Text>
                    <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 50,
                    }}>
                    <TextInput
                      placeholder="매장명을 입력해주세요."
                      value={info.mb_company}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_company: str}))
                      }
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* 매장 소개 */}
                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      매장 소개
                    </Text>
                    <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 150,
                    }}>
                    <TextInput
                      // ref={introduceRef}
                      value={info.mb_memo}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_memo: str}))
                      }
                      placeholder="매장에 대한 설명을 입력해주세요."
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                      multiline
                    />
                  </View>
                </View>
                {/* // 매장 소개 */}

                {/* 매장 전화번호 */}
                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      매장 전화번호
                    </Text>
                    <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', height: 50}}>
                    <TextInput
                      // maxLength={3}
                      value={tel?.one}
                      onChangeText={str =>
                        setTel(prev => ({...prev, one: str}))
                      }
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      // maxLength={4}
                      value={tel?.two}
                      onChangeText={str =>
                        setTel(prev => ({...prev, two: str}))
                      }
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      // maxLength={4}
                      value={tel?.thr}
                      onChangeText={str =>
                        setTel(prev => ({...prev, thr: str}))
                      }
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                  </View>
                </View>

                {/* 매장 홈페이지 */}
                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      홈페이지
                    </Text>
                    {/* <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text> */}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 50,
                    }}>
                    <TextInput
                      placeholder="홈페이지를 입력해주세요."
                      value={info?.mb_homepage}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_homepage: str}))
                      }
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* 매장 팩스 */}
                <View style={{...BaseStyle.mv10}}>
                  {/* <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      매장 팩스
                    </Text>
                    <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', height: 50}}>
                    <TextInput
                      // maxLength={3}
                      value={fax.one}
                      onChangeText={str =>
                        setFax(prev => ({...prev, one: str}))
                      }
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      // maxLength={4}
                      value={fax.two}
                      onChangeText={str =>
                        setFax(prev => ({...prev, two: str}))
                      }
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      // maxLength={4}
                      value={fax.thr}
                      onChangeText={str =>
                        setFax(prev => ({...prev, thr: str}))
                      }
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                  </View> */}
                </View>

                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      매장 주소
                    </Text>
                    <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      // ...BaseStyle.ph10,
                      paddingHorizontal: 10,
                      height: 50,
                      justifyContent: 'center',
                    }}>
                    <Pressable
                      onPress={() => setModalPost(true)}
                      style={{justifyContent: 'center'}}>
                      <Text style={{color: '#c7c7c7'}}>
                        {info.mb_addr1
                          ? info.mb_addr1
                          : '매장주소를 입력해주세요.'}
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 50,
                      marginTop: 10,
                    }}>
                    <TextInput
                      placeholder="상세주소를 입력해주세요."
                      value={info.mb_addr2}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_addr2: str}))
                      }
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                {/* 매장 상세 주소 */}

                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      사업자등록번호
                    </Text>
                    {/* <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text> */}
                  </View>
                  <View style={{flexDirection: 'row', height: 50}}>
                    <TextInput
                      // maxLength={3}
                      value={bizNo.one}
                      onChangeText={str =>
                        setBizNo(prev => ({...prev, one: str}))
                      }
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      // maxLength={4}
                      value={bizNo.two}
                      onChangeText={str =>
                        setBizNo(prev => ({...prev, two: str}))
                      }
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      // maxLength={4}
                      value={bizNo.thr}
                      onChangeText={str =>
                        setBizNo(prev => ({...prev, thr: str}))
                      }
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                  </View>
                </View>

                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      업태
                    </Text>
                    {/* <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text> */}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 50,
                    }}>
                    <TextInput
                      placeholder="업태를 입력해주세요."
                      value={info.mb_eobtae}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_eobtae: str}))
                      }
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      업종
                    </Text>
                    {/* <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text> */}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 50,
                    }}>
                    <TextInput
                      placeholder="업종을 입력해주세요."
                      value={info.mb_jongmog}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_jongmog: str}))
                      }
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      추천인코드
                    </Text>
                    {/* <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text> */}
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 50,
                    }}>
                    <TextInput
                      placeholder="추천인코드를 입력해주세요."
                      value={info.mb_recommender}
                      onChangeText={str =>
                        setInfo(prev => ({...prev, mb_recommender: str}))
                      }
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10,
                      }}
                      autoCapitalize="none"
                      editable={disable}
                      selectTextOnFocus={disable}
                    />
                  </View>
                </View>
                <View
                  style={{
                    borderWidth: 0,
                    height: 30,
                  }}>
                  <Text
                    style={{...BaseStyle.ko12, lineHeight: 16, color: '#aaa'}}>
                    ※ 추천인코드는 한 번 입력한 이후에는 수정은 불가능합니다.
                  </Text>
                </View>
                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      매장 카테고리
                    </Text>
                    <Text
                      style={{...BaseStyle.ko12, color: Primary.PointColor02}}>
                      ※
                    </Text>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        color: '#aaa',
                        lineHeight: 16,
                        ...BaseStyle.mb3,
                      }}>
                      (카테고리는 최대 2개 설정가능합니다.)
                    </Text>
                  </View>
                  <FlatList
                    data={category}
                    renderItem={item => renderItem(item)}
                    keyExtractor={(item, index) => index}
                    numColumns={2}
                  />
                </View>

                {/* 연관 키워드 */}
                <View style={{...BaseStyle.mv10}}>
                  <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5,
                      }}>
                      연관 키워드
                    </Text>

                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        color: '#aaa',
                        lineHeight: 16,
                        ...BaseStyle.mb3,
                      }}>
                      키워드를 입력하세요 (최대6개)
                    </Text>
                  </View>
                  {/* line 1 */}
                  <View style={{flexDirection: 'row', height: 50}}>
                    <TextInput
                      value={keyword.one}
                      onChangeText={str => {
                        setKeyword(prev => ({...prev, one: str}));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      value={keyword.two}
                      onChangeText={str => {
                        setKeyword(prev => ({...prev, two: str}));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                  </View>
                  {/* line 2 */}
                  <View
                    style={{flexDirection: 'row', height: 50, marginTop: 10}}>
                    <TextInput
                      value={keyword.thr}
                      onChangeText={str => {
                        setKeyword(prev => ({...prev, thr: str}));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      value={keyword.fur}
                      onChangeText={str => {
                        setKeyword(prev => ({...prev, fur: str}));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                  </View>
                  {/* line 3 */}
                  <View
                    style={{flexDirection: 'row', height: 50, marginTop: 10}}>
                    <TextInput
                      value={keyword.fiv}
                      onChangeText={str => {
                        setKeyword(prev => ({...prev, fiv: str}));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                    <TextInput
                      value={keyword.six}
                      onChangeText={str => {
                        setKeyword(prev => ({...prev, six: str}));
                      }}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        flex: 1,
                        marginRight: 10,
                        paddingHorizontal: 10,
                        // ...BaseStyle.ko14,
                      }}
                    />
                  </View>
                </View>
                {userState?.mt_order_type === 'N' && (
                  <Pressable
                    hitSlop={7}
                    onPress={() => {
                      Alert.alert('회원탈퇴', '회원탈퇴 하시겠습니까?', [
                        {text: '확인', onPress: () => _retire()},
                        {text: '취소', onPress: () => {}},
                      ]);
                    }}
                    style={{
                      alignSelf: 'flex-end',
                      marginTop: 10,
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        color: '#c7c7c7',
                        textDecorationLine: 'underline',
                      }}>
                      회원탈퇴
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </ScrollView>
          {modalPost && (
            <SafeAreaView
              edges={['top']}
              style={{
                zIndex: 1000,
                width: layout.width,
                height: layout.height,
                position: 'absolute',
              }}>
              <Postcode
                style={{flex: 1}}
                jsOptions={{animation: true, hideMapBtn: true}}
                onSelected={data => {
                  // alert(JSON.stringify(data));ß
                  console.log('data', data);
                  setPostData(data);
                  setInfo(prev => ({
                    ...prev,
                    mb_addr1: data.address,
                    mb_addr3: data?.buildingName,
                    mb_addr_jibeon: data?.jibunAddress,
                    mb_zip: data?.zonecode,
                  }));
                  setModalPost(false);
                }}
              />
            </SafeAreaView>
          )}

          {storeInit ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onModifyStoreInfo}
              style={{...BaseStyle.mainBtnBottom}}>
              <Text
                style={{
                  ...BaseStyle.ko18,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.font_white,
                }}>
                수정하기
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onSubmitStoreInfo}
              style={{...BaseStyle.mainBtnBottom}}>
              <Text
                style={{
                  ...BaseStyle.ko18,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.font_white,
                }}>
                등록하기
              </Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.goBack()}
        style={{...BaseStyle.mainBtnBottom, backgroundColor:'#e5e5e5'}}
      >
        <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold}}>나가기</Text>
      </TouchableOpacity> */}
        </View>
      )}
    </>
  );
};

export default CBStoreInfoSetting;
