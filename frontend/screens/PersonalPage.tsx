/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';
import screenWidth from '../global/Constant';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {UserInfo} from '../redux/UserReducer';

const PersonalPage = ({navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  console.log(userInfo);

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
        <TouchableOpacity style={styles.btnEdit}>
          <Image
            source={require('../assets/images/edit-white.png')}
            style={{width: (576 * 20) / 512, height: 20}}
          />
          <Text style={styles.textBtnEdit}>Chỉnh sửa thông tin cá nhân</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return <View style={styles.container}>{renderHeader(userInfo)}</View>;
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
});
