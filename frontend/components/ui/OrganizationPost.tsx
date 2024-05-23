/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Button, Dialog, Icon, Menu, Portal} from 'react-native-paper';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint} from 'react-native-redash';
import {RootState} from '../../redux/Store';
import {useDispatch, useSelector} from 'react-redux';
import {deleteOrganizationPost} from '../../api/OrganizationPostApi';
import {deleteMyFundingPost} from '../../redux/OrganizationPostReducer';

const {width: wWidth, height} = Dimensions.get('window');

const SNAP_POINTS = [-wWidth, 0, wWidth];
const aspectRatio = 300 / 350;
const DURATION = 250;

export const OrganizationPost = ({
  item,
  shuffleBack,
  index,
  navigation,
}: any) => {
  const [anchor, setAnchor] = useState({x: 0, y: 0});
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
  const offset = useSharedValue({x: 0, y: 0});
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-height);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const delay = index * DURATION;
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  const theta = 0;
  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(0, {duration: DURATION, easing: Easing.inOut(Easing.ease)}),
    );
    rotateZ.value = withDelay(delay, withSpring(theta));
  }, [delay, index, rotateZ, theta, translateY]);

  useAnimatedReaction(
    () => shuffleBack.value,
    v => {
      if (v) {
        const duration = 150 * index;
        translateX.value = withDelay(
          duration,
          withSpring(0, {}, () => {
            shuffleBack.value = false;
          }),
        );
        rotateZ.value = withDelay(duration, withSpring(theta));
      }
    },
  );
  const gesture = Gesture.Pan()
    .onBegin(() => {
      // offset.value = {x: translateX.value, y: translateY.value};
      // rotateZ.value = withTiming(0);
      // scale.value = withTiming(1.1);
    })
    .onUpdate(({translationX, translationY}) => {
      translateX.value = offset.value.x + translationX;
      translateY.value = offset.value.y + translationY;
    })
    .onEnd(({velocityX, velocityY}) => {
      const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS);
      translateX.value = withSpring(dest, {velocity: velocityX});
      translateY.value = withSpring(0, {velocity: velocityY});
      scale.value = withTiming(1, {}, () => {
        const isLast = index === 0;
        const isSwipedLeftOrRight = dest !== 0;
        if (isLast && isSwipedLeftOrRight) {
          shuffleBack.value = true;
        }
      });
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      {perspective: 100},
      {rotateX: '0deg'},
      {translateX: translateX.value},
      {translateY: translateY.value},
      {rotateY: `${rotateZ.value / 10}deg`},
      {rotateZ: `${rotateZ.value}deg`},
      {scale: scale.value},
    ],
  }));
  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  const handleDeletePost = async () => {
    if (accessToken && item.accounts.id === userInfo.id) {
      const response: any = await deleteOrganizationPost(item.id, accessToken);
      if (response.status === 200) {
        dispatch(deleteMyFundingPost(item.id));
      }
    }
  };

  const handleOnLongPress = (event: any) => {
    const anchorEvent = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    setAnchor(anchorEvent);
    openMenu();
  };
  return (
    <View style={styles.container} pointerEvents="box-none">
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, style]}>
          <TouchableOpacity
            onLongPress={event => handleOnLongPress(event)}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('OrganizationPostDetail', {item: item});
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
                  <Button
                    onPress={() => setVisibleDialog(false)}
                    textColor="red">
                    Cancel
                  </Button>
                  <Button onPress={() => handleDeletePost()}>Delete</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
              {item.accounts.id === userInfo.id && (
                <>
                  <Menu.Item
                    onPress={() => {
                      setVisible(false);
                      navigation.navigate('EditFundingPost', {
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
                uri:
                  item.organizationposts?.imageUrl ||
                  'https://via.placeholder.com/200',
              }}
              style={{
                width: 350,
                height: 350 * aspectRatio,
              }}
              resizeMode="contain"
            />
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                }}>
                <Text
                  style={{fontSize: 40, color: 'black', fontWeight: 'bold'}}>
                  {item.organizationposts?.title}
                </Text>
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 20,
                    color: 'black',
                  }}>
                  {item.organizationposts?.description}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                  }}>
                  <Icon source="account-multiple" size={20} color="black" />
                  <Text style={{fontSize: 14, color: 'black'}}>
                    {item.organizationposts?.peopleAttended} people attended
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#b2f0ac',
    borderRadius: 10,
    width: 350,
    height: 500,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
});
