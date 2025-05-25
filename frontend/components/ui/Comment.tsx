/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IComment,
  createCommentToPost,
  getCommentByPostId,
} from '../../api/PostApi';
import React, {useEffect, useState} from 'react';

import Colors from '../../global/Color';
import CommentItem from './CommentItem';
import {Icon} from 'react-native-paper';
import Modal from 'react-native-modal';
import {RootState} from '../../redux/Store';
import UploadPhoto from './UploadPhoto';
import {getFontFamily} from '../../utils/fonts';
import {scale} from '../../utils/scale';
import {uploadPhoto} from '../../api/UploadPhotoApi';
import {useNotifications} from 'react-native-notificated';
import {useSelector} from 'react-redux';
import {getCommentByOrganizationPostId} from '../../api/OrganizationPostApi';

const Comment = (props: {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  commentPostId: number;
  type: 'POST' | 'GROUP_POST';
}) => {
  const accessToken = useSelector((state: RootState) => state.token.key);

  const {isVisible, setVisible, commentPostId, type} = props;
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [comment, setComment] = useState('');
  const {notify} = useNotifications();
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [imageUpload, setImageUpload] = useState<any>(null);
  useEffect(() => {
    const getCommentList = async () => {
      // get comment list
      if (accessToken) {
        if (commentPostId === 0) {
          return;
        }
        setIsLoading(true);
        // get comment list
        getCommentByPostId(commentPostId, accessToken)
          .then(response => {
            setCommentList(response);
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error);
            notify('error', {
              params: {
                description: 'Không thể lấy data',
                title: 'Lỗi',
                style: {
                  multiline: 100,
                },
              },
            });
          });
      }
    };
    const getCommentListGroup = async () => {
      // get comment list
      if (accessToken) {
        if (commentPostId === 0) {
          return;
        }
        setIsLoading(true);
        getCommentByOrganizationPostId(commentPostId, accessToken)
          .then(response => {
            setCommentList(response);
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            notify('error', {
              params: {
                description: 'Không thể lấy data',
                title: 'Lỗi',
                style: {
                  multiline: 100,
                },
              },
            });
          });
      }
    };
    if (type === 'GROUP_POST') {
      getCommentListGroup();
    } else {
      getCommentList();
    }
  }, [accessToken, commentPostId, notify, isVisible]);

  const postImage = async (newImages: any) => {
    // Ensure newImages is always an array

    setImageUpload(newImages);
  };

  const handleCreateComment = async () => {
    setIsLoading(true);
    let imageUrl = null;
    if (imageUpload) {
      const dataForm = new FormData();
      dataForm.append('file', {
        uri: imageUpload.path,
        name: imageUpload.filename || 'image.jpeg',
        type: imageUpload.mime || 'image/jpeg',
      });
      const response: any = await uploadPhoto(dataForm, accessToken);
      if (response.status === 200) {
        imageUrl = response.data[0];
      }
    }
    const response: any = await createCommentToPost(
      commentPostId,
      {content: comment, imageUrl: imageUrl},
      accessToken,
    );
    if (response.status === 200) {
      setComment('');
      setImageUpload(null);
      getCommentByPostId(commentPostId, accessToken)
        .then(response2 => {
          setCommentList(response2);
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
          notify('error', {
            params: {description: 'Không thể lấy data', title: 'Lỗi'},
          });
        });
    } else {
      notify('error', {
        params: {description: 'Không thể tạo comment', title: 'Lỗi'},
      });
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      style={styles.modal}
      hideModalContentWhileAnimating={true}
      avoidKeyboard={true}
      onBackButtonPress={() => {
        setVisible(false);
        setImageUpload(null);
      }}
      onBackdropPress={() => {
        setVisible(false);
        setImageUpload(null);
      }}
      isVisible={isVisible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.4}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      swipeDirection={['down', 'left', 'right']}
      onSwipeComplete={() => {
        setVisible(false);
        setImageUpload(null);
      }}
      propagateSwipe={true}>
      <View style={styles.modalContent}>
        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.gray} />
          </View>
        )}
        <UploadPhoto
          isVisible={isUploadVisible}
          setVisible={setIsUploadVisible}
          height={300}
          width={350}
          isCircle={false}
          postImage={postImage}
        />
        <View style={styles.barIcon} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Bình luận</Text>
        </View>
        <FlatList
          data={commentList}
          renderItem={({item}) => <CommentItem comment={item} />}
          keyExtractor={(item: any) => item.id.toString()}
          ListFooterComponent={<View style={{height: 70}} />}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }}>
          {imageUpload && (
            <View style={{padding: 10}}>
              <TouchableOpacity
                onPress={() => setImageUpload(null)}
                style={{
                  position: 'absolute',
                  top: scale(14),
                  left: scale(56),
                  zIndex: 10,
                  backgroundColor: Colors.white,
                  borderRadius: scale(100),
                  padding: scale(2),
                }}>
                <Icon source="close" size={14} color={Colors.black} />
              </TouchableOpacity>
              <Image
                source={{uri: imageUpload.path}}
                style={{
                  width: scale(70),
                  height: scale(70),
                  borderRadius: scale(10),
                  borderWidth: 1,
                  borderColor: Colors.gray,
                }}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              padding: 10,
              borderTopWidth: 1,
              borderTopColor: Colors.gray,
              backgroundColor: Colors.white,
            }}>
            <TouchableOpacity
              onPress={() => setIsUploadVisible(true)}
              style={{marginTop: 12}}>
              <Icon source="camera" size={24} color={Colors.greenPrimary} />
            </TouchableOpacity>
            <TextInput
              multiline
              placeholder="Viết bình luận"
              value={comment}
              onChangeText={setComment}
              style={{
                backgroundColor: Colors.background,
                borderRadius: 20,
                padding: 10,
                flex: 1,
                marginHorizontal: 10,
              }}
            />
            <TouchableOpacity
              onPress={handleCreateComment}
              disabled={!comment && !imageUpload}
              style={{marginTop: 12}}>
              <Image
                source={require('../../assets/images/send.png')}
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Comment;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 5,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
    alignSelf: 'center',
  },
  panelTitle: {
    marginTop: 10,
    fontSize: 20,
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
  },
});
