import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Image, SearchBar} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {clearMyPosts, pushMyPost} from '../redux/SharingPostReducer';
import {getPostOfUser, getPosts} from '../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';

/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import Header from '../components/ui/HeaderHome';
import PostRenderItem from '../components/ui/PostRenderItem';
import {RootState} from '../redux/Store';
import {createNotifications} from 'react-native-notificated';
import getDistance from 'geolib/es/getDistance';

const {useNotifications} = createNotifications();

const MyPostScreen = ({navigation, route}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const myPostReducer = useSelector(
    (state: RootState) => state.sharingPost.MyPosts,
  );
  const dispatch = useDispatch();
  const [myPost, setMyPost] = useState<any>(null);

  const {notify} = useNotifications();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPosts, setFilterPosts] = useState<any>(null);
  const [sortingMethod, setSortingMethod] = useState('');

  const location = useSelector((state: RootState) => state.location);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };
  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const onRefresh = () => {
    const getRecommendPost = async () => {
      if (accessToken) {
        getPostOfUser(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            for (const post of response.data) {
              dispatch(pushMyPost(post));
            }
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    dispatch(clearMyPosts());
    getRecommendPost();
    setCurrentPage(0);
    setRefreshing(false);
  };

  useEffect(() => {
    const getRecommendPost = async () => {
      if (myPostReducer) {
        setMyPost(myPostReducer);
      } else if (accessToken) {
        getPosts(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            AsyncStorage.setItem(
              'recommendPost',
              JSON.stringify(response.data),
            );
            setMyPost(response.data);
          } else {
            console.log(response);
          }
        });
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await getRecommendPost();
      setIsLoading(false);
    };
    fetchData();
  }, [accessToken, myPostReducer]);
  useEffect(() => {
    const applyFilter = () => {
      let filtered = myPost;
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
    applyFilter();
  }, [location, myPost, search, sortingMethod]);

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
      <Header
        isMyPost={true}
        navigation={navigation}
        setSortingMethod={setSortingMethod}
      />
      <SearchBar
        placeholder="Search food by name"
        containerStyle={{
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }}
        inputContainerStyle={{
          backgroundColor: 'white',
        }}
        round
        onChangeText={updateSearch}
        value={search}
      />

      <FlatList
        style={{marginHorizontal: 8}}
        data={filterPosts}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (!isLoading) {
            loadMoreItem();
          }
        }}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => renderLoader()}
        renderItem={({item}: any) => (
          <PostRenderItem
            item={item}
            navigation={navigation}
            location={location}
            distance={calculateDistance(item)}
          />
        )}
        ListEmptyComponent={
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
              title="Create Post"
              containerStyle={{borderRadius: 8}}
              buttonStyle={{backgroundColor: Colors.button}}
              onPress={() =>
                navigation.navigate('CreatePost', {location, accessToken})
              }
            />
          </View>
        }
      />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreatePost', {location, accessToken})
        }
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: Colors.button,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, color: 'white'}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyPostScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
