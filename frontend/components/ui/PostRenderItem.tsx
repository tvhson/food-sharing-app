/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {Icon, Image} from '@rneui/themed';
import Colors from '../../global/Color';

const PostRenderItem = ({item, navigation, location}: any) => {
  const handleOnPress = () => {
    navigation.navigate('PostDetail', {item, location});
  };
  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
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
          source={{uri: item.image}}
          style={{width: 150, height: 150, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: Colors.postTitle,
              }}>
              {item.title}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="location-sharp"
                type="ionicon"
                size={14}
                color="black"
              />
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                ${item.distance}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: Colors.grayText}}>
              {item.description}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {item.createAt}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default PostRenderItem;
