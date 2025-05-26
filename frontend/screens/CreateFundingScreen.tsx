import {Button, Icon, Image} from '@rneui/themed';
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import UploadPhoto from '../components/ui/UploadPhoto';
import {createNotifications} from 'react-native-notificated';
import {createOrganizationPost} from '../api/OrganizationPostApi';
import {uploadPhoto} from '../api/UploadPhotoApi';

const {useNotifications} = createNotifications();

const CreateFundingScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [description, setDescription] = useState('');
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);

  const group = route.params.group;

  const postImage = async (image: any) => {
    setImageUpload(image);
  };
  const handleCreatePost = () => {
    let imageUrl = '';
    const dataForm = new FormData();
    if (imageUpload) {
      dataForm.append('file', {
        uri: imageUpload.path,
        name: imageUpload.filename || 'image.jpeg',
        type: imageUpload.mime || 'image/jpeg',
      });
      uploadPhoto(dataForm, accessToken).then((response: any) => {
        if (response.status === 200) {
          imageUrl = response.data[0];
        } else {
          notify('error', {
            params: {description: response.data, title: 'Lỗi'},
          });
        }
      });
    }
    createOrganizationPost(
      {
        imageUrl,
        description,
        groupId: group.id,
      },
      accessToken,
    )
      .then((response2: any) => {
        if (response2.status === 200) {
          notify('success', {
            params: {
              description: 'Tạo bài viết thành công',
              title: 'Thành công',
            },
          });
          navigation.navigate('GroupHome');
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
          placeholder="Bạn đang nghĩ gì?"
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
      </View>

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
    </ScrollView>
  );
};

export default CreateFundingScreen;
