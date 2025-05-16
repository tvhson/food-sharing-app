/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import {IGroup, IGroupPost} from '../../global/types';
import React, {useState} from 'react';
import {moderateScale, scale, verticalScale} from '../../utils/scale';

import Colors from '../../global/Color';
import GroupPostItem from '../../components/ui/GroupUI/GroupPostItem';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {getFontFamily} from '../../utils/fonts';
import {screenHeight} from '../../global/Constant';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const groupInfo: IGroup = {
  id: 1,
  name: 'Group 1',
  description: 'Description 1',
  image: 'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
  numberOfMembers: 100,
  numberOfRequests: 10,
  // joinType: 'public',
  joinType: 'private',
  isJoined: true,
  createdById: 1,
};

const groupPosts: IGroupPost[] = [
  {
    id: 1,
    description:
      'Description 1asjkdfdfhkajsdhfkasjdfhkajs skadjfhaksdjf kasdjhf aksjdhf jkasdhfkajsdhf  ajdhfkawejj asdjfahsd kfae h ',
    images: [],
    createdDate: '2021-01-01',
    updatedAt: '2021-01-01',
    createdById: 1,
    createdBy: {
      id: 1,
      name: 'User 1',
      image: 'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
    },
    likeCount: 0,
    isLiked: false,
  },
  {
    id: 2,
    description: 'Description 2',
    images: [
      'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
      'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
      'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
    ],
    createdDate: '2021-01-01',
    updatedAt: '2021-01-01',
    createdById: 1,
    createdBy: {
      id: 1,
      name: 'User 1',
      image: 'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
    },
    likeCount: 0,
    isLiked: false,
  },
];

const IMAGE_HEIGHT = screenHeight * 0.25;

const GroupHomeScreen = ({route}: {route: any}) => {
  const navigation: any = useNavigation();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  //   const {group}: {group: IGroup} = route.params;
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > IMAGE_HEIGHT - 30);
  };

  const renderStickyHeader = () => (
    <View style={styles.stickyHeader}>
      <Text style={styles.title}>{groupInfo.name}</Text>
    </View>
  );

  const renderHeader = () => (
    <View
      style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Image source={{uri: groupInfo.image}} style={styles.image} />
      <Text style={styles.title}>{groupInfo.name}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: scale(30),
        }}>
        <Text
          style={{
            fontFamily: getFontFamily('regular'),
            color: Colors.black,
            fontSize: moderateScale(16),
          }}>
          <Icon source="account-group" size={18} color="black" />
          {'  '}
          {groupInfo.numberOfMembers} thành viên
        </Text>
        {groupInfo.joinType === 'private' && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: getFontFamily('regular'),
                color: Colors.black,
                fontSize: moderateScale(16),
              }}>
              <Icon source="account-group" size={18} color="black" />
              {'  '}
              {groupInfo.numberOfRequests} yêu cầu
            </Text>
            {userInfo.id === groupInfo.createdById && (
              <TouchableOpacity
                style={{
                  marginLeft: scale(10),
                  padding: scale(5),
                  paddingHorizontal: scale(10),
                  backgroundColor: Colors.greenPrimary,
                  borderRadius: 10,
                }}
                onPress={() => {}}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: moderateScale(12),
                    fontFamily: getFontFamily('bold'),
                  }}>
                  Xem
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          width: '90%',
          marginTop: scale(10),
          backgroundColor: Colors.white,
          padding: scale(10),
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: groupInfo.image}}
          style={{width: 30, height: 30, borderRadius: 100}}
        />
        <Text
          onPress={() => {
            navigation.navigate(Route.GroupEditPost, {
              groupInfo,
            });
          }}
          style={{
            flex: 1,
            fontSize: moderateScale(16),
            fontFamily: getFontFamily('regular'),
            color: Colors.grayText,
            borderRadius: 20,
            marginHorizontal: scale(10),
            borderWidth: 1,
            borderColor: Colors.black,
            paddingVertical: scale(5),
            paddingHorizontal: scale(16),
          }}>
          Bạn muốn nhắn gì?
        </Text>

        <TouchableOpacity
          style={{alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {
            navigation.navigate(Route.GroupCreatePost, {
              groupInfo,
            });
          }}>
          <Icon source="image" size={20} color={Colors.greenPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {showStickyHeader && renderStickyHeader()}

      <TouchableOpacity
        style={styles.backButtonHeader}
        onPress={() => navigation.goBack()}>
        <Icon source="arrow-left" size={20} color="black" />
      </TouchableOpacity>
      <FlatList
        data={groupPosts}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={({item}) => (
          <View style={styles.postItem}>
            <GroupPostItem
              item={item}
              setCommentPostId={() => {}}
              setShowComment={() => {}}
            />
          </View>
        )}
      />
    </View>
  );
};

export default GroupHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  backButtonHeader: {
    padding: 10,
    position: 'absolute',
    zIndex: 101,
    left: 10,
    top: 10,
    backgroundColor: 'white',
    borderRadius: 100,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(50),
    backgroundColor: 'white',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    elevation: 4,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold'),
    color: Colors.black,
  },

  postItem: {
    paddingVertical: scale(4),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
