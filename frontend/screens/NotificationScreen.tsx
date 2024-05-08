/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList} from 'react-native';
import Colors from '../global/Color';
import NotificationItem from '../components/ui/NotificationItem';

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
        data={newData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <NotificationItem item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default NotificationScreen;
