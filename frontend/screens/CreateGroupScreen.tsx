import {Button, Icon} from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {createGroup, ICreateGroupRequest, inviteUser} from '../api/GroupApi';

import {MAP_API_KEY} from '@env';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {Controller, useForm} from 'react-hook-form';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {createNotifications} from 'react-native-notificated';
import {RadioButton} from 'react-native-paper';
import {uploadPhoto} from '../api/UploadPhotoApi';
import AddPeopleModal from '../components/ui/AddPeopleModal';
import {CustomInput} from '../components/ui/CustomInput/CustomInput';
import {CustomText} from '../components/ui/CustomText';
import UploadPhoto from '../components/ui/UploadPhoto';
import Colors from '../global/Color';
import screenWidth from '../global/Constant';
import {RootState} from '../redux/Store';
import {UserInfo} from '../redux/UserReducer';
import {getFontFamily} from '../utils/fonts';
import {useLoading} from '../utils/LoadingContext';
import {moderateScale, scale} from '../utils/scale';
import {
  createGroupValidate,
  GroupValidateSchema,
} from '../utils/schema/create-group';
import {parseDDMMYYYY} from '../utils/schema/hook-forms';

const {useNotifications} = createNotifications();

const CreateGroupScreen = ({route, navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const location = useSelector((state: RootState) => state.location);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<GroupValidateSchema>({
    resolver: zodResolver(createGroupValidate()),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      image: null,
      joinType: 'PUBLIC',
      locationName: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [isAddPeopleModalVisible, setIsAddPeopleModalVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Partial<UserInfo>[]>([]);

  const autocompleteRef = useRef<any | null>(null);
  const postImage = async (newImages: any) => {
    setImageUpload(newImages);
    setValue('image', newImages, {
      shouldValidate: true,
    });
  };

  const getLocationName = async (
    latitudeCurrent: number,
    longitudeCurrent: number,
  ) => {
    try {
      if (!latitudeCurrent || !longitudeCurrent) {
        notify('error', {
          params: {
            description: 'Không thể lấy vị trí hiện tại.',
            title: 'Lỗi',
          },
        });
        return;
      }
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitudeCurrent},${longitudeCurrent}&key=${MAP_API_KEY}`,
      );
      if (response.data.results.length > 0) {
        console.log(latitudeCurrent, longitudeCurrent);
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

  const handleCreatePost = async (data: GroupValidateSchema) => {
    let imageUrl = null;

    const dataForm = new FormData();
    if (imageUpload) {
      dataForm.append('file', {
        uri: imageUpload.path,
        name: imageUpload.filename || 'image.jpeg',
        type: imageUpload.mime || 'image/jpeg',
      });

      showLoading();
      const imageResponse: any = await uploadPhoto(dataForm, accessToken);

      if (imageResponse?.status === 200) {
        imageUrl = imageResponse?.data[0];
      } else {
        notify('error', {
          params: {description: 'Không thể tải ảnh.', title: 'Lỗi'},
        });
        hideLoading();
        return;
      }

      const group: ICreateGroupRequest = {
        name: data.name,
        description: data.description,
        joinType: data.joinType,
        imageUrl: imageUrl,
        startDate: data.startDate
          ? parseDDMMYYYY(data.startDate)?.toISOString() || ''
          : new Date().toISOString(),
        endDate: data.endDate
          ? parseDDMMYYYY(data.endDate)?.toISOString()
          : undefined,
        locationName: data.locationName,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      await createGroup(accessToken, group)
        .then(response => {
          selectedPeople.forEach(async person => {
            await inviteUser(accessToken, response.id, person.id || -1);
          });
          navigation.goBack();
        })
        .catch(error => {
          console.log('Im here 4');
          console.log(error);
          notify('error', {
            params: {
              description: 'Không thể tạo nhóm.',
              title: 'Lỗi',
              style: {
                multiline: 100,
              },
            },
          });
        });

      hideLoading();
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
          isMultiple={false}
        />
        <View
          style={{
            paddingHorizontal: scale(16),
            gap: scale(20),
            marginTop: scale(20),
          }}>
          <CustomInput
            controller={{
              control,
              name: 'name',
            }}
            errorText={errors.name?.message}
            label="Tên nhóm"
            labelColor={Colors.gray600}
            required
          />

          <CustomInput
            controller={{
              control,
              name: 'description',
            }}
            errorText={errors.description?.message}
            label="Mô tả"
            labelColor={Colors.gray600}
            required
          />

          <Controller
            control={control}
            name="joinType"
            render={({field: {value, onChange}}) => (
              <View style={{flexDirection: 'row', gap: scale(10)}}>
                {['PUBLIC', 'PRIVATE'].map(type => (
                  <View
                    key={type}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <RadioButton
                      color={Colors.greenPrimary}
                      key={type}
                      value={type}
                      status={value === type ? 'checked' : 'unchecked'}
                      onPress={() => onChange(type as 'PUBLIC' | 'PRIVATE')}
                    />
                    <Text
                      style={{
                        fontFamily: getFontFamily('regular'),
                        fontSize: 16,
                        color: Colors.text,
                      }}>
                      {type === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          />

          <CustomInput
            controller={{
              control,
              name: 'startDate',
            }}
            errorText={errors.startDate?.message}
            label="Ngày bắt đầu"
            labelColor={Colors.gray600}
            placeholder="DD/MM/YYYY"
            required
            isDatePicker
          />

          <CustomInput
            controller={{
              control,
              name: 'endDate',
            }}
            errorText={errors.endDate?.message}
            label="Ngày kết thúc"
            labelColor={Colors.gray600}
            placeholder="DD/MM/YYYY"
            isDatePicker
          />

          <TouchableOpacity
            onPress={() => {
              setIsAddPeopleModalVisible(true);
            }}
            style={{
              padding: scale(10),
              paddingVertical: scale(13),
              backgroundColor: Colors.white,
              borderRadius: scale(10),
              borderWidth: scale(1),
              borderColor: Colors.gray300,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: moderateScale(16),
                color: '#706d6d',
                fontFamily: getFontFamily('regular'),
              }}>
              Thêm thành viên
            </Text>
            <Icon
              name="account-plus"
              type="material-community"
              size={moderateScale(20)}
              color="#333"
            />
          </TouchableOpacity>

          <GooglePlacesAutocomplete
            ref={autocompleteRef}
            fetchDetails={true}
            placeholder="Địa chỉ diễn ra"
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
                borderColor: errors.locationName ? Colors.red : Colors.gray300,
                borderRadius: scale(10),
                borderWidth: scale(1),
                backgroundColor: Colors.white,
              },
              textInput: {
                fontSize: moderateScale(16),
                color: Colors.text,
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
              getLocationName(location.latitude, location.longitude)
            }
            buttonStyle={{
              backgroundColor: Colors.greenPrimary,
              width: scale(200),
              alignSelf: 'center',
              borderRadius: scale(10),
            }}
            titleStyle={{fontFamily: getFontFamily('bold')}}
          />
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
              <>
                <View
                  style={{
                    position: 'relative',
                    width: screenWidth - scale(32),
                    height: scale(300),
                  }}>
                  <Image
                    source={{uri: imageUpload.path}}
                    style={{width: '100%', height: '100%'}}
                  />
                  <TouchableOpacity
                    style={{
                      width: scale(20),
                      height: scale(20),
                      borderRadius: scale(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                      position: 'absolute',
                      top: scale(10),
                      right: scale(10),
                      backgroundColor: 'black',
                      zIndex: 1,
                    }}
                    onPress={() => {
                      setImageUpload(null);
                    }}>
                    <Icon
                      name="close"
                      type="ionicon"
                      size={moderateScale(20)}
                      color="white"
                    />
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
                    size={moderateScale(60)}
                    color={Colors.greenPrimary}
                    style={{marginTop: scale(20)}}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    color: Colors.greenPrimary,
                    fontSize: moderateScale(18),
                    fontFamily: getFontFamily('bold'),
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
              style={[{marginTop: scale(-16), paddingHorizontal: scale(10)}]}>
              {errors.image.message as string}
            </CustomText>
          )}

          <Button
            title="Tạo nhóm"
            onPress={handleSubmit(handleCreatePost)}
            buttonStyle={{
              backgroundColor: Colors.greenPrimary,
              width: scale(200),
              alignSelf: 'center',
              borderRadius: scale(10),
              marginBottom: scale(20),
            }}
            titleStyle={{fontFamily: getFontFamily('bold')}}
          />
        </View>

        <AddPeopleModal
          isVisible={isAddPeopleModalVisible}
          onClose={() => setIsAddPeopleModalVisible(false)}
          selectedPeople={selectedPeople}
          setSelectedPeople={setSelectedPeople}
        />
      </View>
    </ScrollView>
  );
};

export default CreateGroupScreen;
