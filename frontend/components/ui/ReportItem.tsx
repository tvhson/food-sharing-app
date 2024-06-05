/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import Colors from '../../global/Color';

const ReportItem = ({item, navigation}: any) => {
  function timeAgo(dateInput: Date | string | number) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error('date must be a valid Date, string, or number');
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} weeks ago`;
    }

    if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} years ago`;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('ReportDetail', {
          item: item,
        });
      }}>
      <View
        style={{
          padding: 10,
          marginVertical: 4,
          backgroundColor: 'white',
          borderRadius: 8,
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Image
          source={{uri: item.imageUrl}}
          style={{width: 100, height: 100, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: 'black',
              }}>
              {item.senderName} reported the post
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: Colors.grayText}}>
              Reason: {item.title}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {timeAgo(item.createdDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ReportItem;
