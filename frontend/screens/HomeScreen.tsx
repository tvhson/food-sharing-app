/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Colors from '../global/Color';
import {Button, Icon, Image, SearchBar} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNotifications} from 'react-native-notificated';
import {getPosts} from '../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {clearSharingPosts, pushSharingPost} from '../redux/SharingPostReducer';
import {ActivityIndicator, Menu} from 'react-native-paper';
import getDistance from 'geolib/es/getDistance';
import {getFontFamily} from '../utils/fonts';
import HeaderHome from '../components/ui/HeaderHome';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import Comment from '../components/ui/Comment';

const {useNotifications} = createNotifications();

const HomeScreen = ({navigation, route, setIsHome}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const recommendedPost = useSelector(
    (state: RootState) => state.sharingPost.HomePage,
  );
  const dispatch = useDispatch();
  const [recommendPost, setRecommendPost] = useState<any>(null);
  const {notify} = useNotifications();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPosts, setFilterPosts] = useState<any>(null);
  const [sortingMethod, setSortingMethod] = useState('');
  const [visible, setVisible] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentPostId, setCommentPostId] = useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const location = useSelector((state: RootState) => state.location);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);
    dispatch(clearSharingPosts());

    const getRecommendPost = async () => {
      if (accessToken) {
        const response: any = await getPosts(accessToken.toString());
        if (response.status === 200) {
          AsyncStorage.setItem('recommendPost', JSON.stringify(response.data));
          setRecommendPost(response.data);
          response.data.forEach((post: any) => dispatch(pushSharingPost(post)));
        } else {
          console.log(response);
        }
      }
    };

    await getRecommendPost();
    setCurrentPage(0);
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const getRecommendPost = async () => {
      if (recommendedPost) {
        setRecommendPost(recommendedPost);
      } else if (accessToken) {
        const response: any = await getPosts(accessToken.toString());
        if (response.status === 200) {
          AsyncStorage.setItem('recommendPost', JSON.stringify(response.data));
          setRecommendPost(response.data);
        } else {
          console.log(response);
        }
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await getRecommendPost();
      setIsLoading(false);
    };
    fetchData();
  }, [accessToken, recommendedPost]);

  useEffect(() => {
    const applyFilter = () => {
      let filtered = recommendPost;

      if (search !== '') {
        filtered = filtered.filter((item: any) =>
          item.title.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (
        sortingMethod === 'distance' &&
        location &&
        location.latitude &&
        location.longitude
      ) {
        filtered = [...filtered].sort((a: any, b: any) => {
          const distanceA = getDistance(
            {latitude: a.latitude, longitude: a.longitude},
            {latitude: location.latitude, longitude: location.longitude},
          );
          const distanceB = getDistance(
            {latitude: b.latitude, longitude: b.longitude},
            {latitude: location.latitude, longitude: location.longitude},
          );
          return distanceA - distanceB;
        });
      }

      setFilterPosts(filtered);
    };
    if (recommendPost) {
      applyFilter();
    }
  }, [location, recommendPost, search, sortingMethod]);

  const calculateDistance = (item: any) => {
    if (location && location.latitude && location.longitude) {
      return (
        getDistance(
          {latitude: item.latitude, longitude: item.longitude},
          {latitude: location.latitude, longitude: location.longitude},
        ) / 1000
      );
    }
    return 0;
  };

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        flexDirection: 'column',
      }}>
      <HeaderHome navigation={navigation} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <SearchBar
            placeholder="Tìm thực phẩm bằng tên"
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

      <FlatList
        style={{marginHorizontal: 8}}
        data={filterPosts ?? recommendPost} // Fallback if `filterPosts` is empty
        keyExtractor={item => item.id}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{height: 16}} />}
        renderItem={({item}: any) => (
          <PostRenderItem2
            item={item}
            navigation={navigation}
            location={location}
            distance={calculateDistance(item)}
            setShowComment={setShowComment}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 500,
              }}>
              <Image
                source={require('../assets/images/BgNoPost.png')}
                style={{width: 300, height: 400}}
              />
              <Button
                title="Tạo bài viết"
                containerStyle={{borderRadius: 8}}
                buttonStyle={{backgroundColor: Colors.button}}
                onPress={() =>
                  navigation.navigate('CreatePost', {location, accessToken})
                }
              />
            </View>
          ) : null
        }
      />

      <Comment
        isVisible={showComment}
        setVisible={setShowComment}
        commentPostId={commentPostId}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreatePost', {location, accessToken})
        }
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

export default HomeScreen;
