import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Headers/SubHeader';
import Base, {PrimaryColor} from '../../styles/Base';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Api from '../../Api';
import cusToast from '../../components/CusToast';
import {useEffect} from 'react';

const CBTimeSetting = ({navigation}) => {
  const userState = useSelector(state => state.login);
  console.log('userState', userState);
  const [opHour, setOpHour] = useState({
    jumju_id: userState.mt_id,
    jumju_code: userState.mt_jumju_code,
    day1: '월',
    day1_stime: '',
    day1_etime: '',
    day1_holiday: '',
    day2: '화',
    day2_stime: '',
    day2_etime: '',
    day2_holiday: '',
    day3: '수',
    day3_stime: '',
    day3_etime: '',
    day3_holiday: '',
    day4: '목',
    day4_stime: '',
    day4_etime: '',
    day4_holiday: '',
    day5: '금',
    day5_stime: '',
    day5_etime: '',
    day5_holiday: '',
    day6: '토',
    day6_stime: '',
    day6_etime: '',
    day6_holiday: '',
    day7: '일',
    day7_stime: '',
    day7_etime: '',
    day7_holiday: '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    visible: false,
    target: '',
  });

  const [loading, setLoading] = useState(false);

  //기존 시간 가져오기
  const _getTimes = () => {
    const data = {
      jumju_id: userState.mt_id,
      jumju_code: userState.mt_jumju_code,
    };
    Api.send('lifestyle_opening_hours', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      if (resultItem.result === 'Y') {
        console.log('arrItems', arrItems);
        setOpHour({
          jumju_id: userState.mt_id,
          jumju_code: userState.mt_jumju_code,
          ...arrItems,
        });
      }
    });
  };

  useEffect(() => {
    _getTimes();
  }, []);

  //신규 시간 추가하기
  const _putTimes = () => {
    const data = {
      ...opHour,
    };
    console.log('op data', opHour);
    Api.send('lifestyle_opening_hours_update', data, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;
      console.log('res :: ', resultItem);
      console.log('arrItems :::', arrItems);
      if (resultItem.result === 'Y') {
        cusToast(
          '영업시간 설정이 완료되었습니다. 메인 화면으로 이동합니다.',
          1500,
        );
        navigation.navigate('Main');
      } else {
        Alert.alert(
          '영업시간 설정',
          '현재 사용할 수 없는 기능 입니다. 메인 화면으로 이동합니다.',
          [
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Main');
              },
            },
          ],
        );
      }
    }).finally(() => {});
  };

  const showDatePicker = target => {
    setDatePickerVisibility({visible: true, target: target});
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(prev => ({...prev, visible: false}));
  };

  const handleConfirm = date => {
    console.log('pcik', date);
    console.log('time', moment(date).format('HH:mm'));
    const time = moment(date).format('HH:mm');
    hideDatePicker();
    switch (isDatePickerVisible.target) {
      case 'day1s':
        setOpHour(prev => ({...prev, day1_stime: time}));
        return;
      case 'day1e':
        setOpHour(prev => ({...prev, day1_etime: time}));
        return;

      case 'day2s':
        setOpHour(prev => ({...prev, day2_stime: time}));
        return;
      case 'day2e':
        setOpHour(prev => ({...prev, day2_etime: time}));
        return;

      case 'day3s':
        setOpHour(prev => ({...prev, day3_stime: time}));
        return;
      case 'day3e':
        setOpHour(prev => ({...prev, day3_etime: time}));
        return;

      case 'day4s':
        setOpHour(prev => ({...prev, day4_stime: time}));
        return;
      case 'day4e':
        setOpHour(prev => ({...prev, day4_etime: time}));
        return;

      case 'day5s':
        setOpHour(prev => ({...prev, day5_stime: time}));
        return;
      case 'day5e':
        setOpHour(prev => ({...prev, day5_etime: time}));
        return;

      case 'day6s':
        setOpHour(prev => ({...prev, day6_stime: time}));
        return;
      case 'day6e':
        setOpHour(prev => ({...prev, day6_etime: time}));
        return;

      case 'day7s':
        setOpHour(prev => ({...prev, day7_stime: time}));
        return;
      case 'day7e':
        setOpHour(prev => ({...prev, day7_etime: time}));
        return;

      default:
        return;
    }
    // if (isDatePickerVisible.target === 'start')
    //   setForm(prev => ({...prev, cp_start: moment(date).format('YYYY-MM-DD')}));
    // else
    //   setForm(prev => ({...prev, cp_end: moment(date).format('YYYY-MM-DD')}));
    // console.log('A date has been picked: ', date);
    // console.log('A date has been picked: ', ;
  };

  return (
    <SafeAreaView style={{...Base.safeArea}}>
      <Header
        title="영업시간"
        navigation={navigation}
        // storeExist={userState.mt_store ? true : false}
      />
      <ScrollView contentContainerStyle={{marginTop: 10}}>
        {/* 월 */}
        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>월요일</Text>
            </View>
            <Pressable
              onPress={() => {
                showDatePicker('day1s');
              }}
              style={{...styles.inputTime}}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day1_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day1_stime ? opHour?.day1_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              onPress={() => {
                showDatePicker('day1e');
              }}
              style={{...styles.inputTime}}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day1_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day1_etime ? opHour?.day1_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day1_holiday: opHour.day1_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day1_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        {/* 화 */}
        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>화요일</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day2s');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day2_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day2_stime ? opHour?.day2_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day2e');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day2_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day2_etime ? opHour?.day2_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day2_holiday: opHour.day2_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day2_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        {/* 수 */}
        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>수요일</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day3s');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day3_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day3_stime ? opHour?.day3_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day3e');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day3_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day3_etime ? opHour?.day3_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day3_holiday: opHour.day3_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day3_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        {/* 목 */}
        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>목요일</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day4s');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day4_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day4_stime ? opHour?.day4_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day4e');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day4_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day4_etime ? opHour?.day4_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day4_holiday: opHour.day4_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day4_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        {/* 금 */}
        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>금요일</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day5s');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day5_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day5_stime ? opHour?.day5_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day5e');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day5_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day5_etime ? opHour?.day5_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day5_holiday: opHour.day5_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day5_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        {/* 토 */}
        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>토요일</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day6s');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day6_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day6_stime ? opHour?.day6_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day6e');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day6_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day6_etime ? opHour?.day6_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day6_holiday: opHour.day6_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day6_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>

        <View style={{marginHorizontal: 15, marginBottom: 0}}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{marginRight: 10}}>
              <Text>일요일</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day7s');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day7_stime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day7_stime ? opHour?.day7_stime : '00:00'}
              </Text>
            </Pressable>
            <View style={{marginHorizontal: 10}}>
              <Text>~</Text>
            </View>
            <Pressable
              style={{...styles.inputTime}}
              onPress={() => {
                showDatePicker('day7e');
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: opHour.day7_etime ? 'black' : '#E3E3E3',
                }}>
                {opHour?.day7_etime ? opHour?.day7_etime : '00:00'}
              </Text>
            </Pressable>
            <Pressable
              style={{flexDirection: 'row', marginLeft: 10}}
              hitSlop={5}
              onPress={() => {
                setOpHour(prev => ({
                  ...prev,
                  day7_holiday: opHour.day7_holiday === 'Y' ? 'N' : 'Y',
                }));
              }}>
              <Text>휴무</Text>
              <Image
                source={
                  opHour?.day7_holiday === 'Y'
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{width: 20, height: 20, marginLeft: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => {
          _putTimes();
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 60,
          backgroundColor: PrimaryColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 18, color: 'white', fontWeight: '700'}}>
          설정 완료
        </Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible.visible}
        // minimumDate={new Date()}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};

export default CBTimeSetting;

const styles = StyleSheet.create({
  inputTime: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E3E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
