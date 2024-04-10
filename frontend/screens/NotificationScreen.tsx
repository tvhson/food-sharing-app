/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList} from 'react-native';

const data = [
  {
    id: '1',
    title: 'New Message',
    description: 'You have a new message from John Doe.',
  },
  {
    id: '2',
    title: 'New Message',
    description: 'You have a new message from Jane Doe.',
  },
  {
    id: '3',
    title: 'New Message',
    description: 'You have a new message from John Doe.',
  },
  {
    id: '4',
    title: 'New Message',
    description: 'You have a new message from Jane Doe.',
  },
];

const NotificationScreen = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        marginTop: 10,
        paddingHorizontal: 10,
      }}></View>
  );
};

export default NotificationScreen;
