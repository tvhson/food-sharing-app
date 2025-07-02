import React from 'react';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import Colors from '../../global/Color';
import {moderateScale, scale} from '../../utils/scale';
import {getFontFamily} from '../../utils/fonts';
import {timeAgo} from '../../utils/helper';

const ReportItem = ({item, navigation}: any) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('ReportDetail', {
          item: item,
        });
      }}>
      <View
        style={{
          padding: scale(10),
          marginVertical: scale(4),
          backgroundColor: 'white',
          borderRadius: scale(8),
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Image
          source={{uri: item.imageUrl}}
          style={{
            width: scale(100),
            height: scale(100),
            borderRadius: scale(8),
          }}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: scale(8)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: moderateScale(22),
                fontFamily: getFontFamily('bold'),
                color: Colors.black,
              }}>
              {item.senderName} báo cáo bài viết
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: moderateScale(16), color: Colors.grayText}}>
              Lý do: {item.title}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text
                style={{fontSize: moderateScale(12), color: Colors.grayText}}>
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
