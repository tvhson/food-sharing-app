/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getOrganizationPost} from '../api/OrganizationPostApi';
import {
  addToTheEndOfFundingPost,
  clearFundingPosts,
  pushFundingPost,
  setHomePageFundingPost,
} from '../redux/OrganizationPostReducer';
import {OrganizationPost} from '../components/ui/OrganizationPost';
import Colors from '../global/Color';
import {Button, Menu} from 'react-native-paper';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import Comment from '../components/ui/Comment';
import OrganizationPost2 from '../components/ui/OrganizationPost2';
import {useFocusEffect} from '@react-navigation/native';
import {Icon, SearchBar} from '@rneui/themed';
import HeaderHome from '../components/ui/HeaderHome';
import {getFontFamily} from '../utils/fonts';

const item = {
  accounts: {
    id: 3,
    name: 'Khoi2',
    imageUrl: 'https://happyfood.s3.amazonaws.com/1730110976168_image.jpeg',
    locationName: null,
    latitude: null,
    longitude: null,
  },
  organizationposts: {
    id: 1,
    title: 'aaaab',
    description: 'bbbb',
    peopleAttended: 0,
    imageUrl:
      'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
    createdDate: '2024-11-01T09:04:43.951+00:00',
    linkWebsites: 'https://yopmail.com/en/',
    userId: 3,
    locationName: 'aa',
    latitude: 'bb',
    longitude: 'cc',
    distance: 0.0,
    attended: false,
  },
};

export const FundingScreen = ({navigation}: any) => {
  const FundingPostData = useSelector(
    (state: RootState) => state.fundingPost.HomePage,
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const token = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const [commentPostId, setCommentPostId] = useState('');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [sortingMethod, setSortingMethod] = useState('');

  const updateSearch = (search: any) => {
    setSearch(search);
  };
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <HeaderHome navigation={navigation} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <SearchBar
            placeholder="Tìm chiến dịch, sự kiện chia sẻ bằng tên"
            containerStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            inputContainerStyle={{
              backgroundColor: 'white',
            }}
            inputStyle={{
              fontSize: 16,
              fontFamily: getFontFamily('regular'),
            }}
            round
            onChangeText={updateSearch}
            value={search}
          />
        </View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{backgroundColor: 'white'}}
          anchor={
            <TouchableOpacity style={{padding: 10}} onPress={openMenu}>
              <Icon name="filter" type="ionicon" size={24} color={'black'} />
            </TouchableOpacity>
          }>
          <Menu.Item
            onPress={() => {
              setSortingMethod('date');
              setVisible(false);
            }}
            title="Xếp theo thời gian"
            leadingIcon={'sort-calendar-ascending'}
          />
          <Menu.Item
            onPress={() => {
              setSortingMethod('distance');
              setVisible(false);
            }}
            title="Xếp theo khoảng cách"
            leadingIcon={'map-marker-distance'}
          />
        </Menu>
      </View>
      <ScrollView>
        <OrganizationPost2 navigation={navigation} item={item} />
        <View style={{height: 30}} />
      </ScrollView>

      <Comment
        isVisible={showComment}
        setVisible={setShowComment}
        commentPostId={commentPostId}
      />
      <TouchableOpacity
        // onPress={() =>
        //   navigation.navigate('CreatePost', {location, accessToken})
        // }
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: Colors.button,
          borderRadius: 100,
          padding: 16,
        }}>
        <Icon name="add" color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
