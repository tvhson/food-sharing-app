/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {getFontFamily} from '../../utils/fonts';
import Colors from '../../global/Color';
import {
  Button,
  Dialog,
  Icon,
  Menu,
  Portal,
  RadioButton,
} from 'react-native-paper';
import ImageSwiper from './ImageSwiper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';
import {deletePost, reportPost} from '../../api/PostApi';
import {deleteMyPost} from '../../redux/SharingPostReducer';

const PostRenderItem2 = (props: any) => {
  const {
    item,
    setCommentPostId,
    setShowComment,
    navigation,
    distance,
    location,
  } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const screenWidth = Dimensions.get('window').width;
  const [liked, setLiked] = useState(false);
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

  const createdDate = timeAgo(item.createdDate);

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

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
        imageUrl: item.imageUrl,
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
      }
      setVisibleDialogReport(false);
    }
  };

  const handleLiked = () => {
    setLiked(!liked);
  };

  const handleShowComment = () => {
    setShowComment(true);
    //setCommentPostId(item.id);
  };
  const handleGoToDetail = () => {
    navigation.navigate('PostDetail2', {
      item,
      location,
      createdDate,
      distance,
      expiredString,
    });
  };

  const calculateExpiredDate = (expiredDate: Date) => {
    const now = new Date();
    const diff = expiredDate.getTime() - now.getTime();

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    if (years > 0) {
      return `${years} năm`;
    }

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    if (months > 0) {
      return `${months} tháng`;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return `${days} ngày`;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) {
      return `${hours} tiếng`;
    }

    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) {
      return `${minutes} phút`;
    }

    return 'Hết hạn';
  };
  function timeAgo(dateInput: Date | string | number) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error('date must be a valid Date, string, or number');
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      if (diffInSeconds < 0) {
        return 'Vừa xong';
      }
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} tuần trước`;
    }

    if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} năm trước`;
  }

  const expiredString = calculateExpiredDate(new Date(item.expiredDate));

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
          visible={visibleDialogReport}
          onDismiss={() => setVisibleDialogReport(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{textAlign: 'center'}}>
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
                <Text>Bài viết linh tinh, lặp lại, thông tin sai lệch</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Offensive Content" />
                <Text>Nội dung không lành mạnh</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Scam or Fraudulent Activity" />
                <Text>Bài viết lừa đảo</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Health and Safety Concerns" />
                <Text>Bài viết chứa các lo ngại về sức khỏe</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 20,
                }}>
                <RadioButton value="Other" />
                <Text>Khác</Text>
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
              onPress={() => setVisibleDialogReport(false)}
              textColor="red">
              Hủy
            </Button>
            <Button onPress={() => handleReportPost()}>Báo cáo</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
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
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/MealLogo.png')}
            style={{width: 50, height: 50}}
          />
        </TouchableOpacity>
        <View style={{alignSelf: 'center', marginLeft: 16}}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: getFontFamily('semibold'),
              color: Colors.text,
            }}>
            Nguyen Khoi
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
              {distance < 0.1 ? `${distance * 1000}m` : `${distance}km`}
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
                color: Colors.text,
                marginLeft: 16,
              }}>
              Còn 2 phần
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
          <ImageSwiper images={item.images} />
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
            {liked ? 'Bạn và 10 người khác' : '10 người'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostRenderItem2;

const styles = StyleSheet.create({});
