/* eslint-disable react-native/no-inline-styles */
import {Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import Colors from '../../global/Color';
import {Button, Dialog, Menu, Portal, RadioButton} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';
import {deletePost, reportPost} from '../../api/PostApi';
import {deleteMyPost} from '../../redux/SharingPostReducer';
import {useNotifications} from 'react-native-notificated';

const PostRenderItem = ({item, navigation, location, distance}: any) => {
  const handleOnPress = () => {
    navigation.navigate('PostDetail', {item, location});
  };
  const {notify} = useNotifications();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
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
        notify('success', {
          params: {
            description: 'Report post successfully',
            title: 'Report',
            style: {multiline: 100},
          },
        });
      }
      setVisibleDialogReport(false);
      setReason('Spam or Misleading Information');
      setDescriptionReason('');
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={handleOnPress}
      onLongPress={event => handleOnLongPress(event)}>
      <View
        style={{
          padding: 10,
          marginVertical: 4,
          backgroundColor: 'white',
          borderRadius: 8,
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Portal>
          <Dialog
            visible={visibleDialogDelete}
            onDismiss={() => setVisibleDialogDelete(false)}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={{textAlign: 'center'}}>
              Confirm Delete Post
            </Dialog.Title>
            <Dialog.Content>
              <Text>Do you want to delete this post?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => setVisibleDialogDelete(false)}
                textColor="red">
                Cancel
              </Button>
              <Button onPress={() => handleDeletePost()}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog
            visible={visibleDialogReport}
            onDismiss={() => setVisibleDialogReport(false)}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={{textAlign: 'center'}}>
              Report this post
            </Dialog.Title>
            <Dialog.Content>
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
                  <Text>Spam or Misleading Information</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <RadioButton value="Offensive Content" />
                  <Text>Offensive Content</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <RadioButton value="Scam or Fraudulent Activity" />
                  <Text>Scam or Fraudulent Activity</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <RadioButton value="Health and Safety Concerns" />
                  <Text>Health and Safety Concerns</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}>
                  <RadioButton value="Other" />
                  <Text>Other</Text>
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
                    placeholder="Enter your reason"
                    value={descriptionReason}
                    multiline
                    onChangeText={text => setDescriptionReason(text)}
                  />
                </View>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setVisibleDialogReport(false);
                  setReason('Spam or Misleading Information');
                  setDescriptionReason('');
                }}
                textColor="red">
                Cancel
              </Button>
              <Button onPress={() => handleReportPost()}>Report</Button>
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
                title="Edit"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  setVisibleDialogDelete(true);
                }}
                title="Delete"
                leadingIcon="delete"
              />
            </>
          )}
          <Menu.Item
            onPress={() => {
              setVisible(false);
              setVisibleDialogReport(true);
            }}
            title="Report"
            leadingIcon="alert-octagon"
          />
        </Menu>
        <Image
          source={{
            uri: item.imageUrl
              ? item.imageUrl
              : 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={{width: 150, height: 150, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
                color: Colors.postTitle,
              }}>
              {item.title}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="location-sharp"
                type="ionicon"
                size={14}
                color="black"
              />
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {distance < 0.1
                  ? `${(distance * 1000).toFixed(0)} m`
                  : `${distance.toFixed(2)} Km`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Description:{' '}
                </Text>
                {item.description}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Expired date:{' '}
                </Text>
                {new Date(item.expiredDate).toLocaleDateString()}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Pickup start:{' '}
                </Text>
                {new Date(item.pickUpStartDate).toLocaleDateString()}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Pickup end:{' '}
                </Text>
                {new Date(item.pickUpEndDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {new Date(item.createdDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default PostRenderItem;
