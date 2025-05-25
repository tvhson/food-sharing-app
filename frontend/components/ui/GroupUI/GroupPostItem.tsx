import {
  Button,
  Dialog,
  Icon,
  Menu,
  Portal,
  RadioButton,
} from 'react-native-paper';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../../global/Color';
import {IGroupPost} from '../../../global/types';
import ImageSwiper from '../ImageSwiper';
import {RootState} from '../../../redux/Store';
import {Route} from '../../../constants/route';
import {getFontFamily} from '../../../utils/fonts';
import {getInfoUserById} from '../../../api/AccountsApi';
import {timeAgo} from '../../../utils/helper';
import {useNavigation} from '@react-navigation/native';

interface GroupPostItemProps {
  item: IGroupPost;
  setCommentPostId: (id: number) => void;
  setShowComment: (show: boolean) => void;
}

const GroupPostItem = (props: GroupPostItemProps) => {
  const {item, setCommentPostId, setShowComment} = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const navigation: any = useNavigation();

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

  const createdDate = timeAgo(item.organizationposts.createdDate);

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
    if (accessToken && item.accounts.id === userInfo.id) {
      //   const response: any = await deletePost(item.id, accessToken);
      //   if (response.status === 200) {
      //     dispatch(deleteMyPost(item.id));
      //   }
    }
    setVisibleDialogDelete(false);
  };
  const handleReportPost = async () => {
    if (accessToken) {
      //   const response: any = await reportPost(accessToken, {
      //     title: reason,
      //     description: descriptionReason,
      //     imageUrl: item.images[0],
      //     status: 'PENDING',
      //     linkId: item.id,
      //     note: '',
      //     type: 'POST',
      //     senderId: userInfo.id,
      //     accusedId: item.createdById,
      //     senderName: userInfo.name,
      //   });
      //   if (response.status === 200) {
      //     console.log('Report post success');
      //     notify('success', {
      //       params: {
      //         description: 'Báo cáo thành công',
      //         title: 'Thành công',
      //       },
      //     });
      //   }
      setVisibleDialogReport(false);
    }
  };

  const handleLiked = async () => {
    // dispatch(likePostReducer(item.id));
    // const response: any = await likePost(item.id, accessToken);
    // if (response.status !== 200) {
    //   dispatch(likePostReducer(item.id));
    // }
  };

  const handleShowComment = () => {
    setShowComment(true);
    setCommentPostId(item.organizationposts.id);
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
        {item.accounts.id === userInfo.id && (
          <>
            <Menu.Item
              onPress={() => {
                setVisible(false);
                // navigation.navigate('EditPost', {
                //   location: location,
                //   accessToken: accessToken,
                //   item: item,
                // });
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
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PersonalPageOfOther', {id: item.accounts.id})
          }>
          <Image
            source={{
              uri:
                item.accounts.imageUrl ||
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
            {item.accounts.name || userInfo.name}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../../assets/images/ion_earth.png')}
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
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: getFontFamily('regular'),
                color: Colors.text,
                marginLeft: 16,
              }}>
              {item.organizationposts.description}
            </Text>
          </View>
        </View>

        {item.organizationposts.imageUrl && (
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
            <ImageSwiper images={[item.organizationposts.imageUrl]} />
          </View>
        )}

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
          <TouchableOpacity onPress={handleLiked}>
            <Image
              source={
                item.organizationposts.attended
                  ? require('../../../assets/images/liked.png')
                  : require('../../../assets/images/like.png')
              }
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={handleShowComment}>
            <Image
              source={require('../../../assets/images/comment.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../../assets/images/share.png')}
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
            {item.organizationposts.attended
              ? item.organizationposts.peopleAttended === 1
                ? 'Bạn'
                : `Bạn và ${
                    item.organizationposts.peopleAttended - 1
                  } người khác`
              : `${item.organizationposts.peopleAttended} người`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GroupPostItem;
