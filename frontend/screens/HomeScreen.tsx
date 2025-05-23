import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {Icon, SearchBar} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  SharingPost,
  clearSharingPosts,
  setSharingPost,
} from '../redux/SharingPostReducer';
import {useDispatch, useSelector} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ChooseTagBottomSheet from '../components/ui/ChooseTagBottomSheet';
import Colors from '../global/Color';
import Comment from '../components/ui/Comment';
import {FoodType} from './CreatePostScreen';
import HeaderHome from '../components/ui/HeaderHome';
import ImageDetailModal from '../components/ui/ImageDetailModal';
import {Menu} from 'react-native-paper';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import {RootState} from '../redux/Store';
import {Text} from 'react-native';
import {createNotifications} from 'react-native-notificated';
import getDistance from 'geolib/es/getDistance';
import {getFontFamily} from '../utils/fonts';
import {getFoodTypeKey} from '../utils/helper';
import {getPosts} from '../api/PostApi';
import {scale} from '../utils/scale';
import {useLoading} from '../utils/LoadingContext';

const {useNotifications} = createNotifications();

const HomeScreen = ({navigation}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);

  const recommendedPost = useSelector(
    (state: RootState) => state.sharingPost.HomePage,
  );
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useDispatch();
  const [recommendPost, setRecommendPost] =
    useState<SharingPost[]>(recommendedPost);
  const {notify} = useNotifications();
  const [search, setSearch] = useState('');
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
  const [foodType, setFoodType] = useState<FoodType | null>(null);
  const [isTagVisible, setIsTagVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const location = useSelector((state: RootState) => state.location);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const onRefresh = async () => {
    setRefreshing(true);

    const getRecommendPost = async () => {
      if (accessToken) {
        const type = foodType === null ? 'ALL' : getFoodTypeKey(foodType);
        if (!type) return;
        showLoading();
        const response: any = await getPosts(accessToken.toString(), {
          type,
          latitude: location.latitude,
          longitude: location.longitude,
          distance: 1000,
        });
        if (response.status === 200) {
          dispatch(clearSharingPosts());
          AsyncStorage.setItem('recommendPost', JSON.stringify(response.data));
          setRecommendPost(response.data);
          dispatch(setSharingPost(response.data));
          hideLoading();
        } else {
          hideLoading();
          notify('error', {
            params: {
              description: 'Không thể tải dữ liệu mới',
              title: 'Lỗi',
            },
          });
        }
      }
      setRefreshing(false);
    };

    await getRecommendPost();
  };

  useEffect(() => {
    const getRecommendPost = async () => {
      if (accessToken) {
        const type = foodType === null ? 'ALL' : getFoodTypeKey(foodType);
        if (!type) return;
        const response: any = await getPosts(accessToken.toString(), {
          type,
          latitude: location.latitude,
          longitude: location.longitude,
          distance: 1000,
        });
        if (response.status === 200) {
          AsyncStorage.setItem('recommendPost', JSON.stringify(response.data));
          setRecommendPost(response.data);
          dispatch(setSharingPost(response.data));
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
      await getRecommendPost();
    };
    fetchData();
  }, [foodType]);

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
  }, [search, sortingMethod, recommendedPost]);

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
      <View
        style={{
          flexDirection: 'row',
          marginVertical: scale(6),
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => setIsTagVisible(true)}
          style={{
            padding: scale(4),
            backgroundColor: Colors.white,
            borderRadius: scale(8),
            marginHorizontal: scale(18),
            paddingHorizontal: scale(50),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: foodType === null ? '#706d6d' : 'black',
              fontFamily: getFontFamily('regular'),
            }}>
            {foodType === null ? 'Tất cả' : foodType}
          </Text>
          <View style={{position: 'absolute', right: scale(6)}}>
            <Icon name="chevron-down" type="ionicon" size={20} color="#333" />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{marginHorizontal: 8}}
        data={filterPosts ?? recommendPost}
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
      <ChooseTagBottomSheet
        isVisible={isTagVisible}
        setVisible={setIsTagVisible}
        setType={setFoodType}
        isHome
      />
    </View>
  );
};

export default HomeScreen;
