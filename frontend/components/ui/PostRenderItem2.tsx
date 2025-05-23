import {
  Button,
  Dialog,
  Icon,
  Menu,
  Portal,
  RadioButton,
} from 'react-native-paper';
/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {calculateExpiredDate, timeAgo} from '../../utils/helper';
import {deleteMyPost, likePostReducer} from '../../redux/SharingPostReducer';
import {deletePost, likePost, reportPost} from '../../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../global/Color';
import ImageSwiper from './ImageSwiper';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {getInfoUserById} from '../../api/AccountsApi';
import {notify} from 'react-native-notificated';

const PostRenderItem2 = (props: any) => {
  const {
    item,
    setCommentPostId,
    setShowComment,
    navigation,
    location,
    setDetailPost,
  } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const liked = useSelector(
    (state: RootState) =>
      state.sharingPost.HomePage.find(post => post.id === item.id)?.isLiked,
  );
  const screenWidth = Dimensions.get('window').width;
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDialogDelete, setVisibleDialogDelete] =
    useState<boolean>(false);
  const [visibleDialogReport, setVisibleDialogReport] =
    useState<boolean>(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0});
  const [reason, setReason] = useState<string>(
    'Spam or Misleading Information',
  );
  const [descriptionReason, setDescriptionReason] = useState<string>('');
  const [createPostUser, setCreatePostUser] = useState<any>();

  const createdDate = timeAgo(item.createdDate);
  const expiredString = calculateExpiredDate(new Date(item.expiredDate));

  const openMenu = () => {
    setReason('Spam or Misleading Information');
    setDescriptionReason('');
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const handleOnLongPress = (event: any) => {
    const anchorEvent = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    setAnchor(anchorEvent);
    openMenu();
  };

  const handleDeletePost = async () => {
    if (accessToken && item.createdById === userInfo.id) {
      const response: any = await deletePost(item.id, accessToken);
      if (response.status === 200) {
        dispatch(deleteMyPost(item.id));
      }
    }
    setVisibleDialogDelete(false);
  };
  const handleReportPost = async () => {
    if (accessToken) {
      const response: any = await reportPost(accessToken, {
        title: reason,
        description: descriptionReason,
        imageUrl: item.images[0],
        status: 'PENDING',
        linkId: item.id,
        note: '',
        type: 'POST',
        senderId: userInfo.id,
        accusedId: item.createdById,
        senderName: userInfo.name,
      });
      if (response.status === 200) {
        console.log('Report post success');
        notify('success', {
          params: {
            description: 'Báo cáo thành công',
            title: 'Thành công',
          },
        });
      }
      setVisibleDialogReport(false);
    }
  };
  useEffect(() => {
    const getInfoUserCreatePost = async () => {
      // get info user create post
      if (accessToken && item.createdById !== userInfo.id) {
        // get info user create post
        getInfoUserById(item.createdById, accessToken).then((response: any) => {
          if (response.status === 200) {
            setCreatePostUser(response.data);
          }
        });
      }
    };
    getInfoUserCreatePost();
  }, [accessToken, item.createdById, userInfo.id]);

  const handleLiked = async () => {
    dispatch(likePostReducer(item.id));
    const response: any = await likePost(item.id, accessToken);
    if (response.status !== 200) {
      dispatch(likePostReducer(item.id));
    }
  };

  const handleShowComment = () => {
    setShowComment(true);
    setCommentPostId(item.id);
  };
  const handleGoToDetail = () => {
    navigation.navigate('PostDetail2', {
      item,
      location,
      createdDate,
      expiredString,
    });
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        width: screenWidth * 0.9,
        alignSelf: 'center',
        marginTop: 16,
        padding: 16,
        borderRadius: 30,
      }}>
      <Portal>
        <Dialog
          visible={visibleDialogDelete}
          onDismiss={() => setVisibleDialogDelete(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{textAlign: 'center'}}>
            Xác nhận xóa bài viết
          </Dialog.Title>
          <Dialog.Content>
            <Text>Bạn có muốn xóa bài viết này không?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setVisibleDialogDelete(false)}
              textColor="red">
              Hủy
            </Button>
            <Button onPress={() => handleDeletePost()}>Xóa</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          style={{backgroundColor: 'white'}}
          visible={visibleDialogReport}
          onDismiss={() => setVisibleDialogReport(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title
            style={{textAlign: 'center', fontFamily: getFontFamily('regular')}}>
            Báo cáo bài viết
          </Dialog.Title>
          <Dialog.Content style={{paddingHorizontal: 0}}>
            <RadioButton.Group
              onValueChange={newValue => setReason(newValue)}
              value={reason}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Spam or Misleading Information" />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Bài viết linh tinh, lặp lại, thông tin sai lệch
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Offensive Content" />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Nội dung không lành mạnh
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Scam or Fraudulent Activity" />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Bài viết lừa đảo
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Health and Safety Concerns" />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Bài viết chứa các lo ngại về sức khỏe
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Other" />
                <Text style={{fontFamily: getFontFamily('regular')}}>Khác</Text>
              </View>
            </RadioButton.Group>
            {reason === 'Other' && (
              <View style={{marginHorizontal: 10}}>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    color: 'black',
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                  }}
                  placeholder="Nhập lý do của bạn"
                  value={descriptionReason}
                  multiline
                  onChangeText={text => setDescriptionReason(text)}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => setVisibleDialogReport(false)}
              textColor="red">
              Hủy
            </Button>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => handleReportPost()}>
              Báo cáo
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={anchor}
        contentStyle={{backgroundColor: 'white'}}>
        {item.createdById === userInfo.id && (
          <>
            <Menu.Item
              onPress={() => {
                setVisible(false);
                navigation.navigate('EditPost', {
                  location: location,
                  accessToken: accessToken,
                  item: item,
                });
              }}
              title="Sửa bài viết"
              leadingIcon="pencil"
            />
            <Menu.Item
              onPress={() => {
                setVisible(false);
                setVisibleDialogDelete(true);
              }}
              title="Xóa bài viết"
              leadingIcon="delete"
            />
          </>
        )}
        <Menu.Item
          onPress={() => {
            setVisible(false);
            setVisibleDialogReport(true);
          }}
          title="Báo cáo"
          leadingIcon="alert-octagon"
        />
      </Menu>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={handleGoToDetail}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PersonalPageOfOther', {id: item.createdById})
          }>
          <Image
            source={{
              uri:
                createPostUser?.imageUrl ||
                userInfo.imageUrl ||
                'https://randomuser.me/api/portraits/men/36.jpg',
            }}
            style={{width: 50, height: 50, borderRadius: 25}}
          />
        </TouchableOpacity>
        <View style={{alignSelf: 'center', marginLeft: 16}}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: getFontFamily('semibold'),
              color: Colors.text,
            }}>
            {createPostUser?.name || userInfo.name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/images/ion_earth.png')}
              style={{width: 20, height: 20}}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: getFontFamily('regular'),
                color: Colors.grayText,
                marginLeft: 4,
              }}>
              {createdDate}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={event => handleOnLongPress(event)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.background,
            borderRadius: 20,
            width: 40,
            height: 40,
            alignSelf: 'center',
            position: 'absolute',
            right: 0,
          }}>
          <Icon
            source={'dots-horizontal'}
            size={30}
            color={Colors.grayPrimary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/foodIcon.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: getFontFamily('bold'),
                color: Colors.text,
                marginLeft: 16,
              }}>
              {item.title}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/distance.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
                color: Colors.text,
                marginLeft: 16,
              }}>
              Cách bạn{' '}
              {item?.distance < 0.1
                ? `${(item?.distance * 1000).toFixed(2)}m`
                : `${item?.distance.toFixed(2)}km`}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/clock.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
                color: expiredString === 'Hết hạn' ? 'red' : Colors.text,
                marginLeft: 16,
              }}>
              {expiredString === 'Hết hạn'
                ? 'Hết hạn'
                : `Hết hạn sau ${expiredString}`}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/part.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
                color: item.portion === 0 ? 'red' : Colors.text,
                marginLeft: 16,
              }}>
              {item.portion > 0 ? `Còn ${item.portion} phần` : 'Hết phần'}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/scales.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
                color: Colors.text,
                marginLeft: 16,
              }}>
              {item.weight} kg
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/pickUp.png')}
            style={{width: 25, height: 25}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
                color:
                  new Date(item.pickUpEndDate) < new Date()
                    ? 'red'
                    : Colors.text,
                marginLeft: 16,
              }}>
              Lấy từ ngày {new Date(item.pickUpStartDate).toLocaleDateString()}{' '}
              đến ngày {new Date(item.pickUpEndDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: screenWidth * 0.85,
            height: screenWidth,
            borderRadius: 20,
            marginTop: 10,
            overflow: 'hidden',
            alignSelf: 'center',
            pointerEvents: 'box-none',
          }}>
          <ImageSwiper
            images={item.images}
            onPressImage={() => {
              const detailPost = {
                item,
                user:
                  item.createdById !== userInfo.id ? createPostUser : userInfo,
                distance: item.distance,
              };

              setDetailPost(detailPost);
            }}
          />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
          <TouchableOpacity onPress={handleLiked}>
            <Image
              source={
                liked
                  ? require('../../assets/images/liked.png')
                  : require('../../assets/images/like.png')
              }
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={handleShowComment}>
            <Image
              source={require('../../assets/images/comment.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../assets/images/share.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              fontFamily: getFontFamily('regular'),
              color: Colors.black,
              fontSize: 14,
            }}>
            {liked
              ? item.likeCount === 1
                ? 'Bạn'
                : `Bạn và ${item.likeCount - 1} người khác`
              : `${item.likeCount} người`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostRenderItem2;
