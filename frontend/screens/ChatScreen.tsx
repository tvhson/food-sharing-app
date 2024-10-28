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
import {Image, SearchBar} from '@rneui/themed';
import ChatRoomItem from '../components/ui/ChatRoomItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getRoomChats} from '../api/ChatApi';
import {clearChatRooms, setChatRooms} from '../redux/ChatRoomReducer';
import {useFocusEffect} from '@react-navigation/native';
import {getFontFamily} from '../utils/fonts';

const ChatScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const accessToken = useSelector((state: RootState) => state.token.key);
  const myId = useSelector((state: RootState) => state.userInfo.id);
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
  const onRefresh = useCallback(() => {
    const saveChatRoom = async () => {
      if (accessToken) {
        getRoomChats(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            console.log(response.data);
            setChatRoom(response.data);
            dispatch(setChatRooms({chatRooms: response.data, myId: myId}));
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    dispatch(clearChatRooms());
    saveChatRoom();
    setCurrentPage(0);
    setRefreshing(false);
  }, [accessToken, dispatch, myId]);
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
            dispatch(setChatRooms({chatRooms: response.data, myId: myId}));
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
  }, [dispatch, accessToken, chatRooms, myId]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh]),
  );
  useEffect(() => {
    if (search === '') {
      setChatRoom(chatRooms);
    } else {
      const filteredData = chatRooms.filter(item => {
        if (item.senderId === myId) {
          return item.recipientName
            .toLowerCase()
            .includes(search.toLowerCase());
        } else if (item.recipientId === myId) {
          return item.senderName.toLowerCase().includes(search.toLowerCase());
        }
        return false;
      });
      setChatRoom(filteredData);
    }
  }, [search, chatRooms, myId]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <SearchBar
        inputStyle={{fontFamily: getFontFamily('regular')}}
        placeholder="Tìm kiếm"
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
        data={chatRoom ?? chatRooms}
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
