import {Button, Icon, Image} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import {IGroupPost} from '../global/types';
import {RootState} from '../redux/Store';
import UploadPhoto from '../components/ui/UploadPhoto';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../utils/fonts';
import {setGroupPost} from '../redux/OrganizationPostReducer';
import {updateOrganizationPost} from '../api/OrganizationPostApi';
import {uploadPhoto} from '../api/UploadPhotoApi';

const {useNotifications} = createNotifications();

const EditFundingScreen = ({navigation, route}: any) => {
  const item: IGroupPost = route.params.item;
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [description, setDescription] = useState('');
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imagePath, setImagePath] = useState('');
  const [isImageAlreadyUpload, setIsImageAlreadyUpload] = useState(false);

  const postImage = async (image: any) => {
    setImageUpload(image);
    if (image.path) {
      setImagePath(image.path);
    }
  };

  useEffect(() => {
    if (item) {
      setDescription(item.organizationposts.description);
      setImagePath(item.organizationposts.imageUrl);
      setImageUpload(item.organizationposts.imageUrl);
      setIsImageAlreadyUpload(true);
    }
  }, [item]);
  const handleCreatePost = () => {
    if (imageUpload === null && !isImageAlreadyUpload) {
      notify('error', {
        params: {description: 'Image is required.', title: 'Error'},
      });
      return;
    }
    if (isImageAlreadyUpload) {
      updateOrganizationPost(
        item.organizationposts.id,
        {
          imageUrl: imagePath,
          description,
        },
        accessToken,
      )
        .then((response: any) => {
          if (response.status === 200) {
            notify('success', {
              params: {
                description: 'Update funding post successful.',
                title: 'Success',
              },
            });
            dispatch(setGroupPost(response.data));
            navigation.goBack();
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
    } else {
      const dataForm = new FormData();
      if (imageUpload) {
        dataForm.append('file', {
          uri: imageUpload.path,
          name: imageUpload.filename || 'image.jpeg',
          type: imageUpload.mime || 'image/jpeg',
        });
        uploadPhoto(dataForm, accessToken).then((response: any) => {
          if (response.status === 200) {
            updateOrganizationPost(
              item.organizationposts.id,
              {
                imageUrl: response.data[0],
                description,
              },
              accessToken,
            )
              .then((response2: any) => {
                if (response2.status === 200) {
                  notify('success', {
                    params: {
                      description: 'Create funding post successful.',
                      title: 'Success',
                    },
                  });
                  dispatch(setGroupPost(response2.data));
                  navigation.goBack();
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
          } else {
            notify('error', {
              params: {description: response.data, title: 'Error'},
            });
          }
        });
      }
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
          placeholder="Bạn đang nghĩ gì?"
          placeholderTextColor={'#706d6d'}
          multiline
          numberOfLines={4}
          style={{
            fontFamily: getFontFamily('regular'),
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
        {imageUpload && imagePath ? (
          <>
            <View style={{position: 'relative', width: 350, height: 300}}>
              <Image
                source={{uri: imagePath}}
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
                  setImagePath('');
                }}>
                <Icon name="close" type="ionicon" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Icon
              name="camera"
              type="ionicon"
              size={60}
              color={Colors.greenPrimary}
              style={{marginTop: 20}}
              onPress={() => {
                setIsUploadVisible(!isUploadVisible);
              }}
            />
            <Text style={{color: Colors.postTitle, fontSize: 18}}>
              Thêm ảnh
            </Text>
          </>
        )}
      </View>

      <Button
        title="Cập nhật bài viết"
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

export default EditFundingScreen;
