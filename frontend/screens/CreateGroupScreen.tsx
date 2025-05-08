/* eslint-disable @typescript-eslint/no-unused-vars */
import {Button, Icon} from '@rneui/themed';
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../global/Color';
import ImageSwiper from '../components/ui/ImageSwiper';
import UploadPhoto from '../components/ui/UploadPhoto';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../utils/fonts';
import screenWidth from '../global/Constant';
import {uploadPhoto} from '../api/UploadPhotoApi';
import {useDispatch} from 'react-redux';
import {useLoading} from '../utils/LoadingContext';

const {useNotifications} = createNotifications();

const CreateGroupScreen = ({route, navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useDispatch();
  const {notify} = useNotifications();

  const accessToken = route.params.accessToken;
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);

  const postImage = async (newImages: any) => {
    console.log('newImages', newImages);

    // Ensure newImages is always an array
    const imagesArray = Array.isArray(newImages) ? newImages : [newImages];

    setImageUpload((prevImages: any) => {
      return prevImages && prevImages.length > 0
        ? [...prevImages, ...imagesArray]
        : imagesArray;
    });
  };

  const handleCreatePost = () => {
    if (imageUpload === null) {
      notify('error', {
        params: {description: 'Ảnh là bắt buộc.', title: 'Lỗi'},
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
      showLoading();
      uploadPhoto(dataForm, accessToken)
        .then((response: any) => {})
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
          height={300}
          width={350}
          isCircle={false}
          postImage={postImage}
          isMultiple={true}
        />
        <TextInput
          placeholder="Tên nhóm"
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
          placeholder="Giới thiệu về nhóm"
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

        <TouchableOpacity
          onPress={() => {}}
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
        {/* <TouchableOpacity
          style={{width: '90%'}}
          onPress={() => {
            setIsTagVisible(true);
          }}>
          <TextInput
            placeholder="Loại thực phẩm"
            placeholderTextColor={'#706d6d'}
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: '#eff2ff',
              borderRadius: 8,
              color: 'black',
              borderWidth: 2,
              marginTop: 20,
              borderColor: Colors.greenPrimary,
              fontFamily: getFontFamily('regular'),
            }}
            value={portion}
            onChangeText={setPortion}
            readOnly
          />
        </TouchableOpacity> */}

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

export default CreateGroupScreen;
