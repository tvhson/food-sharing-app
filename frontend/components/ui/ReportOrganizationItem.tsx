/* eslint-disable react-native/no-inline-styles */
import {Linking, Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import Colors from '../../global/Color';
import getDistance from 'geolib/es/getDistance';

const ReportOrganizationItem = ({item, navigation, location}: any) => {
  const handleOnPress = () => {
    navigation.navigate('OrganizationPostDetail', {item, location});
  };
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    const getDistanceFromLocation = async () => {
      if (location && location.latitude && location.longitude) {
        setDistance(
          getDistance(
            {
              latitude: item.organizationposts.latitude,
              longitude: item.organizationposts.longitude,
            },
            {latitude: location.latitude, longitude: location.longitude},
          ) / 1000,
        );
      }
    };
    getDistanceFromLocation();
  }, [
    item.organizationposts.latitude,
    item.organizationposts.longitude,
    location,
  ]);

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
            uri: item.organizationposts.imageUrl
              ? item.organizationposts.imageUrl
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
              {item.organizationposts.title}
            </Text>
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
                  {'\u2022'} Description:{' '}
                </Text>
                {item.organizationposts.description}
              </Text>
              <Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: 'black',
                    textDecorationLine: 'none',
                  }}>
                  {'\u2022'} Link website:{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'purple',
                    textDecorationLine: 'underline',
                  }}
                  onPress={async () => {
                    try {
                      await Linking.openURL(
                        item.organizationposts.linkWebsites,
                      );
                    } catch (error) {
                      console.log('Failed to open URL:', error);
                      await Linking.openURL('https://www.google.com');
                    }
                  }}>
                  {item.organizationposts.linkWebsites}
                </Text>
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {new Date(
                  item.organizationposts.createdDate,
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default ReportOrganizationItem;
