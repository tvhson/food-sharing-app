import {IconButton, RadioButton} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {banAccount, updateReport} from '../api/ReportApi';
import {useDispatch, useSelector} from 'react-redux';

/* eslint-disable react-native/no-inline-styles */
import {Button} from '@rneui/themed';
import Colors from '../global/Color';
import ReportAccountItem from '../components/ui/ReportAccountItem';
import ReportOrganizationItem from '../components/ui/ReportOrganizationItem';
import ReportPostItem from '../components/ui/ReportPostItem';
import {RootState} from '../redux/Store';
import {createNotifications} from 'react-native-notificated';
import {getInfoUserById} from '../api/AccountsApi';
import {getOrganizationPostById} from '../api/OrganizationPostApi';
import {getPostById} from '../api/PostApi';
import {updateTheReport} from '../redux/ReportReducer';

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

  useEffect(() => {
    const getPostDetail = async () => {
      if (item && item.type === 'POST') {
        const response: any = await getPostById(item.linkId, accessToken);
        if (response.status === 200) {
          setPostData(response.data);
        }
      } else {
        const response: any = await getOrganizationPostById(
          item.linkId,
          accessToken,
        );
        if (response.status === 200) {
          setPostData(response.data);
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
  const handleDone = async () => {
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
            description: 'Report has been updated',
            title: 'Report',
            style: {multiline: 100},
          },
        });
        dispatch(updateTheReport(item));
        navigation.goBack();
      } else {
        notify('error', {
          params: {
            description: response.data,
            title: 'Report',
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
              description: 'Report has been updated',
              title: 'Report',
              style: {multiline: 100},
            },
          });
          dispatch(updateTheReport(item));
          navigation.goBack();
        } else {
          notify('error', {
            params: {
              description: response2.data,
              title: 'Report',
              style: {multiline: 100},
            },
          });
        }
      } else {
        notify('error', {
          params: {
            description: response.data,
            title: 'Report',
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
      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: Colors.button,
          borderBottomWidth: 1,
          borderBlockColor: '#ccc',
          justifyContent: 'center',

          alignItems: 'center',
        }}>
        <View style={{position: 'absolute', top: -1, left: 10}}>
          <IconButton
            icon="chevron-left"
            size={40}
            iconColor="white"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Quản lý báo cáo
        </Text>
      </View>
      <ScrollView style={{flex: 1, padding: 10}}>
        <Text style={{fontSize: 20, color: 'black', fontWeight: '500'}}>
          Bài viết bị báo cáo
        </Text>
        {postData && item.type === 'POST' ? (
          <ReportPostItem
            item={postData}
            navigation={navigation}
            location={location}
          />
        ) : postData && item.type === 'ORGANIZATIONPOST' ? (
          <ReportOrganizationItem
            item={postData}
            navigation={navigation}
            location={location}
          />
        ) : null}
        <Text style={{fontSize: 20, color: 'black', fontWeight: '500'}}>
          Người báo cáo
        </Text>
        {senderInfo ? (
          <ReportAccountItem item={senderInfo} isReport={true} />
        ) : null}
        <Text style={{fontSize: 20, color: 'black', fontWeight: '500'}}>
          Người bị báo cáo
        </Text>
        {accusedInfo ? (
          <ReportAccountItem item={accusedInfo} isReport={true} />
        ) : null}
        <Text style={{fontSize: 20, color: 'black', fontWeight: '500'}}>
          Lý do báo cáo
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 8,
            marginTop: 5,
          }}>
          <Text style={{fontSize: 16, color: 'black'}}>
            {item.title === 'Other' ? item.description : item.title}
          </Text>
        </View>
        {item.status === 'PENDING' ? (
          <>
            <Text style={{fontSize: 20, color: 'black', fontWeight: '500'}}>
              Khóa tài khoản
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 8,
                marginTop: 5,
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
                marginTop: 20,
              }}>
              <Button
                title={'Hủy'}
                buttonStyle={{
                  backgroundColor: Colors.grayText,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 10,
                  paddingHorizontal: 45,
                  width: 150,
                }}
                onPress={() => navigation.goBack()}
                titleStyle={{fontWeight: '700', fontSize: 18}}
              />
              <Button
                title={'Xong'}
                buttonStyle={{
                  backgroundColor: Colors.greenPrimary,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  width: 150,
                  borderRadius: 10,
                  paddingHorizontal: 45,
                }}
                onPress={handleDone}
                titleStyle={{fontWeight: '700', fontSize: 18}}
              />
            </View>
          </>
        ) : null}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
};
export default ReportDetailScreen;
