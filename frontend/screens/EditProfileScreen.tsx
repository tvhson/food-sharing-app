import {MAP_API_KEY} from '@env';
import {zodResolver} from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Icon} from '@rneui/themed';
import axios from 'axios';
import React, {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import {createNotifications} from 'react-native-notificated';
import {scale, ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../api/AccountsApi';
import {CustomInput} from '../components/ui/CustomInput/CustomInput';
import {CustomText} from '../components/ui/CustomText';
import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import {saveUser, UserInfo} from '../redux/UserReducer';
import {getFontFamily} from '../utils/fonts';
import {formatDate} from '../utils/helper';
import {
  createEditProfileValidate,
  EditProfileValidateSchema,
} from '../utils/schema/edit-profile';

const {useNotifications, ModalNotificationsProvider} = createNotifications();

interface EditProfileScreenProps {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
}

function EditProfileScreen(props: EditProfileScreenProps) {
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const locationState = useSelector((state: RootState) => state.location);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<EditProfileValidateSchema>({
    resolver: zodResolver(createEditProfileValidate()),
    defaultValues: {
      name: userInfo.name,
      location: userInfo.locationName,
      phone: userInfo.phone,
      birthDate: userInfo.birthDate ? formatDate(userInfo.birthDate) : '',
      latitude: userInfo.latitude,
      longitude: userInfo.longitude,
    },
  });

  const autocompleteRef = useRef<any | null>(null);

  const toggleModal = () => {
    props.setVisible(!props.isVisible);
  };

  const saveProfile = async (data: EditProfileValidateSchema) => {
    updateUser(
      {
        name: data.name,
        locationName: data.location,
        phone: data.phone,
        birthDate: formatDate(data.birthDate),
        email: userInfo.email,
        imageUrl: userInfo.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        status: userInfo.status,
      },
      accessToken,
    )
      .then((response: any) => {
        if (response.status === 200) {
          const userInfo: UserInfo = response.data;
          dispatch(saveUser(userInfo));
          props.setVisible(false);
          notify('success', {
            params: {
              description: 'Cập nhật thông tin thành công.',
              title: 'Thành công',
            },
          });
        } else {
          notify('error', {
            params: {description: 'Cập nhật thông tin thất bại.', title: 'Lỗi'},
          });
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

  return (
    <Modal
      onBackdropPress={() => props.setVisible(false)}
      onBackButtonPress={() => props.setVisible(false)}
      isVisible={props.isVisible}
      animationIn={'fadeInUpBig'}
      animationOut={'fadeOutDownBig'}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      style={{margin: 0}}>
      <ModalNotificationsProvider notificationTopPosition={scale(10)} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.modalContent}>
          <View style={{height: scale(50)}} />

          <CustomInput
            controller={{
              control,
              name: 'name',
            }}
            label="Tên"
            errorText={errors.name?.message}
            required={true}
          />
          <CustomInput
            controller={{
              control,
              name: 'phone',
            }}
            label="Số điện thoại"
            errorText={errors.phone?.message}
            required={true}
          />
          <CustomInput
            controller={{
              control,
              name: 'birthDate',
            }}
            label="Ngày sinh"
            errorText={errors.birthDate?.message}
            required={true}
            isDatePicker
            placeholder="DD/MM/YYYY"
            calendarPickerProps={{
              maximumDate: new Date(),
              date: new Date(),
            }}
            labelColor={Colors.gray600}
          />

          <View>
            <GooglePlacesAutocomplete
              ref={autocompleteRef}
              fetchDetails={true}
              placeholder={'Nhập địa chỉ của bạn '}
              onPress={(data, details = null) => {
                setValue('location', data.description);
                setValue('latitude', details?.geometry.location.lat || 0);
                setValue('longitude', details?.geometry.location.lng || 0);
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
                style={[{marginTop: scale(-4), paddingHorizontal: scale(10)}]}>
                {errors.location.message}
              </CustomText>
            )}
          </View>
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

          <View style={{height: scale(100)}} />
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={handleSubmit(saveProfile)}>
          <View
            style={{
              borderRadius: scale(30),
              backgroundColor: Colors.greenPrimary,
              paddingHorizontal: scale(150),
              paddingVertical: scale(6),
              elevation: 5,
            }}>
            <Text style={styles.bottomText}>Lưu</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.topView}>
        <View style={{margin: 20, flexDirection: 'row'}}>
          <TouchableOpacity onPress={toggleModal} style={{marginTop: scale(3)}}>
            <Icon type="antdesign" name="close" />
          </TouchableOpacity>
          <Text style={styles.title}>Sửa thông tin</Text>
        </View>
      </View>
    </Modal>
  );
}
export default EditProfileScreen;
const styles = ScaledSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(16),
    gap: scale(20),
    flex: 1,
  },
  title: {
    fontSize: scale(20),
    color: 'black',
    marginLeft: scale(30),
    fontFamily: getFontFamily('bold'),
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(70),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  bottomText: {
    color: 'white',
    fontFamily: getFontFamily('bold'),
    fontSize: scale(18),
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
});
