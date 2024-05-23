/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../global/Color';
import MapView, {Marker} from 'react-native-maps';
import {Button, Icon, Image} from '@rneui/themed';
import MAP_API_KEY from '../components/data/SecretData';
import axios from 'axios';
import UploadPhoto from '../components/ui/UploadPhoto';
import {DatePickerInput} from 'react-native-paper-dates';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location';
import {uploadPhoto} from '../api/UploadPhotoApi';
import {createNotifications} from 'react-native-notificated';
import {createPost, updatePost} from '../api/PostApi';
import {useDispatch} from 'react-redux';
import {pushMyPost, updateMyPost} from '../redux/SharingPostReducer';

const {useNotifications} = createNotifications();

const CreatePostScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const location = route.params.location;
  const accessToken = route.params.accessToken;
  const [locationCurrent, setLocationCurrent] = useState(location);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(
    location && location.latitude ? location.latitude : null,
  );
  const [longitude, setLongitude] = useState(
    location && location.longitude ? location.longitude : null,
  );
  const [expiredDate, setExpiredDate] = useState(new Date());
  const [pickUpStartDate, setPickUpStartDate] = useState(new Date());
  const [pickUpEndDate, setPickUpEndDate] = useState(new Date());
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imagePath, setImagePath] = useState('');

  const mapRef = useRef<MapView | null>(null);
  const autocompleteRef = useRef<any | null>(null);

  const getLocationName = async (
    latitudeCurrent: number,
    longitudeCurrent: number,
  ) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitudeCurrent},${longitudeCurrent}&key=${MAP_API_KEY}`,
      );
      if (response.data.results.length > 0) {
        setLocationName(response.data.results[0].formatted_address);
        setLatitude(latitudeCurrent);
        setLongitude(longitudeCurrent);
        autocompleteRef.current?.setAddressText(
          response.data.results[0].formatted_address,
        );
        return response.data.results[0].formatted_address;
      }
      return 'No location found';
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location === null) {
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
          setLocationCurrent(newLocation);
        })
        .catch(() => {
          setLocationCurrent(null);
        });
    }
  }, [location]);

  const postImage = async (image: any) => {
    setImageUpload(image);
    if (image.path) {
      setImagePath(image.path);
    }
  };
  const handleCreatePost = () => {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    expiredDate.setHours(0, 0, 0, 0);
    pickUpStartDate.setHours(0, 0, 0, 0);
    pickUpEndDate.setHours(0, 0, 0, 0);
    if (title === '') {
      notify('error', {
        params: {description: 'Title is required.', title: 'Error'},
      });
      return;
    }
    if (locationName === '') {
      notify('error', {
        params: {description: 'Location is required.', title: 'Error'},
      });
      return;
    }
    if (imageUpload === null) {
      notify('error', {
        params: {description: 'Image is required.', title: 'Error'},
      });
      return;
    }
    if (expiredDate < currentDate) {
      notify('error', {
        params: {description: 'Expired date is invalid.', title: 'Error'},
      });
      return;
    }
    if (pickUpStartDate < currentDate) {
      notify('error', {
        params: {description: 'Pickup start date is invalid.', title: 'Error'},
      });
      return;
    }
    if (pickUpEndDate < currentDate) {
      notify('error', {
        params: {description: 'Pickup end date is invalid.', title: 'Error'},
      });
      return;
    }
    if (pickUpEndDate < pickUpStartDate) {
      notify('error', {
        params: {
          description:
            'Pickup end date must be greater than pickup start date.',
          title: 'Error',
          style: {multiline: 100},
        },
      });
      return;
    }

    const dataForm = new FormData();
    if (imageUpload) {
      dataForm.append('file', {
        uri: imageUpload.path,
        name: imageUpload.filename || 'image.jpeg',
        type: imageUpload.mime || 'image/jpeg',
      });
      uploadPhoto(dataForm, accessToken).then((response: any) => {
        if (response.status === 200) {
          createPost(
            {
              title,
              imageUrl: response.data[0],
              content,
              weight,
              description,
              note,
              status,
              locationName,
              latitude,
              longitude,
              expiredDate,
              pickUpStartDate,
              pickUpEndDate,
            },
            accessToken,
          )
            .then((response2: any) => {
              if (response2.status === 200) {
                notify('success', {
                  params: {
                    description: 'Create post successful.',
                    title: 'Success',
                  },
                });
                dispatch(pushMyPost(response2.data));
                navigation.navigate('Home');
              }
            })
            .catch((error: any) => {
              notify('error', {
                params: {
                  description: error.message,
                  title: 'Error',
                  style: {multiline: 100},
                },
              });
            });
        } else {
          notify('error', {
            params: {description: response.data, title: 'Error'},
          });
        }
      });
    }
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: Colors.background}}
      keyboardShouldPersistTaps="handled">
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <UploadPhoto
          isVisible={isUploadVisible}
          setVisible={setIsUploadVisible}
          height={300}
          width={350}
          isCircle={false}
          postImage={postImage}
        />
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
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor={'#706d6d'}
          multiline
          numberOfLines={4}
          style={{
            height: 100,
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
          value={description}
          onChangeText={setDescription}
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
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
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
          value={note}
          onChangeText={setNote}
        />
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <DatePickerInput
              locale="en"
              label="Expired Date"
              value={expiredDate}
              onChange={(date: Date | undefined) =>
                setExpiredDate(date || new Date())
              }
              inputMode="start"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                maxWidth: '95%',
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.postTitle,
                borderRadius: 8,
                borderWidth: 2,
              }}
            />
          </View>
        </View>
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <DatePickerInput
              locale="en"
              label="Pickup Date Start"
              value={pickUpStartDate}
              onChange={(date: Date | undefined) =>
                setPickUpStartDate(date || new Date())
              }
              inputMode="start"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                maxWidth: '95%',
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.postTitle,
                borderRadius: 8,
                borderWidth: 2,
              }}
            />
          </View>
        </View>
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <DatePickerInput
              locale="en"
              label="Pickup Date End"
              value={pickUpEndDate}
              onChange={(date: Date | undefined) =>
                setPickUpEndDate(date || new Date())
              }
              inputMode="start"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                maxWidth: '95%',
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.postTitle,
                borderRadius: 8,
                borderWidth: 2,
              }}
            />
          </View>
        </View>

        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          fetchDetails={true}
          placeholder="Enter your place"
          onPress={(data, details = null) => {
            setLocationName(data.description);
            setLatitude(details?.geometry.location.lat || 0);
            setLongitude(details?.geometry.location.lng || 0);
            if (details && mapRef.current) {
              const lat = details.geometry.location.lat;
              const lng = details.geometry.location.lng;
              mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          }}
          disableScroll={true}
          query={{
            key: MAP_API_KEY,
            language: 'vi',
          }}
          styles={{
            container: {
              borderColor: Colors.postTitle,
              borderRadius: 8,
              borderWidth: 2,
              width: '90%',
              backgroundColor: '#eff2ff',
              marginTop: 20,
            },
            textInput: {
              fontSize: 16,
              color: 'black',
              backgroundColor: '#eff2ff',
            },
          }}
        />
        <Button
          title="Get my current location"
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
            ref={mapRef}
            initialRegion={{
              latitude: latitude === '' ? locationCurrent.latitude : latitude,
              longitude:
                longitude === '' ? locationCurrent.longitude : longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={() => {}}
            style={{flex: 1, borderRadius: 20}}>
            <Marker
              coordinate={{
                latitude: latitude === '' ? locationCurrent.latitude : latitude,
                longitude:
                  longitude === '' ? locationCurrent.longitude : longitude,
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
          {imageUpload && imagePath ? (
            <>
              <View style={{position: 'relative', width: 350, height: 300}}>
                <Image
                  source={{uri: imagePath}}
                  style={{width: '100%', height: '100%'}}
                />
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'black',
                    zIndex: 1,
                  }}
                  onPress={() => {
                    setImagePath('');
                  }}>
                  <Icon name="close" type="ionicon" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Icon
                name="camera"
                type="ionicon"
                size={60}
                color={Colors.postTitle}
                style={{marginTop: 20}}
                onPress={() => {
                  setIsUploadVisible(!isUploadVisible);
                }}
              />
              <Text style={{color: Colors.postTitle, fontSize: 18}}>
                Add image
              </Text>
            </>
          )}
        </View>

        <Button
          title="Create Post"
          onPress={handleCreatePost}
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
