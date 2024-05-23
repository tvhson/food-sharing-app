/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import Colors from '../global/Color';
import {Avatar, Button, Icon} from '@rneui/themed';
import MapView, {Marker} from 'react-native-maps';
import {Linking} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';

const OrganizationPostDetail = ({route, navigation}: any) => {
  console.log('item', route.params.item);
  const item = route.params.item;
  const accessToken = useSelector((state: RootState) => state.token.key);
  const createPostUser = route.params.item.accounts;
  const locationStart = useSelector((state: RootState) => state.location);
  const locationEnd = {
    latitude: route.params.item.latitude,
    longitude: route.params.item.longitude,
  };
  const openGoogleMaps = (
    startLocation: {latitude: number; longitude: number},
    endLocation: {latitude: number; longitude: number},
  ) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        flexDirection: 'column',
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute', // Add this
          top: 10, // Add this
          left: 10, // Add this
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          marginLeft: 10,
          zIndex: 1,
        }}>
        <Icon name="arrow-back" type="ionicon" size={24} color={'black'} />
      </TouchableOpacity>
      <Image
        source={{
          uri: item.organizationposts.imageUrl
            ? item.organizationposts.imageUrl
            : 'https://randomuser.me/api/portraits/men/36.jpg',
        }}
        style={{
          width: '100%',
          height: 200,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          marginTop: 20,
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',

            color: Colors.postTitle,
          }}>
          {item.organizationposts.title}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText, marginTop: 4}}>
          {new Date(item.organizationposts.createdDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
        <Avatar
          size={40}
          rounded
          source={{
            uri:
              createPostUser && createPostUser.imageUrl
                ? createPostUser.imageUrl
                : 'https://randomuser.me/api/portraits/men/36.jpg',
          }}
        />
        <Text style={{fontSize: 20, color: Colors.text, marginLeft: 20}}>
          {createPostUser && createPostUser.name
            ? createPostUser.name
            : 'Unknown'}
        </Text>
      </View>
      <View style={{marginTop: 20, marginHorizontal: 20}}>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Description:{' '}
          </Text>
          {item.organizationposts.description}
        </Text>

        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Location:{' '}
          </Text>
          {item.organizationposts.locationName}
        </Text>
        <Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
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
                await Linking.openURL(item.organizationposts.linkWebsites);
              } catch (error) {
                console.log('Failed to open URL:', error);
                await Linking.openURL('https://www.google.com');
              }
            }}>
            {item.organizationposts.linkWebsites}
          </Text>
        </Text>
        <View style={{flexDirection: 'row', marginTop: 3}}>
          <Icon
            name="account-multiple"
            size={20}
            color="black"
            type="material-community"
          />
          <Text style={{fontSize: 14, color: 'black'}}>
            {item.organizationposts?.peopleAttended} people attended
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 370,
          height: 370,
          alignSelf: 'center',
          borderColor: 'black',
          borderRadius: 20,
          borderWidth: 2,
          overflow: 'hidden',
          marginTop: 20,
        }}>
        <MapView
          initialRegion={{
            latitude: parseFloat(item.organizationposts.latitude),
            longitude: parseFloat(item.organizationposts.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={() => openGoogleMaps(locationStart, locationEnd)}
          style={{flex: 1, borderRadius: 20}}>
          <Marker
            coordinate={{
              latitude: parseFloat(item.organizationposts.latitude),
              longitude: parseFloat(item.organizationposts.longitude),
            }}
          />
        </MapView>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        <Button
          title={'Attend'}
          buttonStyle={{
            backgroundColor: Colors.postTitle,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 10,
            paddingHorizontal: 45,
          }}
          titleStyle={{fontWeight: '700', fontSize: 18}}
        />
        <Button
          title={'Message'}
          buttonStyle={{
            backgroundColor: Colors.postTitle,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 10,
            paddingHorizontal: 45,
          }}
          titleStyle={{fontWeight: '700', fontSize: 18}}
        />
      </View>
      <View style={{height: 20}} />
    </ScrollView>
  );
};

export default OrganizationPostDetail;
