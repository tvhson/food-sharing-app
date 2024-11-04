/* eslint-disable react-native/no-inline-styles */
import {Avatar, Icon} from '@rneui/themed';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';

const HeaderHome = (props: any) => {
  const {navigation} = props;
  const numberOfUnreadChat = useSelector(
    (state: RootState) => state.chatRoom.numberOfUnreadMessages,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Happy Food</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/search.png')}
            style={{width: 24, height: 24, marginRight: 20}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Chat');
          }}>
          <Image
            source={require('../../assets/images/chat.png')}
            style={{width: 24, height: 24}}
          />
          {numberOfUnreadChat > 0 ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                width: 12,
                height: 12,
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
    padding: 10,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.greenText,
    fontFamily: getFontFamily('bold'),
  },
});

export default HeaderHome;
