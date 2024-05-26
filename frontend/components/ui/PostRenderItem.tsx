/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icon, Image} from '@rneui/themed';
import Colors from '../../global/Color';
import getDistance from 'geolib/es/getDistance';
import {Button, Dialog, Menu, Portal} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';
import {deletePost} from '../../api/PostApi';
import {deleteMyPost} from '../../redux/SharingPostReducer';

const PostRenderItem = ({item, navigation, location}: any) => {
  const handleOnPress = () => {
    navigation.navigate('PostDetail', {item, location});
  };
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);
  const [anchor, setAnchor] = useState({x: 0, y: 0});

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);
  useEffect(() => {
    const getDistanceFromLocation = async () => {
      if (location && location.latitude && location.longitude) {
        setDistance(
          getDistance(
            {latitude: item.latitude, longitude: item.longitude},
            {latitude: location.latitude, longitude: location.longitude},
          ) / 1000,
        );
      }
    };
    getDistanceFromLocation();
  }, [item.latitude, item.longitude, location]);

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
            visible={visibleDialog}
            onDismiss={() => setVisibleDialog(false)}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={{textAlign: 'center'}}>
              Confirm Delete Post
            </Dialog.Title>
            <Dialog.Content>
              <Text>Do you want to delete this post?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisibleDialog(false)} textColor="red">
                Cancel
              </Button>
              <Button onPress={() => handleDeletePost()}>Delete</Button>
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
                  setVisibleDialog(true);
                }}
                title="Delete"
                leadingIcon="delete"
              />
            </>
          )}
          <Menu.Item
            onPress={() => {}}
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
