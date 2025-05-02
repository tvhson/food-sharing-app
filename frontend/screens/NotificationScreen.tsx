import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  clearNotifications,
  setNotifications,
  setReadAllNotifications,
} from '../redux/NotificationReducer';
import {getNotifications, readAllNotifications} from '../api/NotificationApi';
import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import DialogRating from '../components/ui/DialogRating';
import NotificationItem from '../components/ui/NotificationItem';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {useFocusEffect} from '@react-navigation/native';

const NotificationScreen = ({navigation}: any) => {
  const notificationDatas = useSelector(
    (state: RootState) => state.notification.notifications,
  );

  const accessToken = useSelector((state: RootState) => state.token.key);

  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
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
    setRefreshing(false);
  };

  useEffect(() => {
    const saveNotifications = async () => {
      if (accessToken) {
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
