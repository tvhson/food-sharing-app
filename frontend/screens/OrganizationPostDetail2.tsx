import {IGetGroupResponse, joinGroup} from '../api/GroupApi';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import {Icon} from 'react-native-paper';
import {Linking} from 'react-native';
import {RootState} from '../redux/Store';
import {Route} from '../constants/route';
import {addGroup} from '../redux/GroupReducer';
import {getFontFamily} from '../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import {useNotifications} from 'react-native-notificated';

const OrganizationPostDetail2 = (props: any) => {
  const navigation: any = useNavigation();
  const item: IGetGroupResponse = props.route.params.item;

  const {notify} = useNotifications();
  const token = useSelector((state: RootState) => state.token.key);
  const user = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  console.log(item);

  const handleAttend = async () => {
    if (item.joined === 'JOINED') {
      navigation.navigate(Route.GroupHomeScreen, {
        item,
      });
      return;
    }

    await joinGroup(token, item.id, user.id)
      .then(response => {
        dispatch(addGroup(response));
      })
      .catch(error => {
        notify('error', {
          params: {
            description: 'Không thể tham gia nhóm',
            title: 'Lỗi',
            style: {
              multiline: 100,
            },
          },
        });
      });
  };
  const handleBack = () => {
    navigation.goBack();
  };

  const handlePressLocation = () => {
    //open google map
    Linking.openURL(
      'https://www.google.com/maps/dir/?api=1&destination=84+Cách+Mạng+Tháng+8+Đà+Nẵng+Việt+Nam',
    );
  };

  const renderHeader = () => {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <>
          <View style={styles.container}>
            <TouchableOpacity style={styles.floatBtn} onPress={handleBack}>
              <Icon source={'arrow-left'} size={25} color={Colors.text} />
            </TouchableOpacity>
            <View>
              <Image
                source={{
                  uri: item.imageUrl,
                }}
                style={styles.topImg}
              />
              <View style={{backgroundColor: '#00000004', paddingBottom: 10}}>
                <Text style={styles.textTitle}>{item.name}</Text>

                <TouchableOpacity
                  style={[
                    styles.btnJoin,
                    {
                      backgroundColor:
                        item.joined === 'JOINED'
                          ? Colors.greenLight2
                          : Colors.greenPrimary,
                    },
                  ]}
                  onPress={handleAttend}>
                  <Image
                    source={
                      item.joined === 'JOINED'
                        ? require('../assets/images/star-green.png')
                        : require('../assets/images/star-white.png')
                    }
                    style={{width: 20, height: 20}}
                  />
                  <Text
                    style={[
                      styles.textBtn,
                      {
                        color:
                          item.joined === 'JOINED'
                            ? Colors.greenText
                            : Colors.white,
                      },
                    ]}>
                    {item.joined === 'JOINED'
                      ? 'Truy cập nhóm'
                      : item.joined === 'REQUESTED'
                      ? 'Đang chờ'
                      : 'Tham gia'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingBottom: 10,
                  marginHorizontal: 20,
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 0.8,
                }}>
                <TouchableWithoutFeedback onPress={handlePressLocation}>
                  <View style={styles.row}>
                    <Image
                      source={require('../assets/images/location.png')}
                      style={styles.iconText}
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.textNormal}>
                        Địa điểm: {item.locationName}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.row}>
                  <Image
                    source={require('../assets/images/care.png')}
                    style={styles.iconText}
                  />
                  <View style={{flex: 1}}>
                    <Text style={styles.textNormal}>
                      {item.members.length} người tham gia
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}>
                <Text style={styles.textTitle2}>Giới thiệu nhóm</Text>
                <Text style={styles.textNormal}>{item.description}</Text>
                <View
                  style={{
                    height: 0.8,
                    backgroundColor: '#ccc',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                />
              </View>
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>
    );
  };

  return <ScrollView style={styles.container}>{renderHeader()}</ScrollView>;
};

export default OrganizationPostDetail2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImg: {
    width: '100%',
    height: 300,
  },
  floatBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  textLink: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: '#3498db',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  btnJoin: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    borderRadius: 10,
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: 16,
    fontFamily: getFontFamily('bold'),
    marginLeft: 5,
  },
  textNormal: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  iconText: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  textTitle2: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
    color: Colors.text,
  },
});
