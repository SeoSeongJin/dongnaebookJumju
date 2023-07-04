import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {Fonts} from '../../../styles/Fonts';

const CBHeader = ({navigation, title, style}) => {
  return (
    <View
      style={{
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingLeft: 20,
      }}>
      <Pressable
        hitSlop={10}
        onPress={() => {
          navigation.goBack();
        }}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('../../../images/top_ic_history.png')}
          style={{width: 20, height: 20}}
          resizeMode="contain"
        />
        {title && (
          <Text
            style={{
              marginTop: 4,
              marginLeft: 20,
              fontSize: 16,
              fontFamily: Fonts.NotoSansB,
            }}>
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default CBHeader;
