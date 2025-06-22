import {Button, Icon} from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {MAP_API_KEY} from '@env';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {Controller, useForm} from 'react-hook-form';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {createNotifications} from 'react-native-notificated';
import {earnPoint} from '../api/LoyaltyApi';
import {createPost} from '../api/PostApi';
import {uploadPhoto} from '../api/UploadPhotoApi';
import ChooseTagBottomSheet from '../components/ui/ChooseTagBottomSheet';
import {CustomInput} from '../components/ui/CustomInput/CustomInput';
import {CustomText} from '../components/ui/CustomText';
import ImageSwiper from '../components/ui/ImageSwiper';
import UploadPhoto from '../components/ui/UploadPhoto';
import Colors from '../global/Color';
import screenWidth from '../global/Constant';
import {pushMyPost} from '../redux/SharingPostReducer';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {getFoodTypeKey} from '../utils/helper';
import {useLoading} from '../utils/LoadingContext';
import {moderateScale, scale} from '../utils/scale';
import {
  createCreatePostValidate,
  CreatePostValidateSchema,
} from '../utils/schema/create-post';
import {parseDDMMYYYY} from '../utils/schema/hook-forms';

const {useNotifications} = createNotifications();

export enum FoodType {
  VEGETARIAN = 'Chay',
  NON_VEGETARIAN = 'Mặn',
  ALL = 'Tất cả',
}

const CreatePostScreen = ({route, navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const locationRoute = route.params.location;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: {errors},
  } = useForm<CreatePostValidateSchema>({
    resolver: zodResolver(createCreatePostValidate()),
    defaultValues: {
      title: '',
      images: [],
      description: '',
      type: undefined,
      location: '',
      latitude: locationRoute.latitude || 0,
      longitude: locationRoute.longitude || 0,
      weight: '',
      portion: '',
      expiredDate: '',
      pickUpStartDate: '',
      pickUpEndDate: '',
    },
    mode: 'onChange',
  });

  const [isTagVisible, setIsTagVisible] = useState(false);

  const accessToken = route.params.accessToken;

  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);

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

  const postImage = async (newImages: any) => {
    // Ensure newImages is always an array
    const imagesArray = Array.isArray(newImages) ? newImages : [newImages];

    setValue('images', imagesArray, {
      shouldValidate: true,
    });

    setImageUpload((prevImages: any) => {
      return prevImages && prevImages.length > 0
        ? [...prevImages, ...imagesArray]
        : imagesArray;
    });
  };

  const handleCreatePost = async (data: CreatePostValidateSchema) => {
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
      showLoading();
      uploadPhoto(dataForm, accessToken)
        .then((response: any) => {
          console.log(response);
          if (response.status === 200) {
            createPost(
              {
                title: data.title,
                content: '',
                status: '',
                images: response.data,
                weight: data.weight,
                description: data.description,
                portion: data.portion,
                locationName: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                expiredDate: parseDDMMYYYY(data.expiredDate)?.toISOString(),
                pickUpStartDate: parseDDMMYYYY(
                  data.pickUpStartDate,
                )?.toISOString(),
                pickUpEndDate: parseDDMMYYYY(data.pickUpEndDate)?.toISOString(),
                type: getFoodTypeKey(data.type),
              },
              accessToken,
            )
              .then((response2: any) => {
                if (response2.status === 200) {
                  notify('success', {
                    params: {
                      description: 'Tạo bài đăng thành công.',
                      title: 'Thành công',
                    },
                  });
                  dispatch(pushMyPost(response2.data));
                  const response3: any = earnPoint(
                    {point: 10, accountId: userInfo.id},
                    accessToken,
                  );

                  hideLoading();
                  navigation.navigate('Home');
                } else {
                  notify('error', {
                    params: {description: 'Lỗi', title: 'Lỗi'},
                  });
                  console.log(response2);
                  hideLoading();
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
          } else {
            notify('error', {
              params: {description: response.data, title: 'Lỗi'},
            });
            hideLoading();
          }
        })
        .catch((error: any) => {
          notify('error', {
            params: {description: error.message, title: 'Lỗi'},
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
              components: 'country:vn',
            }}
            styles={{
              container: {
                borderColor: errors.location ? Colors.red : Colors.gray300,
                borderRadius: scale(10),
                borderWidth: 1,
                backgroundColor: Colors.white,
              },
              textInput: {
                fontSize: moderateScale(16),
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
              getLocationName(getValues('latitude'), getValues('longitude'))
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
              {imageUpload && imageUpload.length > 0 ? (
                <>
                  <ImageSwiper
                    style={{width: screenWidth - scale(32), height: scale(300)}}
                    images={imageUpload}
                    isCreatePost={true}
                    setImageUpload={(newImages: any) => {
                      setImageUpload(newImages);
                      setValue('images', newImages, {
                        shouldValidate: true,
                      });
                    }}
                    setIsUploadVisible={setIsUploadVisible}
                    isUploadVisible={isUploadVisible}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={{marginTop: scale(20)}}
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
                      fontSize: scale(18),
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
            title="Tạo bài viết"
            onPress={handleSubmit(handleCreatePost)}
            buttonStyle={{
              backgroundColor: Colors.greenPrimary,
              width: scale(200),
              alignSelf: 'center',
              marginBottom: scale(20),
              borderRadius: scale(10),
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatePostScreen;
