/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Colors from '../global/Color';
import {Avatar, Button, Icon} from '@rneui/themed';
import MapView, {Marker} from 'react-native-maps';
import {Linking} from 'react-native';

const PostDetail = ({route, navigation}: any) => {
  const item = route.params.item;
  const locationStart = route.params.location;
  const locationEnd = route.params.item.location;
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
        source={{uri: item.image}}
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
          {item.createAt}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
        <Avatar
          size={40}
          rounded
          source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}
        />
        <Text style={{fontSize: 20, color: Colors.text, marginLeft: 20}}>
          Khoi
        </Text>
      </View>
      <View style={{marginHorizontal: 20, marginTop: 20}}>
        <Text style={{fontSize: 16, color: Colors.grayText}}>
          {item.description}
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
            latitude: 10.875830080525523,
            longitude: 106.78383111914486,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={() => openGoogleMaps(locationStart, locationEnd)}
          style={{flex: 1, borderRadius: 20}}>
          <Marker
            coordinate={{
              latitude: 10.875830080525523,
              longitude: 106.78383111914486,
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
