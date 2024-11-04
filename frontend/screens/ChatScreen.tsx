/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import Colors from '../global/Color';
import {Image, SearchBar} from '@rneui/themed';
import ChatRoomItem from '../components/ui/ChatRoomItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getRoomChats} from '../api/ChatApi';
import {clearChatRooms, setChatRooms} from '../redux/ChatRoomReducer';
import {useFocusEffect} from '@react-navigation/native';
import {getFontFamily} from '../utils/fonts';
import Header from '../components/ui/Header';

const ChatScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const accessToken = useSelector((state: RootState) => state.token.key);
  const myId = useSelector((state: RootState) => state.userInfo.id);
  const chatRooms = useSelector((state: RootState) => state.chatRoom.chatRooms);
  const [chatRoom, setChatRoom] = useState(chatRooms);

  const onRefresh = useCallback(() => {
    const saveChatRoom = async () => {
      if (accessToken) {
        getRoomChats(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            dispatch(clearChatRooms());
            setChatRoom(response.data);
            dispatch(setChatRooms({chatRooms: response.data, myId: myId}));
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    saveChatRoom();
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
            setChatRoom(response.data);
            dispatch(setChatRooms({chatRooms: response.data, myId: myId}));
          } else {
            console.log(response);
          }
        });
      }
    };
    const fetchData = async () => {
      await saveChatRoom();
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
      <Header title="Nhắn tin" navigation={navigation} />
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default ChatScreen;
