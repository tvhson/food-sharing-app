import {IconButton, RadioButton} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {banAccount, updateReport} from '../api/ReportApi';
import {useDispatch, useSelector} from 'react-redux';

import {Button} from '@rneui/themed';
import Colors from '../global/Color';
import ReportAccountItem from '../components/ui/ReportAccountItem';
import ReportOrganizationItem from '../components/ui/ReportOrganizationItem';
import ReportPostItem from '../components/ui/ReportPostItem';
import {RootState} from '../redux/Store';
import {createNotifications} from 'react-native-notificated';
import {getInfoUserById} from '../api/AccountsApi';
import {getOrganizationPostById} from '../api/OrganizationPostApi';
import {deletePost, getPostById} from '../api/PostApi';
import {updateTheReport} from '../redux/ReportReducer';
import {moderateScale, scale, verticalScale} from '../utils/scale';
import Header from '../components/ui/Header';
import {getFontFamily} from '../utils/fonts';
import {deleteGroup, getGroupById} from '../api/GroupApi';

const {useNotifications} = createNotifications();

const ReportDetailScreen = ({navigation, route}: any) => {
  const item = route.params.item;
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const location = useSelector((state: RootState) => state.location);
  const [postData, setPostData] = useState<any>(null);
  const [senderInfo, setSenderInfo] = useState<any>(null);
  const [accusedInfo, setAccusedInfo] = useState<any>(null);
  const [banDay, setBanDay] = useState<any>('1');
  const [isDeletePost, setIsDeletePost] = useState<string>('false');

  useEffect(() => {
    const getPostDetail = async () => {
      if (item && item?.type === 'POST') {
        const response: any = await getPostById(item?.linkId, accessToken);
        if (response.status === 200) {
          setPostData(response.data);
        }
      } else if (
        item &&
        item?.type === 'ORGANIZATION' &&
        item?.status === 'PENDING'
      ) {
        try {
          const response: any = await getGroupById(accessToken, item?.linkId);
          setPostData(response);
        } catch (error) {
          console.log(error);
        }
      }
    };
    const getSenderInfo = async () => {
      const response: any = await getInfoUserById(item.senderId, accessToken);
      if (response.status === 200) {
        setSenderInfo(response.data);
      }
    };
    const getAccusedInfo = async () => {
      const response: any = await getInfoUserById(item.accusedId, accessToken);
      if (response.status === 200) {
        setAccusedInfo(response.data);
      }
    };

    getPostDetail();
    getSenderInfo();
    getAccusedInfo();
  }, [accessToken, item]);

  const handleDeletePost = async () => {
    try {
      if (item.type === 'POST') {
        const response: any = await deletePost(item.linkId, accessToken);
        if (response.status !== 200) {
          notify('error', {
            params: {
              description: 'Có lỗi xảy ra khi xóa bài viết',
              title: 'Lỗi xóa bài viết',
              style: {multiline: 100},
            },
          });
        }
      } else if (item.type === 'ORGANIZATION') {
        const response: any = await deleteGroup(accessToken, item.linkId);
      }
    } catch (error) {
      notify('error', {
        params: {
          description: 'Có lỗi xảy ra khi xóa nhóm',
          title: 'Lỗi',
          style: {multiline: 100},
        },
      });
      console.log(error);
    }
  };

  const handleDone = async () => {
    if (isDeletePost === 'true') {
      await handleDeletePost();
    }

    if (banDay === '0') {
      const response: any = await updateReport(item.id, accessToken, {
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        status: 'FINISHED',
        createdDate: item.createdDate,
        linkId: item.linkId,
        note: item.note,
        type: item.type,
        senderId: item.senderId,
        accusedId: item.accusedId,
      });
      if (response.status === 200) {
        notify('success', {
          params: {
            description: 'Báo cáo đã được cập nhật',
            title: 'Báo cáo',
            style: {multiline: 100},
          },
        });
        dispatch(updateTheReport(item));
        navigation.goBack();
      } else {
        notify('error', {
          params: {
            description: response.data,
            title: 'Lỗi',
            style: {multiline: 100},
          },
        });
      }
    } else {
      const response: any = await banAccount(
        item.accusedId,
        Number(banDay),
        accessToken,
      );
      if (response.status === 200) {
        const response2: any = await updateReport(item.id, accessToken, {
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          status: 'FINISHED',
          createdDate: item.createdDate,
          linkId: item.linkId,
          note: item.note,
          type: item.type,
          senderId: item.senderId,
          accusedId: item.accusedId,
        });
        if (response2.status === 200) {
          notify('success', {
            params: {
              description: 'Báo cáo đã được cập nhật',
              title: 'Báo cáo',
              style: {multiline: 100},
            },
          });
          dispatch(updateTheReport(item));
          navigation.goBack();
        } else {
          notify('error', {
            params: {
              description: response2.data,
              title: 'Lỗi',
              style: {multiline: 100},
            },
          });
        }
      } else {
        notify('error', {
          params: {
            description: response.data,
            title: 'Lỗi',
            style: {multiline: 100},
          },
        });
      }
    }
  };
  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        flexDirection: 'column',
      }}>
      <Header title="Quản lý báo cáo" navigation={navigation} />
      <ScrollView style={{flex: 1, padding: scale(10)}}>
        {item.type === 'POST' && (
          <Text
            style={{
              fontSize: moderateScale(20),
              color: 'black',
              fontFamily: getFontFamily('bold'),
            }}>
            Bài viết bị báo cáo
          </Text>
        )}
        {item.type === 'ORGANIZATION' && item.status === 'PENDING' && (
          <Text
            style={{
              fontSize: moderateScale(20),
              color: 'black',
              fontFamily: getFontFamily('bold'),
            }}>
            Nhóm bị báo cáo
          </Text>
        )}
        {postData && item.type === 'POST' ? (
          <ReportPostItem
            item={postData}
            navigation={navigation}
            location={location}
          />
        ) : postData &&
          item.type === 'ORGANIZATION' &&
          item.status === 'PENDING' ? (
          <ReportOrganizationItem item={postData} navigation={navigation} />
        ) : null}
        <Text
          style={{
            fontSize: moderateScale(20),
            color: 'black',
            fontFamily: getFontFamily('bold'),
          }}>
          Người báo cáo
        </Text>
        {senderInfo ? (
          <ReportAccountItem item={senderInfo} isReport={true} />
        ) : null}
        <Text
          style={{
            fontSize: moderateScale(20),
            color: 'black',
            fontFamily: getFontFamily('bold'),
          }}>
          Người bị báo cáo
        </Text>
        {accusedInfo ? (
          <ReportAccountItem item={accusedInfo} isReport={true} />
        ) : null}
        <Text
          style={{
            fontSize: moderateScale(20),
            color: 'black',
            fontFamily: getFontFamily('bold'),
          }}>
          Lý do báo cáo
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            padding: scale(10),
            borderRadius: scale(8),
            marginTop: scale(5),
          }}>
          <Text
            style={{
              fontSize: moderateScale(16),
              color: 'black',
            }}>
            {item.title === 'Khác' ? item.description : item.title}
          </Text>
        </View>
        {item.status === 'PENDING' ? (
          <>
            <Text
              style={{
                fontSize: moderateScale(20),
                color: 'black',
                fontFamily: getFontFamily('bold'),
              }}>
              {item.type === 'POST' ? 'Xóa bài viết' : 'Xóa nhóm'}
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                padding: scale(10),
                borderRadius: scale(8),
                marginTop: scale(5),
              }}>
              <RadioButton.Group
                onValueChange={newValue => setIsDeletePost(newValue)}
                value={isDeletePost}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="true" />
                  <Text>
                    {item.type === 'POST' ? 'Xóa bài viết' : 'Xóa nhóm'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="false" />
                  <Text>
                    {item.type === 'POST'
                      ? 'Không xóa bài viết'
                      : 'Không xóa nhóm'}
                  </Text>
                </View>
              </RadioButton.Group>
            </View>
            <Text
              style={{
                fontSize: moderateScale(20),
                color: 'black',
                fontFamily: getFontFamily('bold'),
              }}>
              Khóa tài khoản
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                padding: scale(10),
                borderRadius: scale(8),
                marginTop: scale(5),
              }}>
              <RadioButton.Group
                onValueChange={newValue => setBanDay(newValue)}
                value={banDay}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="1" />
                  <Text>1 ngày</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="7" />
                  <Text>1 tuần</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="14" />
                  <Text>2 tuần</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="30" />
                  <Text>1 tháng</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="90" />
                  <Text>3 tháng</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="180" />
                  <Text>6 tháng</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="365" />
                  <Text>1 năm</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RadioButton value="0" />
                  <Text>Không khóa</Text>
                </View>
              </RadioButton.Group>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(20),
              }}>
              <Button
                title={'Hủy'}
                buttonStyle={{
                  backgroundColor: Colors.grayText,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: scale(10),
                  paddingHorizontal: scale(45),
                  width: scale(150),
                }}
                onPress={() => navigation.goBack()}
                titleStyle={{
                  fontFamily: getFontFamily('bold'),
                  fontSize: moderateScale(18),
                }}
              />
              <Button
                title={'Xong'}
                buttonStyle={{
                  backgroundColor: Colors.greenPrimary,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  width: scale(150),
                  borderRadius: scale(10),
                  paddingHorizontal: scale(45),
                }}
                onPress={handleDone}
                titleStyle={{
                  fontFamily: getFontFamily('bold'),
                  fontSize: moderateScale(18),
                }}
              />
            </View>
          </>
        ) : null}
        <View style={{height: verticalScale(40)}} />
      </ScrollView>
    </View>
  );
};
export default ReportDetailScreen;
