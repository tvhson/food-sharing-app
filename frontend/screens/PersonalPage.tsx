import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import Colors from '../global/Color';
import EditProfileScreen from './EditProfileScreen';
import ListPost from '../components/ui/PersonalPageUI/ListPost';
import {RootState} from '../redux/Store';
import {TabView} from 'react-native-tab-view';
import {UserInfo} from '../redux/UserReducer';
import {getFontFamily} from '../utils/fonts';
import screenWidth from '../global/Constant';
import {useSelector} from 'react-redux';

/* eslint-disable @typescript-eslint/no-shadow */

const PersonalPage = ({navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [index, setIndex] = useState(0);
  const routes = [
    {key: 'first', title: 'Bài viết'},
    {key: 'second', title: 'Hội nhóm'},
  ];
  const [isEditVisible, setIsEditVisible] = useState(false);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const renderHeader = (userInfo: UserInfo) => {
    return (
      <View>
        <View style={[styles.row, {paddingTop: 20, paddingHorizontal: 16}]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.avaContainer}>
              <Image
                source={
                  userInfo.imageUrl
                    ? {uri: userInfo.imageUrl}
                    : require('../assets/images/user.png')
                }
                style={{width: 66, height: 66, borderRadius: 33}}
              />

              <TouchableOpacity style={styles.floatBtnChangeAva}>
                <Image
                  source={require('../assets/images/camera.png')}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.btnEdit}
          onPress={() => setIsEditVisible(true)}>
          <Image
            source={require('../assets/images/edit-white.png')}
            style={{width: (576 * 20) / 512, height: 20}}
          />
          <Text style={styles.textBtnEdit}>Chỉnh sửa thông tin cá nhân</Text>
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
      <EditProfileScreen
        isVisible={isEditVisible}
        setVisible={setIsEditVisible}
        userInfo={userInfo}
        token={accessToken}
      />
      {renderHeader(userInfo)}
      <TabView
        navigationState={{index, routes}}
        renderScene={({route}) => {
          switch (route.key) {
            case 'first':
              return (
                <ListPost
                  type="POST"
                  otherId={userInfo.id}
                  navigation={navigation}
                />
              );
            case 'second':
              return (
                <ListPost
                  type="OPOST"
                  otherId={userInfo.id}
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

export default PersonalPage;

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
    width: screenWidth * 0.65,
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
