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
  setNotifications,
  setReadAllNotifications,
} from '../redux/NotificationReducer';
import {getNotifications, readAllNotifications} from '../api/NotificationApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Image} from '@rneui/themed';
import {useFocusEffect} from '@react-navigation/native';
import {notificationItems} from '../components/data/PostData';
import {getFontFamily} from '../utils/fonts';

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
            setNotificationsList(response.data);
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
      const readAll = async () => {
        dispatch(setReadAllNotifications());
        if (accessToken) {
          readAllNotifications(accessToken.toString()).catch((error: any) => {
            console.log('Error when calling readAllNotifications:', error);
          });
        }
      };
      readAll();
      return readAll;
    }, [accessToken, dispatch]),
  );

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        flexDirection: 'column',
      }}>
      <View style={{backgroundColor: 'white', padding: 10, height: 50}}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors.greenText,
            fontFamily: getFontFamily('bold'),
          }}>
          Thông báo
        </Text>
      </View>

      <FlatList
        style={{marginTop: 20, marginHorizontal: 10}}
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
          !isLoading ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 500,
              }}>
              <Image
                source={require('../assets/images/BgNoNotification.png')}
                style={{width: 300, height: 400}}
              />
            </View>
          ) : null
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
