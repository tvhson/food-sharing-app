import {Avatar, Icon} from 'react-native-paper';
import {
  getGroup,
  getGroupById,
  IGetGroupResponse,
  joinGroup,
} from '../api/GroupApi';
import {
  Image,
  RefreshControl,
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
import {Linking} from 'react-native';
import {RootState} from '../redux/Store';
import {Route} from '../constants/route';
import {addGroup} from '../redux/GroupReducer';
import {getFontFamily} from '../utils/fonts';
import {moderateScale, scale, verticalScale} from '../utils/scale';
import {useNavigation} from '@react-navigation/native';
import {useNotifications} from 'react-native-notificated';
import {useLoading} from '../utils/LoadingContext';

const OrganizationPostDetail2 = (props: any) => {
  const navigation: any = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {notify} = useNotifications();
  const token = useSelector((state: RootState) => state.token.key);
  const user = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const [item, setItem] = useState<IGetGroupResponse>(props.route.params.item);
  const {showLoading, hideLoading} = useLoading();
  const handleAttend = async () => {
    if (item.joined === 'JOINED') {
      navigation.navigate(Route.GroupHomeScreen, {
        group: item,
      });
      return;
    }
    showLoading();
    await joinGroup(token, item.id, user.id)
      .then(response => {
        dispatch(addGroup(response));
        setItem(response);
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
      })
      .finally(() => {
        hideLoading();
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    showLoading();
    await getGroupById(token, item.id)
      .then(response => {
        setItem(response);
      })
      .catch(error => {
        notify('error', {
          params: {
            description: 'Không thể lấy thông tin nhóm',
            title: 'Lỗi',
            style: {
              multiline: 100,
            },
          },
        });
      })
      .finally(() => {
        hideLoading();
        setRefreshing(false);
      });
    hideLoading();
    setRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePressLocation = () => {
    const encodedLocation = encodeURIComponent(item.locationName);
    //open google map
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`,
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
                  disabled={item.joined === 'REQUESTED'}
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
                  paddingHorizontal: scale(20),
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
                  paddingHorizontal: scale(20),
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {renderHeader()}
      <View style={{paddingHorizontal: scale(20)}}>
        <Text style={styles.textTitle2}>Danh sách thành viên</Text>
      </View>
      <View style={{paddingHorizontal: scale(20)}}>
        {item.members.map((member, index) => (
          <View
            key={member.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: scale(10),
            }}>
            <Avatar.Image
              size={60}
              source={{uri: member.imageUrl}}
              style={{marginRight: 10}}
            />
            <View style={{flex: 1}}>
              <Text style={styles.textTitle2}>{member.name}</Text>
              {index === 0 && (
                <Text style={styles.textNormal}>Trưởng nhóm</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default OrganizationPostDetail2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topImg: {
    width: '100%',
    height: verticalScale(300),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  floatBtn: {
    position: 'absolute',
    left: scale(10),
    top: scale(10),
    backgroundColor: Colors.white,
    borderRadius: scale(20),
    width: scale(40),
    height: scale(40),
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: moderateScale(20),
    fontFamily: getFontFamily('bold'),
    color: Colors.text,
    textAlign: 'center',
  },
  textLink: {
    fontSize: moderateScale(16),
    fontFamily: getFontFamily('regular'),
    color: '#3498db',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  btnJoin: {
    width: '80%',
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(16),
    flexDirection: 'row',
    borderRadius: scale(10),
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: moderateScale(16),
    fontFamily: getFontFamily('bold'),
    marginLeft: 5,
  },
  textNormal: {
    fontSize: moderateScale(16),
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  iconText: {
    width: scale(25),
    height: scale(25),
    marginRight: scale(10),
  },
  textTitle2: {
    fontSize: moderateScale(20),
    fontFamily: getFontFamily('bold'),
    color: Colors.text,
  },
});
