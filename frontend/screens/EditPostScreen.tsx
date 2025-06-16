import {Button, Icon} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {MAP_API_KEY} from '@env';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {Controller, useForm} from 'react-hook-form';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {createNotifications} from 'react-native-notificated';
import {useDispatch, useSelector} from 'react-redux';
import {updatePost} from '../api/PostApi';
import {uploadPhoto} from '../api/UploadPhotoApi';
import ChooseTagBottomSheet from '../components/ui/ChooseTagBottomSheet';
import {CustomInput} from '../components/ui/CustomInput/CustomInput';
import {CustomText} from '../components/ui/CustomText';
import ImageSwiper from '../components/ui/ImageSwiper';
import UploadPhoto from '../components/ui/UploadPhoto';
import Colors from '../global/Color';
import screenWidth from '../global/Constant';
import {SharingPost, updateMyPost} from '../redux/SharingPostReducer';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {formatDate, getFoodTypeKey} from '../utils/helper';
import {useLoading} from '../utils/LoadingContext';
import {scale} from '../utils/scale';
import {
  createCreatePostValidate,
  CreatePostValidateSchema,
} from '../utils/schema/create-post';
import {parseDDMMYYYY} from '../utils/schema/hook-forms';
import {FoodType} from './CreatePostScreen';

const {useNotifications} = createNotifications();

const EditPostScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {showLoading, hideLoading} = useLoading();
  const item: SharingPost = route.params.item;
  const locationState = useSelector((state: RootState) => state.location);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const {notify} = useNotifications();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors, isDirty},
  } = useForm<CreatePostValidateSchema>({
    resolver: zodResolver(createCreatePostValidate()),
    defaultValues: {
      title: item.title || '',
      images: item.images || [],
      description: item.description || '',
      type:
        item.type === 'VEGETARIAN'
          ? FoodType.VEGETARIAN
          : FoodType.NON_VEGETARIAN || undefined,
      location: item.locationName || '',
      latitude: Number(item.latitude) || 0,
      longitude: Number(item.longitude) || 0,
      weight: item.weight.toString() || '',
      portion: item.portion.toString() || '',
      expiredDate: item.expiredDate ? formatDate(item.expiredDate) : '',
      pickUpStartDate: item.pickUpStartDate
        ? formatDate(item.pickUpStartDate)
        : '',
      pickUpEndDate: item.pickUpEndDate ? formatDate(item.pickUpEndDate) : '',
    },
    mode: 'onChange',
  });

  const [isTagVisible, setIsTagVisible] = useState(false);
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
        setValue('location', response.data.results[0].formatted_address, {
          shouldValidate: true,
        });
        setValue('latitude', latitudeCurrent, {
          shouldValidate: true,
        });
        setValue('longitude', longitudeCurrent, {
          shouldValidate: true,
        });
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

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setAddressText(item.locationName);
    }
  }, [item]);

  const postImage = async (newImages: any) => {
    setImageUpload((prevImages: any) => {
      if (Array.isArray(newImages)) {
        setValue('images', [...prevImages, ...newImages], {
          shouldValidate: true,
        });
        return [...prevImages, ...newImages];
      } else {
        setValue('images', [...prevImages, newImages], {
          shouldValidate: true,
        });
        return [...prevImages, newImages];
      }
    });
  };

  const handleEditPost = async (data: CreatePostValidateSchema) => {
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
                ...data,
                expiredDate: parseDDMMYYYY(data.expiredDate)?.toISOString(),
                pickUpStartDate: parseDDMMYYYY(
                  data.pickUpStartDate,
                )?.toISOString(),
                pickUpEndDate: parseDDMMYYYY(data.pickUpEndDate)?.toISOString(),
                type: getFoodTypeKey(data.type),
                content: '',
                status: '',
                locationName: data.location,
                images: allImages,
              },
              accessToken,
            )
              .then((response2: any) => {
                console.log('response2', response2);
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
          ...data,
          locationName: data.location,
          images: oldImages,
          expiredDate: parseDDMMYYYY(data.expiredDate)?.toISOString(),
          pickUpStartDate: parseDDMMYYYY(data.pickUpStartDate)?.toISOString(),
          pickUpEndDate: parseDDMMYYYY(data.pickUpEndDate)?.toISOString(),
          type: getFoodTypeKey(data.type),
          content: '',
          status: '',
        },
        accessToken,
      )
        .then((response: any) => {
          console.log('response', response);
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
          height={scale(300)}
          width={scale(350)}
          isCircle={false}
          postImage={postImage}
          isMultiple={true}
        />
        <View
          style={{
            paddingHorizontal: scale(16),
            marginTop: scale(20),
            gap: scale(20),
          }}>
          <CustomInput
            controller={{
              control,
              name: 'title',
            }}
            errorText={errors.title?.message}
            label="Tên món ăn"
            labelColor={Colors.gray600}
          />

          <CustomInput
            controller={{
              control,
              name: 'description',
            }}
            errorText={errors.description?.message}
            label="Mô tả món ăn"
            labelColor={Colors.gray600}
            multiline
            numberOfLines={4}
            isTextArea={true}
          />

          <CustomInput
            controller={{
              control,
              name: 'weight',
            }}
            errorText={errors.weight?.message}
            label="Trọng lượng (kg)"
            labelColor={Colors.gray600}
            keyboardType="numeric"
          />

          <CustomInput
            controller={{
              control,
              name: 'portion',
            }}
            errorText={errors.portion?.message}
            label="Số phần"
            labelColor={Colors.gray600}
            keyboardType="numeric"
          />

          <Controller
            control={control}
            name="type"
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <>
                <ChooseTagBottomSheet
                  isVisible={isTagVisible}
                  setVisible={setIsTagVisible}
                  setType={onChange}
                />
                <TouchableOpacity
                  onPress={() => {
                    setIsTagVisible(true);
                  }}
                  style={{
                    padding: scale(10),
                    paddingVertical: scale(16),
                    backgroundColor: Colors.white,
                    borderRadius: scale(10),
                    borderWidth: 1,
                    borderColor: error ? Colors.red : Colors.gray300,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: scale(16),
                      color:
                        value === undefined ? Colors.gray600 : Colors.black,
                      fontFamily: getFontFamily('regular'),
                    }}>
                    {value === undefined ? 'Loại thực phẩm' : value}
                  </Text>
                  <Icon
                    name="chevron-down"
                    type="ionicon"
                    size={scale(20)}
                    color={Colors.gray600}
                  />
                </TouchableOpacity>
                {error && (
                  <CustomText
                    fontType="medium"
                    size={14}
                    textColor={Colors.red}
                    style={[
                      {marginTop: scale(-16), paddingHorizontal: scale(10)},
                    ]}>
                    {error.message}
                  </CustomText>
                )}
              </>
            )}
          />

          <CustomInput
            controller={{
              control,
              name: 'expiredDate',
            }}
            errorText={errors.expiredDate?.message}
            label="Ngày hết hạn"
            labelColor={Colors.gray600}
            isDatePicker
            placeholder="DD/MM/YYYY"
            calendarPickerProps={{
              minimumDate: new Date(),
              date: new Date(),
            }}
          />

          <CustomInput
            controller={{
              control,
              name: 'pickUpStartDate',
            }}
            errorText={errors.pickUpStartDate?.message}
            label="Ngày bắt đầu nhận"
            labelColor={Colors.gray600}
            isDatePicker
            placeholder="DD/MM/YYYY"
            calendarPickerProps={{
              minimumDate: new Date(),
              date: new Date(),
            }}
          />

          <CustomInput
            controller={{
              control,
              name: 'pickUpEndDate',
            }}
            errorText={errors.pickUpEndDate?.message}
            label="Ngày kết thúc nhận"
            labelColor={Colors.gray600}
            isDatePicker
            placeholder="DD/MM/YYYY"
            calendarPickerProps={{
              minimumDate: new Date(),
              date: new Date(),
            }}
          />

          <GooglePlacesAutocomplete
            ref={autocompleteRef}
            fetchDetails={true}
            placeholder="Địa chỉ nhận"
            onPress={(data, details = null) => {
              setValue('location', data.description, {
                shouldValidate: true,
              });
              setValue('latitude', details?.geometry.location.lat || 0, {
                shouldValidate: true,
              });
              setValue('longitude', details?.geometry.location.lng || 0, {
                shouldValidate: true,
              });
            }}
            disableScroll={true}
            query={{
              key: MAP_API_KEY,
              language: 'vi',
            }}
            styles={{
              container: {
                borderColor: errors.location ? Colors.red : Colors.gray300,
                borderRadius: scale(10),
                borderWidth: 1,
                backgroundColor: Colors.white,
              },
              textInput: {
                fontSize: scale(16),
                color: Colors.black,
                backgroundColor: Colors.white,
                fontFamily: getFontFamily('regular'),
              },
            }}
          />
          {errors.location && (
            <CustomText
              fontType="medium"
              size={14}
              textColor={Colors.red}
              style={[{marginTop: scale(-16), paddingHorizontal: scale(10)}]}>
              {errors.location.message}
            </CustomText>
          )}

          <Button
            title="Sử dụng vị trí hiện tại"
            onPress={() =>
              getLocationName(locationState.latitude, locationState.longitude)
            }
            buttonStyle={{
              backgroundColor: Colors.greenPrimary,
              width: scale(200),
              alignSelf: 'center',
              borderRadius: scale(10),
            }}
            titleStyle={{fontFamily: getFontFamily('bold')}}
          />

          <View>
            <View
              style={{
                width: screenWidth - scale(32),
                height: scale(300),
                alignSelf: 'center',
                borderColor: errors.images ? Colors.red : Colors.gray300,
                borderRadius: scale(10),
                borderWidth: 1,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.white,
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
                        oldImages.filter((img: any) =>
                          removedPath.includes(img),
                        ),
                      );
                      setImageUpload(
                        newImages.filter(
                          img => img.path && !oldImages.includes(img.path),
                        ),
                      );
                      setValue(
                        'images',
                        [
                          ...oldImages.filter(img => removedPath.includes(img)),
                          ...newImages.filter(
                            img => img.path && !oldImages.includes(img.path),
                          ),
                        ],
                        {
                          shouldValidate: true,
                        },
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
            {errors.images && (
              <CustomText
                fontType="medium"
                size={14}
                textColor={Colors.red}
                style={[{marginTop: scale(4), paddingHorizontal: scale(10)}]}>
                {errors.images.message}
              </CustomText>
            )}
          </View>
          <Button
            title="Chỉnh sửa"
            onPress={handleSubmit(handleEditPost)}
            buttonStyle={{
              backgroundColor: Colors.greenPrimary,
              width: scale(200),
              alignSelf: 'center',
              marginBottom: scale(20),
              borderRadius: scale(10),
            }}
            disabled={!isDirty}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditPostScreen;
