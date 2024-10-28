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
import {getFontFamily} from '../utils/fonts';
import ImageSwiper from '../components/ui/ImageSwiper';
import screenWidth from '../global/Constant';

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

  const postImage = async (newImages: any) => {
    setImageUpload((prevImages: any) => {
      if (prevImages && prevImages.length > 0) {
        return [...prevImages, ...newImages];
      } else {
        return newImages;
      }
    });
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
    if (imageUpload && imageUpload.length > 0) {
      if (Array.isArray(imageUpload)) {
        imageUpload.forEach(image => {
          dataForm.append('file', {
            uri: image.path,
            name: image.filename || 'image.jpeg',
            type: image.mime || 'image/jpeg',
          });
        });
      } else {
        dataForm.append('file', {
          uri: imageUpload.path,
          name: imageUpload.filename || 'image.jpeg',
          type: imageUpload.mime || 'image/jpeg',
        });
      }
      uploadPhoto(dataForm, accessToken).then((response: any) => {
        console.log(response);
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
          isMultiple={true}
        />
        <TextInput
          placeholder="Tên món ăn"
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
            borderColor: Colors.greenPrimary,
            fontFamily: getFontFamily('regular'),
          }}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Mô tả món ăn"
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
            borderColor: Colors.greenPrimary,
            fontFamily: getFontFamily('regular'),
          }}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          placeholder="Trọng lượng"
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
            borderColor: Colors.greenPrimary,
            fontFamily: getFontFamily('regular'),
          }}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Ghi chú"
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
            borderColor: Colors.greenPrimary,
            fontFamily: getFontFamily('regular'),
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
              locale="vi"
              label="Ngày hết hạn"
              value={expiredDate}
              onChange={(date: Date | undefined) =>
                setExpiredDate(date || new Date())
              }
              inputMode="start"
              saveLabel="Lưu"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                maxWidth: '95%',
                fontFamily: getFontFamily('regular'),
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.greenPrimary,
                borderRadius: 8,
                borderWidth: 2,
              }}
              contentStyle={{
                fontFamily: getFontFamily('regular'),
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
              locale="vi"
              label="Ngày bắt đầu nhận"
              value={pickUpStartDate}
              onChange={(date: Date | undefined) =>
                setPickUpStartDate(date || new Date())
              }
              saveLabel="Lưu"
              inputMode="start"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                maxWidth: '95%',
                fontFamily: getFontFamily('regular'),
              }}
              contentStyle={{
                fontFamily: getFontFamily('regular'),
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.greenPrimary,
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
              locale="vi"
              label="Ngày kết thúc nhận"
              saveLabel="Lưu"
              value={pickUpEndDate}
              onChange={(date: Date | undefined) =>
                setPickUpEndDate(date || new Date())
              }
              inputMode="start"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                maxWidth: '95%',
                fontFamily: getFontFamily('regular'),
              }}
              contentStyle={{
                fontFamily: getFontFamily('regular'),
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.greenPrimary,
                borderRadius: 8,
                borderWidth: 2,
              }}
            />
          </View>
        </View>

        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          fetchDetails={true}
          placeholder="Địa chỉ nhận"
          onPress={(data, details = null) => {
            setLocationName(data.description);
            setLatitude(details?.geometry.location.lat || 0);
            setLongitude(details?.geometry.location.lng || 0);
          }}
          disableScroll={true}
          query={{
            key: MAP_API_KEY,
            language: 'vi',
          }}
          styles={{
            container: {
              borderColor: Colors.greenPrimary,
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
              fontFamily: getFontFamily('regular'),
            },
          }}
        />
        <Button
          title="Sử dụng vị trí hiện tại"
          onPress={() => getLocationName(location.latitude, location.longitude)}
          buttonStyle={{
            backgroundColor: Colors.greenPrimary,
            width: 200,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}
          titleStyle={{fontFamily: getFontFamily('bold')}}
        />
        <View
          style={{
            width: '90%',
            height: 300,
            alignSelf: 'center',
            borderColor: Colors.greenPrimary,
            borderRadius: 20,
            borderWidth: 2,
            overflow: 'hidden',
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eff2ff',
          }}>
          {imageUpload && imageUpload.length > 0 ? (
            <>
              <ImageSwiper
                style={{width: screenWidth * 0.9, height: 300}}
                images={imageUpload}
                isCreatePost={true}
                setImageUpload={setImageUpload}
                setIsUploadVisible={setIsUploadVisible}
                isUploadVisible={isUploadVisible}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{marginTop: 20}}
                onPress={() => {
                  setIsUploadVisible(!isUploadVisible);
                }}>
                <Icon
                  name="camera"
                  type="ionicon"
                  size={60}
                  color={Colors.greenPrimary}
                />
              </TouchableOpacity>

              <Text
                style={{
                  color: Colors.greenPrimary,
                  fontSize: 18,
                  fontFamily: getFontFamily('regular'),
                }}>
                Thêm ảnh
              </Text>
            </>
          )}
        </View>

        <Button
          title="Tạo bài viết"
          onPress={handleCreatePost}
          buttonStyle={{
            backgroundColor: Colors.greenPrimary,
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
