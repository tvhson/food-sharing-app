/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Colors from '../global/Color';
import NotificationItem from '../components/ui/NotificationItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {
  clearNotifications,
  clearNumberOfUnread,
  countNumberOfUnread,
  setNotifications,
  setReadAllNotifications,
} from '../redux/NotificationReducer';
import {getNotifications, readAllNotifications} from '../api/NotificationApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Image} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';

const newData = [
  {
    id: '5',
    title: 'New Message',
    image: 'https://randomuser.me/api/portraits/men/37.jpg',
    description: 'You have a new message from Mike Doe.',
    type: 'message',
    createdAt: '2022-01-01',
  },
  {
    id: '6',
    title: 'New Message',
    image: 'https://randomuser.me/api/portraits/men/38.jpg',
    description: 'You have a new message from Steve Doe.',
    type: 'message',
    createdAt: '2022-01-02',
  },
  {
    id: '7',
    title: 'New Message',
    image: 'https://randomuser.me/api/portraits/men/39.jpg',
    description: 'You have a new message from Bob Doe.',
    type: 'message',
    createdAt: '2022-01-03',
  },
  {
    id: '8',
    title: 'New Message',
    image: 'https://randomuser.me/api/portraits/men/40.jpg',
    description: 'You have a new message from Tom Doe.',
    type: 'message',
    createdAt: '2022-01-04',
  },
  {
    id: '9',
    title: 'New Message',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    description: 'You have a new message from Jerry Doe.',
    type: 'message',
    createdAt: '2022-01-05',
  },
];

const NotificationScreen = ({navigation}: any) => {
  const notificationDatas = useSelector(
    (state: RootState) => state.notification.notifications,
  );
  const accessToken = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const [notifications, setNotificationsList] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };
  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };
  const onRefresh = () => {
    const saveNotifications = async () => {
      if (accessToken) {
        getNotifications(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            console.log(response.data);
            AsyncStorage.setItem(
              'notifications',
              JSON.stringify(response.data),
            );
            setNotifications(response.data);
            dispatch(setNotifications(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    dispatch(clearNotifications());
    saveNotifications();
    setCurrentPage(0);
    setRefreshing(false);
  };

  useEffect(() => {
    const saveNotifications = async () => {
      if (notificationDatas) {
        setNotificationsList(notificationDatas);
      } else if (accessToken) {
        getNotifications(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            AsyncStorage.setItem(
              'notifications',
              JSON.stringify(response.data),
            );
            setNotifications(response.data);
            dispatch(setNotifications(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await saveNotifications();
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, accessToken, notificationDatas]);

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect callback is running'); // Add this line
      const readAll = async () => {
        console.log('readAll function is running'); // Add this line
        dispatch(setReadAllNotifications());
        if (accessToken) {
          console.log('accessToken is defined'); // Add this line
          readAllNotifications(accessToken.toString()).catch((error: any) => {
            console.log('Error when calling readAllNotifications:', error);
          });
        }
      };
      readAll();
    }, [accessToken, dispatch]),
  );

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
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Notifications
        </Text>
      </View>
      <FlatList
        style={{marginHorizontal: 8}}
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <NotificationItem item={item} navigation={navigation} />
        )}
        onEndReached={() => {
          if (!isLoading) {
            loadMoreItem();
          }
        }}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => renderLoader()}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 500,
            }}>
            <Image
              source={require('../assets/images/BgNoPost..png')}
              style={{width: 300, height: 400}}
            />
          </View>
        }
      />
    </View>
  );
};

export default NotificationScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
