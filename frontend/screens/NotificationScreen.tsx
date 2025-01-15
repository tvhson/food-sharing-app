/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
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
import {useFocusEffect} from '@react-navigation/native';
import {getFontFamily} from '../utils/fonts';
import DialogRating from '../components/ui/DialogRating';

const NotificationScreen = ({navigation}: any) => {
  const notificationDatas = useSelector(
    (state: RootState) => state.notification.notifications,
  );

  const accessToken = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const [notifications, setNotificationsList] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

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
      <DialogRating
        visible={visible}
        setVisible={setVisible}
        item={selectedItem}
      />
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
        style={{marginTop: 20, marginHorizontal: 10, pointerEvents: 'none'}}
        data={notificationDatas}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          return (
            <NotificationItem
              item={item}
              navigation={navigation}
              setVisible={setVisible}
              setSelectedItem={setSelectedItem}
            />
          );
        }}
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
