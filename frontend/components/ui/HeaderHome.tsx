import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale, scale, verticalScale} from '../../utils/scale';

import Colors from '../../global/Color';
import {Icon} from '@rneui/themed';
import React from 'react';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {getFontFamily} from '../../utils/fonts';
import {useSelector} from 'react-redux';

const HeaderHome = (props: any) => {
  const {navigation} = props;
  const numberOfUnreadChat = useSelector(
    (state: RootState) => state.chatRoom.numberOfUnreadMessages,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Happy Food</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate(Route.GroupHomeScreen);
          }}>
          <Image
            source={require('../../assets/images/search.png')}
            style={{
              width: scale(24),
              height: verticalScale(24),
              marginRight: scale(20),
            }}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(Route.MapView);
          }}
          style={{
            width: scale(24),
            height: verticalScale(24),
            marginRight: scale(20),
          }}>
          <Icon
            name="map-marked-alt"
            type="font-awesome-5"
            size={24}
            color={Colors.black}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(Route.Chat);
          }}>
          <Image
            source={require('../../assets/images/chat.png')}
            style={{width: scale(24), height: verticalScale(24)}}
          />
          {numberOfUnreadChat > 0 ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                width: scale(12),
                height: verticalScale(12),
                top: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
              }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: scale(10),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.greenText,
    fontFamily: getFontFamily('bold'),
  },
});

export default HeaderHome;
