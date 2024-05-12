/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import Header from '../components/ui/Header';
import Colors from '../global/Color';
import {SearchBar} from '@rneui/themed';
import PostData from '../components/data/PostData';
import PostRenderItem from '../components/ui/PostRenderItem';
import GetLocation, {
  Location,
  LocationErrorCode,
  isLocationError,
} from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getInfoUser} from '../api/AccountsApi';

const HomeScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationErrorCode | null>(null);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 30000,
    rationale: {
      title: 'Location permission',
      message: 'The app needs the permission to request your location.',
      buttonPositive: 'Ok',
    },
  })
    .then(newLocation => {
      setLocation(newLocation);
    })
    .catch(ex => {
      if (isLocationError(ex)) {
        const {code, message} = ex;
        setError(code);
      }
      setLocation(null);
    });

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        setToken(parsedToken.accessToken);
      }
    };

    const saveInfoUser = async () => {
      getInfoUser(token).then((response: any) => {
        if (response.status === 200) {
          console.log(response.data);
          AsyncStorage.setItem('infoUser', JSON.stringify(response.data));
        }
      });
    };
    getToken();
    saveInfoUser();
  }, [token]);

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        flexDirection: 'column',
      }}>
      <Header />
      <SearchBar
        placeholder="Search food by name"
        containerStyle={{
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }}
        inputContainerStyle={{
          backgroundColor: 'white',
        }}
        round
        onChangeText={updateSearch}
        value={search}
      />
      <FlatList
        style={{marginHorizontal: 8}}
        data={PostData}
        keyExtractor={item => item.id}
        renderItem={({item}: any) => (
          <PostRenderItem
            item={item}
            navigation={navigation}
            location={location}
          />
        )}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('CreatePost', {location})}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: Colors.button,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, color: 'white'}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
