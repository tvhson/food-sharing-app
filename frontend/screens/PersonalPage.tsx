import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {UserInfo, saveUser} from '../redux/UserReducer';
import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import EditProfileScreen from './EditProfileScreen';
import ListPost from '../components/ui/PersonalPageUI/ListPost';
import {RootState} from '../redux/Store';
import {TabView} from 'react-native-tab-view';
import UploadPhoto from '../components/ui/UploadPhoto';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../utils/fonts';
import screenWidth from '../global/Constant';
import {updateUser} from '../api/AccountsApi';
import {uploadPhoto} from '../api/UploadPhotoApi';

const {useNotifications} = createNotifications();

const PersonalPage = ({navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const {notify} = useNotifications();
  const [index, setIndex] = useState(0);
  const routes = [
    {key: 'first', title: 'Bài viết'},
    {key: 'second', title: 'Hội nhóm'},
  ];
  const dispatch = useDispatch();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(userInfo.imageUrl);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const myPosts = useSelector((state: RootState) => state.sharingPost.MyPosts);
  const [numberOfGroup, setNumberOfGroup] = useState(0);
  const [numberOfPost, setNumberOfPost] = useState(0);
  const postImage = (image: any) => {
    const dataForm = new FormData();
    dataForm.append('file', {
      uri: image.path,
      name: image.filename || 'image.jpeg',
      type: image.mime || 'image/jpeg',
    });
    uploadPhoto(dataForm, accessToken).then((response: any) => {
      if (response.status === 200) {
        const imageUrlString = response.data[0];
        setImageUrl(imageUrlString);
        updateUser(
          {
            imageUrl: response.data[0],
            email: userInfo.email,
            name: userInfo.name,
            bannedDate: userInfo.bannedDate,
            birthDate: userInfo.birthDate,
            description: userInfo.description,
            phone: userInfo.phone,
            status: userInfo.status,
            latitude: userInfo.latitude,
            longitude: userInfo.longitude,
            locationName: userInfo.locationName,
          },
          accessToken,
        )
          .then((response2: any) => {
            //console.log(response2);
            if (response2.status === 200) {
              const userInfo2: any = response2.data;
              dispatch(saveUser(userInfo2));
              notify('success', {
                params: {
                  description: 'Cập nhật ảnh đại diện thành công.',
                  title: 'Thành công',
                  style: {
                    multiline: 100,
                  },
                },
              });
            } else {
              notify('error', {
                params: {
                  description: 'Cập nhật ảnh đại diện thất bại.',
                  title: 'Lỗi',
                  style: {
                    multiline: 100,
                  },
                },
              });
            }
          })
          .catch((error: any) => {
            notify('error', {
              params: {
                description: error.message,
                title: 'Error',
                style: {multiline: 100},
              },
            });
          });
        return response.data;
      } else {
        notify('error', {
          params: {
            description: 'Cập nhật ảnh đại diện thất bại.',
            title: 'Lỗi',
          },
        });
      }
    });
  };

  const renderHeader = (userInfo: UserInfo) => {
    return (
      <View>
        <View style={[styles.row, {paddingTop: 20, paddingHorizontal: 16}]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.avaContainer}>
              <Image
                source={
                  imageUrl
                    ? {uri: imageUrl}
                    : require('../assets/images/user.png')
                }
                style={{width: 66, height: 66, borderRadius: 33}}
              />

              <TouchableOpacity
                style={styles.floatBtnChangeAva}
                onPress={() => setIsUploadVisible(true)}>
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
            <Text style={styles.textNumberStat}>{numberOfPost}</Text>
            <Text style={styles.textSection1}>bài viết</Text>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.textNumberStat}>{numberOfGroup}</Text>
            <Text style={styles.textSection1}>Hội nhóm </Text>
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
    <SafeAreaView style={styles.container}>
      <EditProfileScreen
        isVisible={isEditVisible}
        setVisible={setIsEditVisible}
      />
      <UploadPhoto
        isVisible={isUploadVisible}
        setVisible={setIsUploadVisible}
        isCircle={true}
        postImage={postImage}
        title="Thay đổi ảnh đại diện"
        subtitle="Chọn ảnh từ thư viện hoặc chụp ảnh mới"
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
                  setNumberOfPost={setNumberOfPost}
                />
              );
            case 'second':
              return (
                <ListPost
                  type="OPOST"
                  otherId={userInfo.id}
                  navigation={navigation}
                  setNumberOfGroup={setNumberOfGroup}
                />
              );
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
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
