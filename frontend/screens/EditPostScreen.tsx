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
import {Button, Icon} from '@rneui/themed';
import MAP_API_KEY from '../components/data/SecretData';
import axios from 'axios';
import UploadPhoto from '../components/ui/UploadPhoto';
import {DatePickerInput} from 'react-native-paper-dates';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {uploadPhoto} from '../api/UploadPhotoApi';
import {createNotifications} from 'react-native-notificated';
import {updatePost} from '../api/PostApi';
import {useDispatch} from 'react-redux';
import {updateMyPost} from '../redux/SharingPostReducer';
import ImageSwiper from '../components/ui/ImageSwiper';
import screenWidth from '../global/Constant';
import {getFontFamily} from '../utils/fonts';
import {useLoading} from '../utils/LoadingContext';

const {useNotifications} = createNotifications();

const EditPostScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {showLoading, hideLoading} = useLoading();
  const item = route.params.item;
  const {notify} = useNotifications();
  const location = route.params.location;
  const accessToken = route.params.accessToken;
  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');
  const [weight, setWeight] = useState(item.weight || '');
  const [description, setDescription] = useState(item.description || '');
  const [note, setNote] = useState(item.note || '');
  const [status, setStatus] = useState(item.status || '');
  const [locationName, setLocationName] = useState(item.locationName || '');
  const [portion, setPortion] = useState(item.portion || '');
  const [latitude, setLatitude] = useState(
    location && location.latitude ? location.latitude : null,
  );
  const [longitude, setLongitude] = useState(
    location && location.longitude ? location.longitude : null,
  );
  const [expiredDate, setExpiredDate] = useState(
    new Date(item.expiredDate) || new Date(),
  );
  const [pickUpStartDate, setPickUpStartDate] = useState(
    new Date(item.pickUpStartDate) || new Date(),
  );
  const [pickUpEndDate, setPickUpEndDate] = useState(
    new Date(item.pickUpEndDate) || new Date(),
  );
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any[]>([]);
  const [oldImages, setOldImages] = useState<string[]>(item.images || []); // Add state for original images

  const autocompleteRef = useRef<any | null>(null);

  const getLocationName = async (
    latitudeCurrent: number,
    longitudeCurrent: number,
  ) => {
    try {
      if (!latitudeCurrent || !longitudeCurrent) {
        notify('error', {
          params: {description: 'Không thể lấy vị trí hiện tại.', title: 'Lỗi'},
        });
        return;
      }
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
      notify('error', {
        params: {description: 'Không thể lấy vị trí hiện tại.', title: 'Lỗi'},
      });
      return '';
    } catch (error) {
      console.error(error);
    }
  };

  const postImage = async (newImages: any) => {
    setImageUpload((prevImages: any) => {
      if (Array.isArray(newImages)) {
        return [...prevImages, ...newImages];
      } else {
        return [...prevImages, newImages];
      }
    });
  };

  const handleEditPost = () => {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    expiredDate.setHours(0, 0, 0, 0);
    pickUpStartDate.setHours(0, 0, 0, 0);
    pickUpEndDate.setHours(0, 0, 0, 0);

    if (title === '') {
      notify('error', {
        params: {description: 'Tên món ăn là bắt buộc.', title: 'Lỗi'},
      });
      return;
    }
    if (locationName === '') {
      notify('error', {
        params: {description: 'Địa điểm nhận là bắt buộc.', title: 'Lỗi'},
      });
      return;
    }
    if (imageUpload.length === 0 && oldImages.length === 0) {
      notify('error', {
        params: {description: 'Ảnh là bắt buộc.', title: 'Lỗi'},
      });
      return;
    }
    if (expiredDate < currentDate) {
      notify('error', {
        params: {description: 'Ngày hết hạn không hợp lệ.', title: 'Lỗi'},
      });
      return;
    }
    if (pickUpStartDate < currentDate) {
      notify('error', {
        params: {description: 'Ngày bắt đầu nhận không hợp lệ.', title: 'Lỗi'},
      });
      return;
    }
    if (pickUpEndDate < currentDate) {
      notify('error', {
        params: {description: 'Ngày kết thúc nhận không hợp lệ.', title: 'Lỗi'},
      });
      return;
    }
    if (pickUpEndDate < pickUpStartDate) {
      notify('error', {
        params: {
          description: 'Ngày kết thúc nhận phải lớn hơn ngày bắt đầu nhận.',
          title: 'Lỗi',
          style: {multiline: 100},
        },
      });
      return;
    }
    showLoading();
    if (imageUpload.length > 0) {
      const dataForm = new FormData();
      imageUpload.forEach((image: any) => {
        dataForm.append('file', {
          uri: image.path,
          name: image.filename || 'image.jpeg',
          type: image.mime || 'image/jpeg',
        });
      });

      uploadPhoto(dataForm, accessToken)
        .then((response: any) => {
          if (response.status === 200) {
            // Combine new uploaded images with old images
            const allImages = [...oldImages, ...response.data];

            updatePost(
              item.id,
              {
                title,
                images: allImages,
                content,
                weight,
                description,
                portion,
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
                      description: 'Chỉnh sửa bài viết thành công',
                      title: 'Thành công',
                    },
                  });
                  dispatch(updateMyPost(response2.data));
                  hideLoading();
                  navigation.navigate('Home');
                }
              })
              .catch((error: any) => {
                notify('error', {
                  params: {
                    description: error.message,
                    title: 'Lỗi',
                    style: {multiline: 100},
                  },
                });
                hideLoading();
              });
          }
        })
        .catch((error: any) => {
          notify('error', {
            params: {
              description: error.message,
              title: 'Lỗi',
            },
          });
          hideLoading();
        });
    } else {
      // If no new images, just update with existing images
      updatePost(
        item.id,
        {
          title,
          images: oldImages,
          content,
          weight,
          description,
          portion,
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
        .then((response: any) => {
          if (response.status === 200) {
            notify('success', {
              params: {
                description: 'Chỉnh sửa bài viết thành công',
                title: 'Thành công',
              },
            });
            hideLoading();
            dispatch(updateMyPost(response.data));
            navigation.navigate('Home');
          }
        })
        .catch((error: any) => {
          notify('error', {
            params: {
              description: error.message,
              title: 'Lỗi',
              style: {multiline: 100},
            },
          });
          hideLoading();
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
          placeholder="Trọng lượng (kg)"
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
          placeholder="Số phần"
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
          value={portion}
          onChangeText={setPortion}
          keyboardType="numeric"
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
          {(imageUpload && imageUpload.length > 0) ||
          (oldImages && oldImages.length > 0) ? (
            <>
              <ImageSwiper
                style={{width: screenWidth * 0.9, height: 300}}
                images={[
                  ...oldImages.map(img => ({path: img})),
                  ...imageUpload,
                ]}
                isCreatePost={true}
                setImageUpload={(newImages: any[]) => {
                  // Handle image removal by filtering both old and new images
                  const removedPath = newImages.map(img => img.path);
                  setOldImages(
                    oldImages.filter((img: any) => removedPath.includes(img)),
                  );
                  setImageUpload(
                    newImages.filter(
                      img => img.path && !oldImages.includes(img.path),
                    ),
                  );
                }}
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
          title="Chỉnh sửa"
          onPress={handleEditPost}
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

export default EditPostScreen;
