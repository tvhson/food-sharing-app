import {Button, Icon, Image} from '@rneui/themed';
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  addToTheEndOfFundingPost,
  pushMyFundingPost,
} from '../redux/OrganizationPostReducer';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import {DatePickerInput} from 'react-native-paper-dates';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MAP_API_KEY} from '@env';
import {RootState} from '../redux/Store';
import UploadPhoto from '../components/ui/UploadPhoto';
import {createNotifications} from 'react-native-notificated';
import {createOrganizationPost} from '../api/OrganizationPostApi';
import {getFontFamily} from '../utils/fonts';
import {uploadPhoto} from '../api/UploadPhotoApi';

const {useNotifications} = createNotifications();

const CreateFundingScreen = ({navigation}: any) => {
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
  const [startDate, setStartDate] = useState(new Date());

  const autocompleteRef = useRef<any | null>(null);

  const postImage = async (image: any) => {
    setImageUpload(image);
    if (image.path) {
      setImagePath(image.path);
    }
  };
  const handleCreatePost = () => {
    if (title === '') {
      notify('error', {
        params: {description: 'Bắt buộc có tiêu đề', title: 'Lỗi'},
      });
      return;
    }
    if (locationName === '') {
      notify('error', {
        params: {description: 'Bắt buộc có địa điểm', title: 'Lỗi'},
      });
      return;
    }
    if (imageUpload === null) {
      notify('error', {
        params: {description: 'Bắt buộc có ảnh', title: 'Lỗi'},
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
          createOrganizationPost(
            {
              title,
              imageUrl: response.data[0],
              description,
              locationName,
              latitude,
              longitude,
              linkWebsites,
              startDate,
            },
            accessToken,
          )
            .then((response2: any) => {
              if (response2.status === 200) {
                notify('success', {
                  params: {
                    description: 'Tạo chiến dịch thành công',
                    title: 'Thành công',
                  },
                });
                dispatch(addToTheEndOfFundingPost(response2.data));
                dispatch(pushMyFundingPost(response2.data));
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
            params: {description: response.data, title: 'Lỗi'},
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
          placeholder="Tiêu đề"
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
          }}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Chi tiết chiến dịch"
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
          }}
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          placeholder="Link website của chiến dịch"
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
          }}
          value={linkWebsites}
          onChangeText={setLinkWebsites}
        />
        <View
          style={{
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <DatePickerInput
            locale="vi"
            label="Ngày bắt đầu"
            value={startDate}
            onChange={(date: Date | undefined) =>
              setStartDate(date || new Date())
            }
            inputMode="start"
            saveLabel="Lưu"
            style={{
              backgroundColor: '#eff2ff',
              color: 'black',
              maxWidth: '90%',
              alignSelf: 'center',
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

      <GooglePlacesAutocomplete
        ref={autocompleteRef}
        fetchDetails={true}
        placeholder="Địa điểm diễn ra"
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
            borderColor: Colors.greenPrimary,
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
          borderColor: Colors.greenPrimary,
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
            <TouchableOpacity
              onPress={() => {
                setIsUploadVisible(!isUploadVisible);
              }}>
              <Icon
                name="camera"
                type="ionicon"
                size={60}
                color={Colors.greenPrimary}
                style={{marginTop: 20}}
              />
            </TouchableOpacity>

            <Text style={{color: Colors.greenPrimary, fontSize: 18}}>
              Thêm ảnh
            </Text>
          </>
        )}
      </View>

      <Button
        title="Tạo chiến dịch"
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
    </ScrollView>
  );
};

export default CreateFundingScreen;
