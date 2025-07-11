import {Icon, SearchBar} from '@rneui/themed';
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {FlatList, RefreshControl, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  SharingPost,
  clearSharingPosts,
  setSharingPost,
} from '../redux/SharingPostReducer';

import getDistance from 'geolib/es/getDistance';
import {Text} from 'react-native';
import {createNotifications} from 'react-native-notificated';
import {Menu} from 'react-native-paper';
import {getPosts, useSearchPosts} from '../api/PostApi';
import ChooseTagBottomSheet from '../components/ui/ChooseTagBottomSheet';
import Comment from '../components/ui/Comment';
import HeaderHome from '../components/ui/HeaderHome';
import ImageDetailModal from '../components/ui/ImageDetailModal';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {getFoodTypeKey} from '../utils/helper';
import {useLoading} from '../utils/LoadingContext';
import {scale} from '../utils/scale';
import {FoodType} from './CreatePostScreen';

const {useNotifications} = createNotifications();

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

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
  const [showComment, setShowComment] = useState(false);
  const [showDetailImage, setShowDetailImage] = useState<boolean | number>(
    false,
  );
  const [detailPost, setDetailPost] = useState<any>(null);
  const [commentPostId, setCommentPostId] = useState(0);
  const [foodType, setFoodType] = useState<FoodType | null>(null);
  const [isTagVisible, setIsTagVisible] = useState(false);

  const location = useSelector((state: RootState) => state.location);

  // Debounce search input with 500ms delay
  const debouncedSearch = useDebounce(search, 500);

  // Server-side search using React Query with debounced value
  const {data: searchResults, isLoading: isSearching} = useSearchPosts(
    accessToken,
    {keyword: debouncedSearch},
    !!debouncedSearch.trim(), // Only search when debounced keyword exists
  );

  // Safely access search results data with memoization
  const searchData = useMemo(() => {
    return searchResults &&
      typeof searchResults === 'object' &&
      'data' in searchResults
      ? (searchResults as any).data
      : [];
  }, [searchResults]);

  const updateSearch = useCallback((search: any) => {
    setSearch(search);
  }, []);

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
          setRecommendPost(response.data);
          dispatch(setSharingPost(response.data));
        } else {
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

  // Memoize filtered data to prevent infinite re-renders
  const filteredData = useMemo(() => {
    // Use search results if searching, otherwise use recommended posts
    let filtered = debouncedSearch.trim() ? searchData : recommendPost;

    // Apply sorting if not searching
    if (
      !debouncedSearch.trim() &&
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
    return filtered;
  }, [debouncedSearch, searchData, recommendPost, location]);

  // Update filterPosts state when filteredData changes
  useEffect(() => {
    setFilterPosts(filteredData);
  }, [filteredData]);

  // Determine which data to display
  const displayData = filterPosts ?? recommendPost;
  const isLoading = isSearching && !!debouncedSearch.trim();

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
            showLoading={isLoading}
          />
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
              marginLeft: scale(10),
              paddingRight: scale(26),
              paddingLeft: scale(6),
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
            <View style={{position: 'absolute', right: scale(2)}}>
              <Icon name="chevron-down" type="ionicon" size={20} color="#333" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{marginHorizontal: 8}}
        data={displayData}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
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
        type="POST"
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
