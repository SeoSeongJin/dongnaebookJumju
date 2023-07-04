import {View, Text, ScrollView, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import policyConfig from './policyConfig';
import CBHeader from './components/CBHeader';
import Api from '../../Api';
import RenderHtml from 'react-native-render-html';
import {PrimaryColor} from '../../styles/Base';

const Policy = ({navigation, route}) => {
  const routeData = route.params?.target;
  const [contents, setContents] = useState();

  const _init = () => {
    let temp;
    switch (routeData) {
      case policyConfig.target.use:
        temp = 'provision';
        break;
      case policyConfig.target.location:
        temp = 'location';
        break;
      case policyConfig.target.personal:
        temp = 'privacy';
        break;
      default:
        temp = 'provision';
        break;
    }

    const data = {
      co_id: temp,
    };
    Api.send('agree', data, args => {
      console.log('args', args);
      if (args.resultItem.result === 'Y') {
        setContents(args.arrItems.co_content);
      }
    });
    // mutatePolicy.mutate(data);
  };

  useEffect(() => {
    _init();
  }, [routeData]);

  // if (mutatePolicy.isLoading) return <Loading />;
  if (!contents)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={'large'} color={PrimaryColor} />
      </View>
    );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Header title={routeData} navigation={navigation} /> */}
      <CBHeader title={routeData} navigation={navigation} />
      <ScrollView>
        <View style={{padding: 22}}>
          <RenderHtml source={{html: contents}}></RenderHtml>
          {/* <Text>{contents}</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Policy;
