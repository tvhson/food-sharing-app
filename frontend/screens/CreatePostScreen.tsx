/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import Colors from '../global/Color';
import MapView, {Marker} from 'react-native-maps';
import {Button, Icon} from '@rneui/themed';
import MAP_API_KEY from '../components/data/SecretData';
import axios from 'axios';

const CreatePostScreen = ({route, navigation}: any) => {
  const location = route.params.location;
  const [locationName, setLocationName] = useState('');

  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${MAP_API_KEY}`,
      );
      console.log(response.data);
      if (response.data.results.length > 0) {
        setLocationName(response.data.results[0].formatted_address);
        return response.data.results[0].formatted_address;
      }
      return 'No location found';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: Colors.background}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={'#706d6d'}
          style={{
            fontSize: 16,
            padding: 10,
            backgroundColor: '#eff2ff',
            borderRadius: 8,
            width: '90%',
            color: 'black',
            borderWidth: 2,
            marginTop: 20,
            borderColor: Colors.postTitle,
          }}
        />
        <TextInput
          placeholder="Weight"
          placeholderTextColor={'#706d6d'}
          style={{
            fontSize: 16,
            padding: 10,
            backgroundColor: '#eff2ff',
            borderRadius: 8,
            width: '90%',
            color: 'black',
            borderWidth: 2,
            marginTop: 20,
            borderColor: Colors.postTitle,
          }}
        />
        <TextInput
          placeholder="Note"
          placeholderTextColor={'#706d6d'}
          style={{
            fontSize: 16,
            padding: 10,
            backgroundColor: '#eff2ff',
            borderRadius: 8,
            width: '90%',
            color: 'black',
            borderWidth: 2,
            marginTop: 20,
            borderColor: Colors.postTitle,
          }}
        />
        <TextInput
          placeholder="Location"
          placeholderTextColor={'#706d6d'}
          value={locationName}
          onChangeText={setLocationName}
          style={{
            fontSize: 16,
            padding: 10,
            backgroundColor: '#eff2ff',
            borderRadius: 8,
            width: '90%',
            color: 'black',
            borderWidth: 2,
            marginTop: 20,
            borderColor: Colors.postTitle,
          }}
        />
        <Button
          title="Get my location"
          onPress={() => getLocationName(location.latitude, location.longitude)}
          buttonStyle={{
            backgroundColor: Colors.postTitle,
            width: 200,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            width: '90%',
            height: 350,
            alignSelf: 'center',
            borderColor: Colors.postTitle,
            borderRadius: 20,
            borderWidth: 2,
            overflow: 'hidden',
            marginTop: 20,
          }}>
          <MapView
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={() => {}}
            style={{flex: 1, borderRadius: 20}}>
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          </MapView>
        </View>
        <View
          style={{
            width: '90%',
            height: 300,
            alignSelf: 'center',
            borderColor: Colors.postTitle,
            borderRadius: 20,
            borderWidth: 2,
            overflow: 'hidden',
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eff2ff',
          }}>
          <Icon
            name="camera"
            type="ionicon"
            size={60}
            color={Colors.postTitle}
            style={{marginTop: 20}}
            onPress={() => {}}
          />
          <Text style={{color: Colors.postTitle, fontSize: 18}}>Add image</Text>
        </View>
        <Button
          title="Create Post"
          onPress={() => {}}
          buttonStyle={{
            backgroundColor: Colors.postTitle,
            width: 200,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}
        />
        <View style={{height: 30}} />
      </View>
    </ScrollView>
  );
};

export default CreatePostScreen;
