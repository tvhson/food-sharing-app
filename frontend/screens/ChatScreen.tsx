/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Colors from '../global/Color';
import {Image, SearchBar} from '@rneui/themed';
import ChatRoomItem from '../components/ui/ChatRoomItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getRoomChats} from '../api/ChatApi';
import {setChatRooms} from '../redux/ChatRoomReducer';

const ChatScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const accessToken = useSelector((state: RootState) => state.token.key);
  const chatRooms = useSelector((state: RootState) => state.chatRoom.chatRooms);
  const [chatRoom, setChatRoom] = useState(chatRooms);

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
    const saveChatRoom = async () => {
      if (accessToken) {
        getRoomChats(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            console.log(response.data);
            setChatRoom(response.data);
            dispatch(setChatRooms(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    dispatch(setChatRooms([]));
    saveChatRoom();
    setCurrentPage(0);
    setRefreshing(false);
  };
  const updateSearch = (message: any) => {
    setSearch(message);
  };
  useEffect(() => {
    const saveChatRoom = async () => {
      if (chatRooms) {
        setChatRoom(chatRooms);
      } else if (accessToken) {
        getRoomChats(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            console.log(response.data);
            setChatRoom(response.data);
            dispatch(setChatRooms(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await saveChatRoom();
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, accessToken, chatRooms]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
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
          Messages
        </Text>
      </View>
      <SearchBar
        placeholder="Search user by name"
        containerStyle={{
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }}
        inputContainerStyle={{
          backgroundColor: 'white',
        }}
        round
        onChangeText={updateSearch}
        value={search}
      />
      <FlatList
        style={{marginHorizontal: 8}}
        data={chatRoom}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ChatRoomItem item={item} navigation={navigation} />
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

export default ChatScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
