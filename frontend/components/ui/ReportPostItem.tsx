/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import Colors from '../../global/Color';
import getDistance from 'geolib/es/getDistance';

const ReportPostItem = ({item, navigation, location}: any) => {
  const handleOnPress = () => {
    navigation.navigate('PostDetail', {item, location});
  };
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    const getDistanceFromLocation = async () => {
      if (location && location.latitude && location.longitude) {
        setDistance(
          getDistance(
            {latitude: item.latitude, longitude: item.longitude},
            {latitude: location.latitude, longitude: location.longitude},
          ) / 1000,
        );
      }
    };
    getDistanceFromLocation();
  }, [item.latitude, item.longitude, location]);

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
          source={{
            uri: item.images[0]
              ? item.images[0]
              : 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={{width: 150, height: 150, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
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
                {distance < 0.1
                  ? `${(distance * 1000).toFixed(0)} m`
                  : `${distance.toFixed(2)} Km`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Mô tả:{' '}
                </Text>
                {item.description}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Hạn sử dụng:{' '}
                </Text>
                {new Date(item.expiredDate).toLocaleDateString()}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Ngày bắt đầu nhận:{' '}
                </Text>
                {new Date(item.pickUpStartDate).toLocaleDateString()}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Ngày kết thúc nhận:{' '}
                </Text>
                {new Date(item.pickUpEndDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {new Date(item.createdDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default ReportPostItem;
