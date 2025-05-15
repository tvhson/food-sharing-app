/* eslint-disable @typescript-eslint/no-unused-vars */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import Colors from '../global/Color';
import {Icon} from 'react-native-paper';
import ListPost from '../components/ui/PersonalPageUI/ListPost';
import {RootState} from '../redux/Store';
import {TabView} from 'react-native-tab-view';
import {getFontFamily} from '../utils/fonts';
import {getInfoUserById} from '../api/AccountsApi';
import {getRoomChats} from '../api/ChatApi';
import screenWidth from '../global/Constant';
import {useLoading} from '../utils/LoadingContext';
import {useSelector} from 'react-redux';

const PersonalPageOfOther = ({navigation, route}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const {showLoading, hideLoading} = useLoading();

  const otherId = route.params.id;
  const [otherInfo, setOtherInfo] = useState<any>();
  const [roomChat, setRoomChat] = useState();

  const [index, setIndex] = useState(0);
  const routes = [
    {key: 'first', title: 'Bài viết'},
    {key: 'second', title: 'Hội nhóm'},
  ];
  const accessToken = useSelector((state: RootState) => state.token.key);

  useEffect(() => {
    const getOtherInfo = async () => {
      showLoading();
      const response: any = await getInfoUserById(otherId, accessToken);
      if (response.status === 200) {
        setOtherInfo(response.data);
        getRoomChats(accessToken.toString())
          .then((response2: any) => {
            if (response2.status === 200) {
              const roomChats = response2.data;
              const roomChatFind = roomChats.find(
                (room: any) =>
                  (room.senderId === userInfo.id &&
                    room.recipientId === response.data.id) ||
                  (room.senderId === response.data.id &&
                    room.recipientId === userInfo.id),
              );
              setRoomChat(roomChatFind);
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            hideLoading();
            console.log(error);
          });
      } else {
        hideLoading();
        console.log('error');
      }
    };

    const fetchData = async () => {
      await getOtherInfo();
    };
    fetchData();
  }, [accessToken, otherId]);

  const handleNavigate = () => {
    if (roomChat) {
      navigation.navigate('ChatRoom', {item: roomChat});
    } else {
      if (!userInfo || !otherInfo) {
        return;
      }
      navigation.navigate('ChatRoom', {
        item: {
          senderProfilePic: userInfo.imageUrl,
          recipientProfilePic: otherInfo.imageUrl,
          senderId: userInfo.id,
          recipientId: otherInfo.id,
          senderName: userInfo.name,
          recipientName: otherInfo.name,
        },
      });
    }
  };

  const renderHeader = (userInfo: any) => {
    if (!userInfo) {
      return null;
    }
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 20,
            paddingHorizontal: 16,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source={'arrow-left'} size={30} color={Colors.grayText} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontFamily: getFontFamily('bold'),
              marginLeft: 10,
              color: Colors.text,
              textTransform: 'capitalize',
              textAlign: 'center',
              flex: 1,
              marginRight: 30,
            }}>
            {userInfo.name}
          </Text>
        </View>
        <View style={[styles.row]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.avaContainer}>
              <Image
                source={
                  userInfo?.imageUrl
                    ? {uri: userInfo.imageUrl}
                    : require('../assets/images/user.png')
                }
                style={{width: 66, height: 66, borderRadius: 33}}
              />
            </View>
            <Text style={styles.textName}>{userInfo.name}</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textNumberStat}>0</Text>
            <Text style={styles.textSection1}>bài viết</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textNumberStat}>0</Text>
            <Text style={styles.textSection1}>đã nhận</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textNumberStat}>0</Text>
            <Text style={styles.textSection1}>sự kiện </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.btnEdit} onPress={handleNavigate}>
          <Icon source={'chat'} size={30} color={Colors.white} />
          <Text style={styles.textBtnEdit}>Nhắn tin</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTabBar = (props: any) => {
    const routes = props.navigationState.routes;
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: Colors.gray,
        }}>
        <View style={{flexDirection: 'row', flex: 1}}>
          {routes.map((route: any, index: number) => {
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderBottomColor:
                    props.navigationState.index === index
                      ? Colors.greenPrimary
                      : 'transparent',
                  borderBottomWidth: 3,
                }}
                key={index}
                onPress={() => {
                  props.jumpTo(route.key);
                }}>
                <Text
                  style={{
                    color:
                      props.navigationState.index === index ? 'black' : 'gray',
                    padding: 8,
                    fontSize: 16,
                    fontFamily: getFontFamily('bold'),
                  }}>
                  {route.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader(otherInfo)}
      <TabView
        navigationState={{index, routes}}
        renderScene={({route}) => {
          switch (route.key) {
            case 'first':
              return (
                <ListPost
                  type="POST"
                  otherId={otherId}
                  navigation={navigation}
                />
              );
            case 'second':
              return (
                <ListPost
                  type="OPOST"
                  otherId={otherId}
                  navigation={navigation}
                />
              );
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default PersonalPageOfOther;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
  },
  avaContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatBtnChangeAva: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    position: 'absolute',
    backgroundColor: Colors.greenPrimary,
    bottom: 0,
    right: 0,
  },
  textName: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 10,
    fontFamily: getFontFamily('semibold'),
  },
  textNumberStat: {
    fontSize: 18,
    color: Colors.text,
    fontFamily: getFontFamily('semibold'),
  },
  textSection1: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: getFontFamily('regular'),
  },
  textBtnEdit: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: getFontFamily('regular'),
    marginLeft: 5,
  },
  btnEdit: {
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 5,
    width: screenWidth * 0.5,
    backgroundColor: Colors.greenPrimary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
