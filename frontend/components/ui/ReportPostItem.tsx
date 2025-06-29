import {Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import Colors from '../../global/Color';
import getDistance from 'geolib/es/getDistance';
import {Route} from '../../constants/route';
import {calculateExpiredDate, timeAgo} from '../../utils/helper';
import {moderateScale, scale} from '../../utils/scale';
import {getFontFamily} from '../../utils/fonts';

const ReportPostItem = ({item, navigation, location}: any) => {
  const handleOnPress = () => {
    navigation.navigate(Route.PostDetail2, {
      item: {
        ...item,
        distance: distance,
      },
      location,
      createdDate: timeAgo(item.createdDate),
      expiredString: calculateExpiredDate(new Date(item.expiredDate)),
    });
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
          padding: scale(10),
          marginVertical: scale(4),
          backgroundColor: 'white',
          borderRadius: scale(8),
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Image
          source={{
            uri: item.images[0]
              ? item.images[0]
              : 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={{
            width: scale(150),
            height: scale(150),
            borderRadius: scale(8),
          }}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: scale(8)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: moderateScale(22),
                fontFamily: getFontFamily('bold'),
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
              <Text
                style={{fontSize: moderateScale(12), color: Colors.grayText}}>
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
              <Text
                style={{fontSize: moderateScale(16), color: Colors.grayText}}>
                <Text
                  style={{fontFamily: getFontFamily('bold'), color: 'black'}}>
                  {'\u2022'} Mô tả:{' '}
                </Text>
                {item.description}
              </Text>
              <Text
                style={{fontSize: moderateScale(16), color: Colors.grayText}}>
                <Text
                  style={{fontFamily: getFontFamily('bold'), color: 'black'}}>
                  {'\u2022'} Hạn sử dụng:{' '}
                </Text>
                {new Date(item.expiredDate).toLocaleDateString()}
              </Text>
              <Text
                style={{fontSize: moderateScale(16), color: Colors.grayText}}>
                <Text
                  style={{fontFamily: getFontFamily('bold'), color: 'black'}}>
                  {'\u2022'} Ngày bắt đầu nhận:{' '}
                </Text>
                {new Date(item.pickUpStartDate).toLocaleDateString()}
              </Text>
              <Text
                style={{fontSize: moderateScale(16), color: Colors.grayText}}>
                <Text
                  style={{fontFamily: getFontFamily('bold'), color: 'black'}}>
                  {'\u2022'} Ngày kết thúc nhận:{' '}
                </Text>
                {new Date(item.pickUpEndDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text
                style={{fontSize: moderateScale(12), color: Colors.grayText}}>
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
