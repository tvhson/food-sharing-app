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
import {createEvent} from '../../api/EventsApi';
import {uploadPhoto} from '../../api/UploadPhotoApi';
import {CustomInput} from '../../components/ui/CustomInput/CustomInput';
import {CustomText} from '../../components/ui/CustomText';
import ImageSwiper from '../../components/ui/ImageSwiper';
import RepeatDaysSelector from '../../components/ui/RepeatDaysSelector';
import UploadPhoto from '../../components/ui/UploadPhoto';
import {TimePicker, TimePickerRef} from '../../components/ui/pickers';
import Colors from '../../global/Color';
import screenWidth from '../../global/Constant';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {useLoading} from '../../utils/LoadingContext';
import {moderateScale, scale} from '../../utils/scale';
import {
  createCreateEventValidate,
  CreateEventValidateSchema,
} from '../../utils/schema/create-event';
import {parseDDMMYYYY} from '../../utils/schema/hook-forms';
import Header from '../../components/ui/Header';
import {Checkbox, RadioButton} from 'react-native-paper';

const {useNotifications} = createNotifications();

const CreateEventScreen = ({route, navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const locationRoute = useSelector((state: RootState) => state.location);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: {errors},
  } = useForm<CreateEventValidateSchema>({
    resolver: zodResolver(createCreateEventValidate()),
    defaultValues: {
      title: '',
      description: '',
      image: null,
      locationName: '',
      latitude: locationRoute?.latitude || 0,
      longitude: locationRoute?.longitude || 0,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      repeatDays: [],
    },
    mode: 'onChange',
  });

  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [selectedRepeatDays, setSelectedRepeatDays] = useState<number[]>([]);
  const [eventType, setEventType] = useState<string>('daily'); //daily, only once

  const autocompleteRef = useRef<any | null>(null);
  const startTimePickerRef = useRef<TimePickerRef>(null);
  const endTimePickerRef = useRef<TimePickerRef>(null);

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
        setValue('locationName', response.data.results[0].formatted_address, {
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
    setImageUpload(newImages);
    setValue('image', newImages, {
      shouldValidate: true,
    });
  };

  const handleCreateEvent = async (data: CreateEventValidateSchema) => {
    if (!imageUpload) {
      notify('error', {
        params: {description: 'Vui lòng chọn ảnh cho sự kiện.', title: 'Lỗi'},
      });
      return;
    }

    const dataForm = new FormData();
    dataForm.append('file', {
      uri: imageUpload.path,
      name: imageUpload.filename || 'image.jpeg',
      type: imageUpload.mime || 'image/jpeg',
    });

    showLoading();

    try {
      const imageResponse: any = await uploadPhoto(dataForm, accessToken);

      if (imageResponse?.status === 200) {
        const imageUrl = imageResponse?.data[0];

        // Create start and end datetime strings
        const [startHour, startMinute] = data.startTime.split(':').map(Number);
        const [endHour, endMinute] = data.endTime.split(':').map(Number);

        const startDateTime = new Date();
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date();
        endDateTime.setHours(endHour, endMinute, 0, 0);

        const eventData = {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
          locationName: data.locationName,
          latitude: data.latitude,
          longitude: data.longitude,
          startDate: data.startDate
            ? parseDDMMYYYY(data.startDate)?.toISOString()
            : null,
          endDate: data.endDate
            ? parseDDMMYYYY(data.endDate)?.toISOString()
            : null,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          repeatDays: selectedRepeatDays.length > 0 ? selectedRepeatDays : null,
        };

        const response = await createEvent(accessToken, eventData);

        if (response) {
          notify('success', {
            params: {
              description: 'Tạo sự kiện thành công.',
              title: 'Thành công',
            },
          });
          hideLoading();
          navigation.goBack();
        }
      } else {
        notify('error', {
          params: {description: 'Không thể tải ảnh.', title: 'Lỗi'},
        });
        hideLoading();
      }
    } catch (error: any) {
      notify('error', {
        params: {
          description: error.message || 'Có lỗi xảy ra khi tạo sự kiện.',
          title: 'Lỗi',
        },
      });
      hideLoading();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <Header title="Tạo sự kiện" />
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
            isMultiple={false}
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
              label="Tên sự kiện"
              labelColor={Colors.gray600}
              required
            />

            <CustomInput
              controller={{
                control,
                name: 'description',
              }}
              errorText={errors.description?.message}
              label="Mô tả sự kiện"
              labelColor={Colors.gray600}
              multiline
              numberOfLines={4}
              isTextArea={true}
              required
            />

            <View style={{}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="daily"
                  status={eventType === 'daily' ? 'checked' : 'unchecked'}
                  onPress={() => setEventType('daily')}
                  color={Colors.greenPrimary}
                />
                <CustomText>Sự kiện hàng ngày</CustomText>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton
                  value="only once"
                  status={eventType === 'only once' ? 'checked' : 'unchecked'}
                  onPress={() => setEventType('only once')}
                  color={Colors.greenPrimary}
                />
                <CustomText>Sự kiện chỉ diễn ra 1 lần</CustomText>
              </View>
            </View>

            {eventType === 'only once' && (
              <CustomInput
                controller={{
                  control,
                  name: 'startDate',
                }}
                required
                errorText={errors.startDate?.message}
                label="Ngày bắt đầu"
                labelColor={Colors.gray600}
                isDatePicker
                placeholder="DD/MM/YYYY"
                calendarPickerProps={{
                  minimumDate: new Date(),
                  date: new Date(),
                }}
              />
            )}

            <CustomInput
              controller={{
                control,
                name: 'endDate',
              }}
              errorText={errors.endDate?.message}
              label="Ngày kết thúc"
              labelColor={Colors.gray600}
              isDatePicker
              placeholder="DD/MM/YYYY"
              calendarPickerProps={{
                minimumDate: new Date(),
                date: new Date(),
              }}
            />

            <Controller
              control={control}
              name="startTime"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <View>
                  <CustomText
                    style={{
                      fontSize: scale(16),
                      fontFamily: getFontFamily('medium'),
                      color: Colors.gray600,
                      marginBottom: scale(8),
                    }}>
                    Thời gian bắt đầu
                    <CustomText
                      fontType="medium"
                      size={14}
                      textColor={Colors.red}
                      style={{marginLeft: scale(4)}}>
                      {' '}
                      *
                    </CustomText>
                  </CustomText>
                  <TouchableOpacity
                    onPress={() => startTimePickerRef.current?.open()}
                    style={{
                      padding: scale(10),
                      paddingVertical: scale(16),
                      backgroundColor: Colors.white,
                      borderRadius: scale(10),
                      borderWidth: 1,
                      borderColor: error ? Colors.red : Colors.gray300,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: scale(16),
                        color: value ? Colors.black : Colors.gray600,
                        fontFamily: getFontFamily('regular'),
                      }}>
                      {value || 'HH:mm'}
                    </Text>
                    <Icon
                      name="time-outline"
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
                        {marginTop: scale(4), paddingHorizontal: scale(10)},
                      ]}>
                      {error.message}
                    </CustomText>
                  )}
                  <View style={{display: 'none'}}>
                    <TimePicker
                      ref={startTimePickerRef}
                      onTimeSelect={onChange}
                      initialTime={value}
                    />
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="endTime"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <View>
                  <Text
                    style={{
                      fontSize: scale(16),
                      fontFamily: getFontFamily('medium'),
                      color: Colors.gray600,
                      marginBottom: scale(8),
                    }}>
                    Thời gian kết thúc
                    <CustomText
                      fontType="medium"
                      size={14}
                      textColor={Colors.red}
                      style={{marginLeft: scale(4)}}>
                      {' '}
                      *
                    </CustomText>
                  </Text>
                  <TouchableOpacity
                    onPress={() => endTimePickerRef.current?.open()}
                    style={{
                      padding: scale(10),
                      paddingVertical: scale(16),
                      backgroundColor: Colors.white,
                      borderRadius: scale(10),
                      borderWidth: 1,
                      borderColor: error ? Colors.red : Colors.gray300,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: scale(16),
                        color: value ? Colors.black : Colors.gray600,
                        fontFamily: getFontFamily('regular'),
                      }}>
                      {value || 'HH:mm'}
                    </Text>
                    <Icon
                      name="time-outline"
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
                        {marginTop: scale(4), paddingHorizontal: scale(10)},
                      ]}>
                      {error.message}
                    </CustomText>
                  )}
                  <View style={{display: 'none'}}>
                    <TimePicker
                      ref={endTimePickerRef}
                      onTimeSelect={onChange}
                      initialTime={value}
                    />
                  </View>
                </View>
              )}
            />
            {eventType === 'daily' && (
              <RepeatDaysSelector
                selectedDays={selectedRepeatDays}
                onDaysChange={setSelectedRepeatDays}
                error={errors.repeatDays?.message?.toString()}
              />
            )}

            <GooglePlacesAutocomplete
              ref={autocompleteRef}
              fetchDetails={true}
              placeholder="Địa điểm tổ chức *"
              onPress={(data, details = null) => {
                setValue('locationName', data.description, {
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
                  borderColor: errors.locationName
                    ? Colors.red
                    : Colors.gray300,
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
            {errors.locationName && (
              <CustomText
                fontType="medium"
                size={14}
                textColor={Colors.red}
                style={[{marginTop: scale(-16), paddingHorizontal: scale(10)}]}>
                {errors.locationName.message}
              </CustomText>
            )}

            <Button
              title="Sử dụng vị trí hiện tại"
              onPress={() =>
                getLocationName(
                  locationRoute?.latitude,
                  locationRoute?.longitude,
                )
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
                  borderColor: errors.image ? Colors.red : Colors.gray300,
                  borderRadius: scale(10),
                  borderWidth: 1,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.white,
                }}>
                {imageUpload ? (
                  <ImageSwiper
                    style={{width: screenWidth - scale(32), height: scale(300)}}
                    images={[imageUpload]}
                    isCreatePost={true}
                    setImageUpload={(newImages: any) => {
                      setImageUpload(newImages?.[0] || null);
                      setValue('image', newImages?.[0] || null, {
                        shouldValidate: true,
                      });
                    }}
                    setIsUploadVisible={setIsUploadVisible}
                    isUploadVisible={isUploadVisible}
                  />
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
              {errors.image && (
                <CustomText
                  fontType="medium"
                  size={14}
                  textColor={Colors.red}
                  style={[{marginTop: scale(4), paddingHorizontal: scale(10)}]}>
                  {errors.image.message as string}
                </CustomText>
              )}
            </View>

            <Button
              title="Tạo sự kiện"
              onPress={handleSubmit(handleCreateEvent)}
              buttonStyle={{
                backgroundColor: Colors.greenPrimary,
                width: scale(200),
                alignSelf: 'center',
                marginBottom: scale(20),
                borderRadius: scale(10),
              }}
              titleStyle={{fontFamily: getFontFamily('bold')}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
