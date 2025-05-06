import {Button, Icon, Image, SearchBar} from '@rneui/themed';
import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {clearSharingPosts, pushSharingPost} from '../redux/SharingPostReducer';
import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import Comment from '../components/ui/Comment';
import HeaderHome from '../components/ui/HeaderHome';
import ImageDetailModal from '../components/ui/ImageDetailModal';
import {Menu} from 'react-native-paper';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import {RootState} from '../redux/Store';
import {Text} from 'react-native';
import {calculateDistance} from '../utils/helper';
import {createNotifications} from 'react-native-notificated';
import getDistance from 'geolib/es/getDistance';
import {getFontFamily} from '../utils/fonts';
import {getPosts} from '../api/PostApi';
import {scale} from '../utils/scale';

const {useNotifications} = createNotifications();

const HomeScreen = ({navigation}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);

  const recommendedPost = useSelector(
    (state: RootState) => state.sharingPost.HomePage,
  );
  const dispatch = useDispatch();
  const [recommendPost, setRecommendPost] = useState<any>(null);
  const {notify} = useNotifications();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPosts, setFilterPosts] = useState<any>(null);
  const [sortingMethod, setSortingMethod] = useState('');
  const [visible, setVisible] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showDetailImage, setShowDetailImage] = useState<boolean | number>(
    false,
  );
  const [detailPost, setDetailPost] = useState<any>(null);
  const [commentPostId, setCommentPostId] = useState(0);
  const [foodType, setFoodType] = useState();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const location = useSelector((state: RootState) => state.location);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);

    const getRecommendPost = async () => {
      if (accessToken) {
        const response: any = await getPosts(accessToken.toString());
        if (response.status === 200) {
          dispatch(clearSharingPosts());
          AsyncStorage.setItem('recommendPost', JSON.stringify(response.data));
          setRecommendPost(response.data);
          response.data.forEach((post: any) => dispatch(pushSharingPost(post)));
        } else {
          console.log(response);
          notify('error', {
            params: {
              description: 'Không thể tải dữ liệu mới',
              title: 'Lỗi',
            },
          });
        }
      }
      setIsLoading(false);
      setRefreshing(false);
    };

    await getRecommendPost();
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
          notify('error', {
            params: {
              description: 'Không thể tải dữ liệu mới',
              title: 'Lỗi',
            },
          });
        }
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await getRecommendPost();
      setIsLoading(false);
    };
    fetchData();
  }, [accessToken, notify, recommendedPost]);

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
      <View style={{flexDirection: 'row', marginVertical: scale(6)}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MapScreen', {
              location: location,
              accessToken: accessToken,
            })
          }
          style={{padding: scale(10)}}>
          <Text>Đồ ăn mặn</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{marginHorizontal: 8}}
        data={filterPosts ?? recommendPost} // Fallback if `filterPosts` is empty
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{height: 16}} />}
        renderItem={({item}: any) => (
          <PostRenderItem2
            item={item}
            navigation={navigation}
            location={location}
            distance={calculateDistance(item, location)}
            setShowComment={setShowComment}
            setCommentPostId={setCommentPostId}
            setDetailPost={(item: any) => {
              setDetailPost(item);
              setShowDetailImage(true);
            }}
          />
        )}
      />

      <Comment
        isVisible={showComment}
        setVisible={setShowComment}
        commentPostId={commentPostId}
      />
      <ImageDetailModal
        isVisible={showDetailImage}
        setVisible={setShowDetailImage}
        item={detailPost}
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
