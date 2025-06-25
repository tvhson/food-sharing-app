import {
  Button,
  Dialog,
  Icon,
  Menu,
  Portal,
  RadioButton,
} from 'react-native-paper';
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  SharingPost,
  deleteMyPost,
  likePostReducer,
} from '../../redux/SharingPostReducer';
import {calculateExpiredDate, timeAgo} from '../../utils/helper';
import {deletePost, likePost, reportPost} from '../../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../global/Color';
import ImageSwiper from './ImageSwiper';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {notify} from 'react-native-notificated';
import {moderateScale, scale} from '../../utils/scale';

const PostRenderItem2 = (props: any) => {
  const {
    item,
    setCommentPostId,
    setShowComment,
    navigation,
    location,
    setDetailPost,
  }: {
    item: SharingPost;
    setCommentPostId: any;
    setShowComment: any;
    navigation: any;
    location: any;
    setDetailPost: any;
  } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const liked = useSelector(
    (state: RootState) =>
      state.sharingPost.HomePage.find(post => post.id === item.id)?.isLiked,
  );
  const likeCount = useSelector(
    (state: RootState) =>
      state.sharingPost.HomePage.find(post => post.id === item.id)?.likeCount,
  );
  const screenWidth = Dimensions.get('window').width;
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDialogDelete, setVisibleDialogDelete] =
    useState<boolean>(false);
  const [visibleDialogReport, setVisibleDialogReport] =
    useState<boolean>(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0});
  const [reason, setReason] = useState<string>(
    'Bài viết linh tinh, lặp lại, thông tin sai lệch',
  );
  const [descriptionReason, setDescriptionReason] = useState<string>('');

  const createdDate = timeAgo(item.createdDate);
  const expiredString = calculateExpiredDate(new Date(item.expiredDate));

  const openMenu = () => {
    setReason('Bài viết linh tinh, lặp lại, thông tin sai lệch');
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
    if (accessToken && item.author.id === userInfo.id) {
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
        accusedId: item.author.id,
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
        marginTop: scale(16),
        padding: scale(16),
        borderRadius: scale(30),
      }}>
      <Portal>
        <Dialog
          visible={visibleDialogDelete}
          onDismiss={() => setVisibleDialogDelete(false)}>
          <Dialog.Icon icon="alert" color={Colors.red} />
          <Dialog.Title
            style={{textAlign: 'center', fontFamily: getFontFamily('regular')}}>
            Xác nhận xóa bài viết
          </Dialog.Title>
          <Dialog.Content>
            <Text>Bạn có muốn xóa bài viết này không?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => setVisibleDialogDelete(false)}
              textColor={Colors.gray500}>
              Hủy
            </Button>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => handleDeletePost()}
              textColor={Colors.red}>
              Xóa
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog
          style={{backgroundColor: 'white'}}
          visible={visibleDialogReport}
          onDismiss={() => setVisibleDialogReport(false)}>
          <Dialog.Icon icon="alert" color={Colors.red} />
          <Dialog.Title
            style={{textAlign: 'center', fontFamily: getFontFamily('regular')}}>
            Báo cáo bài viết
          </Dialog.Title>
          <Dialog.Content style={{paddingHorizontal: scale(16)}}>
            <RadioButton.Group
              onValueChange={newValue => setReason(newValue)}
              value={reason}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Bài viết linh tinh, lặp lại, thông tin sai lệch"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Bài viết linh tinh, lặp lại, thông tin sai lệch
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Nội dung không lành mạnh"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Nội dung không lành mạnh
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Bài viết lừa đảo"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Bài viết lừa đảo
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Bài viết chứa các lo ngại về sức khỏe"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Bài viết chứa các lo ngại về sức khỏe
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton value="Khác" color={Colors.greenPrimary} />
                <Text style={{fontFamily: getFontFamily('regular')}}>Khác</Text>
              </View>
            </RadioButton.Group>
            {reason === 'Khác' && (
              <View
                style={{paddingHorizontal: scale(10), marginTop: scale(10)}}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.gray500,
                    borderRadius: scale(10),
                    color: 'black',
                    fontSize: moderateScale(14),
                    fontFamily: getFontFamily('regular'),
                  }}
                  placeholder="Nhập lý do của bạn"
                  value={descriptionReason}
                  multiline
                  numberOfLines={4}
                  onChangeText={text => setDescriptionReason(text)}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => setVisibleDialogReport(false)}
              textColor={Colors.gray500}>
              Hủy
            </Button>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => handleReportPost()}
              textColor={Colors.red}>
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
        {item.author.id === userInfo.id && (
          <>
            <Menu.Item
              onPress={() => {
                setVisible(false);
                navigation.navigate('EditPost', {
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
            navigation.navigate('PersonalPageOfOther', {id: item.author.id})
          }>
          <Image
            source={{
              uri:
                item.author.imageUrl ||
                userInfo.imageUrl ||
                'https://randomuser.me/api/portraits/men/36.jpg',
            }}
            style={{
              width: scale(50),
              height: scale(50),
              borderRadius: scale(25),
            }}
          />
        </TouchableOpacity>
        <View style={{alignSelf: 'center', marginLeft: scale(16)}}>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontFamily: getFontFamily('semibold'),
              color: Colors.text,
            }}>
            {item.author.name || userInfo.name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/images/ion_earth.png')}
              style={{width: scale(20), height: scale(20)}}
            />
            <Text
              style={{
                fontSize: moderateScale(12),
                fontFamily: getFontFamily('regular'),
                color: Colors.grayText,
                marginLeft: scale(4),
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
            borderRadius: scale(20),
            width: scale(40),
            height: scale(40),
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
            marginTop: scale(10),
          }}>
          <Image
            source={require('../../assets/images/foodIcon.png')}
            style={{width: scale(25), height: scale(25)}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: moderateScale(24),
                fontFamily: getFontFamily('bold'),
                color: Colors.text,
                marginLeft: scale(16),
              }}>
              {item.title}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scale(10),
          }}>
          <Image
            source={require('../../assets/images/distance.png')}
            style={{width: scale(25), height: scale(25)}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: Colors.text,
                marginLeft: scale(16),
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
            marginTop: scale(10),
          }}>
          <Image
            source={require('../../assets/images/clock.png')}
            style={{width: scale(25), height: scale(25)}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: expiredString === 'Hết hạn' ? 'red' : Colors.text,
                marginLeft: scale(16),
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
            marginTop: scale(10),
          }}>
          <Image
            source={require('../../assets/images/part.png')}
            style={{width: scale(25), height: scale(25)}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: item.portion === 0 ? 'red' : Colors.text,
                marginLeft: scale(16),
              }}>
              {item.portion > 0 ? `Còn ${item.portion} phần` : 'Hết phần'}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scale(10),
          }}>
          <Image
            source={require('../../assets/images/scales.png')}
            style={{width: scale(25), height: scale(25)}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: Colors.text,
                marginLeft: scale(16),
              }}>
              {item.weight} kg
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scale(10),
          }}>
          <Image
            source={require('../../assets/images/pickUp.png')}
            style={{width: scale(25), height: scale(25)}}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color:
                  new Date(item.pickUpEndDate) < new Date()
                    ? 'red'
                    : Colors.text,
                marginLeft: scale(16),
              }}>
              Lấy từ ngày{' '}
              {new Date(item.pickUpStartDate).toLocaleDateString('vi-VN')} đến
              ngày {new Date(item.pickUpEndDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: screenWidth * 0.85,
            height: screenWidth,
            borderRadius: scale(20),
            marginTop: scale(10),
            overflow: 'hidden',
            alignSelf: 'center',
            pointerEvents: 'box-none',
          }}>
          <ImageSwiper
            images={item.images}
            onPressImage={() => {
              const detailPost = {
                item,
                user: item.author.id !== userInfo.id ? item.author : userInfo,
                distance: item.distance,
              };

              setDetailPost(detailPost);
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scale(15),
          }}>
          <TouchableOpacity onPress={handleLiked}>
            <Image
              source={
                liked
                  ? require('../../assets/images/liked.png')
                  : require('../../assets/images/like.png')
              }
              style={{width: scale(50), height: scale(50)}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: scale(10)}}
            onPress={handleShowComment}>
            <Image
              source={require('../../assets/images/comment.png')}
              style={{width: scale(50), height: scale(50)}}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../assets/images/share.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity> */}
          <Text
            style={{
              marginLeft: scale(10),
              fontFamily: getFontFamily('regular'),
              color: Colors.black,
              fontSize: moderateScale(14),
            }}>
            {likeCount && `${likeCount} người`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostRenderItem2;
