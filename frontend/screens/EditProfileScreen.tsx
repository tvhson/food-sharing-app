/* eslint-disable react-native/no-inline-styles */
import {Icon} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import MAP_API_KEY from '../components/data/SecretData';
import {updateUser} from '../api/AccountsApi';
import {createNotifications} from 'react-native-notificated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DatePickerInput} from 'react-native-paper-dates';
import {UserInfo, saveUser} from '../redux/UserReducer';
import {useDispatch} from 'react-redux';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';

const {useNotifications, ModalNotificationsProvider} = createNotifications();
function EditProfileScreen(props: any) {
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const autocompleteRef = useRef<any | null>(null);

  const toggleModal = () => {
    props.setVisible(!props.isVisible);
  };

  const saveProfile = async () => {
    let current = new Date();
    current.setHours(0, 0, 0, 0);
    if (name === '') {
      notify('error', {
        params: {description: 'Name is required.', title: 'Error'},
      });
      return;
    }
    if (phone && phone.length < 10) {
      notify('error', {
        params: {
          description: 'Phone number must be 10  digits.',
          title: 'Error',
          isModalNotification: true,
          style: {multiline: 100},
        },
      });
      return;
    }
    const isOnlyDigits = /^\d+$/.test(phone);
    if (!isOnlyDigits) {
      notify('error', {
        params: {
          description: 'Phone number must contain only digits.',
          title: 'Error',
          isModalNotification: true,
          style: {multiline: 100},
        },
      });
      return;
    }
    if (birthDate > current) {
      notify('error', {
        params: {
          description: 'Birthday must be less than current date.',
          title: 'Error',
          isModalNotification: true,
          style: {multiline: 100},
        },
      });
      return;
    }
    updateUser(
      {
        name,
        locationName:
          locationName === '' ? props.userInfo.locationName : locationName,
        description,
        phone,
        birthDate,
        email,
        imageUrl: props.userInfo.imageUrl,
        latitude: latitude === 0 ? props.userInfo.latitude : latitude,
        longitude: longitude === 0 ? props.userInfo.longitude : longitude,
        status: props.userInfo.status,
      },
      props.token,
    )
      .then((response: any) => {
        if (response.status === 200) {
          const userInfo: UserInfo = response.data;
          dispatch(saveUser(userInfo));
          props.setVisible(false);
          notify('success', {
            params: {
              description: 'Update profile successful.',
              title: 'Success',
            },
          });
          AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
        } else {
          notify('error', {
            params: {description: 'Update profile failed.', title: 'Error'},
          });
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
  };
  useEffect(() => {
    if (props.userInfo) {
      setName(props.userInfo.name);
      setDescription(props.userInfo.description);
      setPhone(props.userInfo.phone);
      setEmail(props.userInfo.email);
      if (props.userInfo.birthDate !== null) {
        setBirthDate(new Date(props.userInfo.birthDate));
      }
      if (props.userInfo.locationName !== null) {
        setLocationName(props.userInfo.locationName);
        autocompleteRef.current?.setAddressText(props.userInfo.locationName);
      }
    }
  }, [
    props.userInfo,
    props.userInfo?.birthDate,
    props.userInfo?.description,
    props.userInfo?.locationName,
    props.userInfo?.name,
    props.userInfo?.phoneNumber,
    props.isVisible,
  ]);

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
      <ModalNotificationsProvider notificationTopPosition={0} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={styles.modalContent}>
          <View style={{height: 70}} />
          <View style={{marginLeft: 10}}>
            <Text
              style={{
                fontFamily: getFontFamily('regular'),
              }}>
              * Bắt buộc phải điền
            </Text>
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text
              style={{
                marginTop: 30,
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}>
              Tên*
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}
              placeholder="Nhập tên đầy đủ của bạn"
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>

          {/* <View style={{marginHorizontal: 10}}>
            <Text
              style={{
                marginTop: 30,
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}>
              Mô tả
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}
              placeholder="Nhập mô tả về bạn"
              value={description}
              onChangeText={text => setDescription(text)}
            />
          </View> */}

          <View style={{marginHorizontal: 10}}>
            <Text
              style={{
                marginTop: 30,
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}>
              Số điện thoại*
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}
              placeholder="Nhập số điện thoại của bạn"
              value={phone}
              onChangeText={text => setPhone(text)}
              maxLength={10}
              keyboardType="numeric"
            />
          </View>
          <View style={{marginHorizontal: 10, marginTop: 30}}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <DatePickerInput
                locale="en"
                label="Ngày sinh"
                value={birthDate}
                onChange={(date: Date | undefined) =>
                  setBirthDate(date || new Date())
                }
                inputMode="start"
                style={{width: 300, fontFamily: getFontFamily('regular')}}
                mode="outlined"
              />
            </View>
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text
              style={{
                marginTop: 30,
                color: 'black',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
              }}>
              Địa chỉ
            </Text>
            <GooglePlacesAutocomplete
              ref={autocompleteRef}
              fetchDetails={true}
              placeholder={'Nhập địa chỉ của bạn'}
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
                container: {borderBottomWidth: 1, borderBottomColor: 'black'},
                textInput: {
                  fontSize: 16,
                  color: 'black',
                  fontFamily: getFontFamily('regular'),
                },
              }}
            />
          </View>

          <View style={{height: 100}} />
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={saveProfile}>
          <View
            style={{
              borderRadius: 30,
              backgroundColor: Colors.greenPrimary,
              paddingHorizontal: 150,
              paddingVertical: 6,
              elevation: 5,
            }}>
            <Text style={styles.bottomText}>Lưu</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.topView}>
        <View style={{margin: 20, flexDirection: 'row'}}>
          <TouchableOpacity onPress={toggleModal} style={{marginTop: 3}}>
            <Icon type="antdesign" name="close" />
          </TouchableOpacity>
          <Text style={styles.title}>Sửa thông tin</Text>
        </View>
      </View>
    </Modal>
  );
}
export default EditProfileScreen;
const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: 'black',
    marginLeft: 30,
    fontFamily: getFontFamily('bold'),
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  bottomText: {
    color: 'white',
    fontFamily: getFontFamily('bold'),
    fontSize: 18,
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
});
