import {Button, Icon, Image} from '@rneui/themed';
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createOrganizationPost,
  updateOrganizationPost,
} from '../api/OrganizationPostApi';
import {
  pushFundingPost,
  pushMyFundingPost,
  updateMyFundingPost,
} from '../redux/OrganizationPostReducer';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MAP_API_KEY} from '@env';
import {RootState} from '../redux/Store';
import UploadPhoto from '../components/ui/UploadPhoto';
import {createNotifications} from 'react-native-notificated';
import {uploadPhoto} from '../api/UploadPhotoApi';

const {useNotifications} = createNotifications();

const EditFundingScreen = ({navigation, route}: any) => {
  const item = route.params.item;
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkWebsites, setLinkWebsites] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imagePath, setImagePath] = useState('');
  const [isImageAlreadyUpload, setIsImageAlreadyUpload] = useState(false);

  const autocompleteRef = useRef<any | null>(null);

  const postImage = async (image: any) => {
    setImageUpload(image);
    if (image.path) {
      setImagePath(image.path);
    }
  };

  useEffect(() => {
    if (item) {
      setTitle(item.organizationposts.title);
      setDescription(item.organizationposts.description);
      setLinkWebsites(item.organizationposts.linkWebsites);
      setLocationName(item.organizationposts.locationName);
      setLatitude(item.organizationposts.latitude);
      setLongitude(item.organizationposts.longitude);
      setImagePath(item.organizationposts.imageUrl);
      setImageUpload(item.organizationposts.imageUrl);
      autocompleteRef.current?.setAddressText(
        item.organizationposts.locationName
          ? item.organizationposts.locationName
          : '',
      );
      setIsImageAlreadyUpload(true);
    }
  }, [item]);
  const handleCreatePost = () => {
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
    if (imageUpload === null && !isImageAlreadyUpload) {
      notify('error', {
        params: {description: 'Image is required.', title: 'Error'},
      });
      return;
    }
    if (isImageAlreadyUpload) {
      updateOrganizationPost(
        item.organizationposts.id,
        {
          title,
          imageUrl: imagePath,
          description,
          locationName,
          latitude,
          longitude,
          linkWebsites,
        },
        accessToken,
      )
        .then((response: any) => {
          if (response.status === 200) {
            notify('success', {
              params: {
                description: 'Update funding post successful.',
                title: 'Success',
              },
            });
            dispatch(updateMyFundingPost(response.data));
            navigation.navigate('Funding');
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
      const dataForm = new FormData();
      if (imageUpload) {
        dataForm.append('file', {
          uri: imageUpload.path,
          name: imageUpload.filename || 'image.jpeg',
          type: imageUpload.mime || 'image/jpeg',
        });
        uploadPhoto(dataForm, accessToken).then((response: any) => {
          if (response.status === 200) {
            updateOrganizationPost(
              item.organizationposts.id,
              {
                title,
                imageUrl: response.data[0],
                description,
                locationName,
                latitude,
                longitude,
                linkWebsites,
              },
              accessToken,
            )
              .then((response2: any) => {
                if (response2.status === 200) {
                  notify('success', {
                    params: {
                      description: 'Create funding post successful.',
                      title: 'Success',
                    },
                  });
                  dispatch(updateMyFundingPost(response2.data));
                  navigation.navigate('Funding');
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
          placeholder="Title"
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
          placeholder="Link Website"
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
          value={linkWebsites}
          onChangeText={setLinkWebsites}
        />
      </View>

      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        fetchDetails={true}
        placeholder="Enter your organization address"
        onPress={(data, details = null) => {
          setLocationName(data.description);
          if (details) {
            const lat = details.geometry.location.lat;
            const lng = details.geometry.location.lng;
            setLatitude(lat);
            setLongitude(lng);
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
            alignSelf: 'center',
          },
          textInput: {
            fontSize: 16,
            color: 'black',
            backgroundColor: '#eff2ff',
          },
        }}
      />
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
        title="Edit Funding Post"
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
    </ScrollView>
  );
};

export default EditFundingScreen;
