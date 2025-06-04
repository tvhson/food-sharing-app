import {Button, Icon} from '@rneui/themed';
import {ICreateGroupRequest, createGroup, inviteUser} from '../api/GroupApi';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import AddPeopleModal from '../components/ui/AddPeopleModal';
import Colors from '../global/Color';
import {DatePickerInput} from 'react-native-paper-dates';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {MAP_API_KEY} from '@env';
import {RadioButton} from 'react-native-paper';
import {RootState} from '../redux/Store';
import UploadPhoto from '../components/ui/UploadPhoto';
import {UserInfo} from '../redux/UserReducer';
import axios from 'axios';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../utils/fonts';
import {uploadPhoto} from '../api/UploadPhotoApi';
import {useLoading} from '../utils/LoadingContext';

const {useNotifications} = createNotifications();

const CreateGroupScreen = ({route, navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const location = useSelector((state: RootState) => state.location);

  const accessToken = useSelector((state: RootState) => state.token.key);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isAddPeopleModalVisible, setIsAddPeopleModalVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Partial<UserInfo>[]>([]);
  const [joinType, setJoinType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const autocompleteRef = useRef<any | null>(null);
  const postImage = async (newImages: any) => {
    setImageUpload(newImages);
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

  const validateForm = () => {
    if (groupName === '') {
      notify('error', {
        params: {
          description: 'Tên nhóm là bắt buộc.',
          title: 'Lỗi',
          style: {multiline: 100},
        },
      });
      return false;
    }
    if (description === '') {
      notify('error', {
        params: {
          description: 'Giới thiệu về nhóm là bắt buộc.',
          title: 'Lỗi',
          style: {multiline: 100},
        },
      });
      return false;
    }

    if (startDate === null) {
      notify('error', {
        params: {description: 'Ngày bắt đầu là bắt buộc.', title: 'Lỗi'},
      });
      return false;
    }

    if (locationName === '') {
      notify('error', {
        params: {description: 'Địa chỉ diễn ra là bắt buộc.', title: 'Lỗi'},
      });
      return false;
    }
    if (imageUpload === null) {
      notify('error', {
        params: {description: 'Ảnh là bắt buộc.', title: 'Lỗi'},
      });
      return false;
    }
    return true;
  };

  const handleCreatePost = async () => {
    if (!validateForm()) {
      return;
    }

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
        name: groupName,
        description: description,
        joinType: joinType,
        imageUrl: imageUrl,
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString() || '',
        locationName: locationName,
        latitude: latitude,
        longitude: longitude,
      };
      await createGroup(accessToken, group)
        .then(response => {
          selectedPeople.forEach(async person => {
            await inviteUser(accessToken, response.id, person.id || -1);
          });
          navigation.goBack();
        })
        .catch(error => {
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
          height={300}
          width={350}
          isCircle={false}
          postImage={postImage}
        />
        <TextInput
          placeholder="Tên nhóm (bắt buộc)"
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
          value={groupName}
          onChangeText={setGroupName}
        />
        <TextInput
          placeholder="Giới thiệu về nhóm (bắt buộc)"
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

        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            width: '90%',
          }}>
          {['PUBLIC', 'PRIVATE'].map(type => (
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <RadioButton
                color={Colors.greenPrimary}
                key={type}
                value={type}
                status={joinType === type ? 'checked' : 'unchecked'}
                onPress={() => setJoinType(type as 'PUBLIC' | 'PRIVATE')}
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
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <DatePickerInput
              locale="vi"
              label="Ngày bắt đầu (bắt buộc)"
              saveLabel="Lưu"
              value={startDate}
              onChange={(date: Date | undefined) =>
                setStartDate(date || new Date())
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
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <DatePickerInput
              locale="vi"
              label="Ngày kết thúc (tùy chọn)"
              saveLabel="Lưu"
              value={endDate}
              onChange={(date: Date | undefined) =>
                setEndDate(date || new Date())
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

        <TouchableOpacity
          onPress={() => {
            setIsAddPeopleModalVisible(true);
          }}
          style={{
            padding: 10,
            paddingVertical: 13,
            backgroundColor: '#eff2ff',
            borderRadius: 8,
            width: '90%',
            borderWidth: 2,
            marginTop: 20,
            borderColor: Colors.greenPrimary,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#706d6d',
              fontFamily: getFontFamily('regular'),
            }}>
            Thêm thành viên
          </Text>
          <Icon
            name="account-plus"
            type="material-community"
            size={20}
            color="#333"
          />
        </TouchableOpacity>
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          fetchDetails={true}
          placeholder="Địa chỉ diễn ra"
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
          {imageUpload ? (
            <>
              <View style={{position: 'relative', width: 350, height: 300}}>
                <Image
                  source={{uri: imageUpload.path}}
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
                    setImageUpload(null);
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
          title="Tạo nhóm"
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
      <AddPeopleModal
        isVisible={isAddPeopleModalVisible}
        onClose={() => setIsAddPeopleModalVisible(false)}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
      />
    </ScrollView>
  );
};

export default CreateGroupScreen;
