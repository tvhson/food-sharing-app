/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import Colors from '../global/Color';
import {Avatar, Button, Icon} from '@rneui/themed';
import MapView, {Marker} from 'react-native-maps';
import {Linking} from 'react-native';
import {getInfoUserById} from '../api/AccountsApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';

const PostDetail = ({route, navigation}: any) => {
  const item = route.params.item;
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [createPostUser, setCreatePostUser] = useState<any>(null);
  const locationStart = {
    latitude: route.params.location.latitude,
    longitude: route.params.location.longitude,
  };
  const locationEnd = {
    latitude: route.params.item.latitude,
    longitude: route.params.item.longitude,
  };
  // const locationEnd = route.params.item.location;
  const openGoogleMaps = (
    startLocation: {latitude: number; longitude: number},
    endLocation: {latitude: number; longitude: number},
  ) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    const getInfoUserCreatePost = async () => {
      if (accessToken) {
        getInfoUserById(item.createdById, accessToken)
          .then((response: any) => {
            if (response.status === 200) {
              setCreatePostUser(response.data);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    getInfoUserCreatePost();
  }, [accessToken, item.createdById]);

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
        source={{uri: item.imageUrl}}
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
          {item.title}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText, marginTop: 4}}>
          {new Date(item.createdDate).toLocaleDateString()}
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
          {item.description}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Weight:{' '}
          </Text>
          {item.weight}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Note:{' '}
          </Text>
          {item.note}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Expired date:{' '}
          </Text>
          {new Date(item.expiredDate).toLocaleDateString()}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Pickup start:{' '}
          </Text>
          {new Date(item.pickUpStartDate).toLocaleDateString()}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Pickup end:{' '}
          </Text>
          {new Date(item.pickUpEndDate).toLocaleDateString()}
        </Text>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {'\u2022'} Location:{' '}
          </Text>
          {item.locationName}
        </Text>
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
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={() => openGoogleMaps(locationStart, locationEnd)}
          style={{flex: 1, borderRadius: 20}}>
          <Marker
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
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
          title={'Received'}
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

export default PostDetail;
