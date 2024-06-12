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
import Header from '../components/ui/Header';
import Colors from '../global/Color';
import {Button, Image, SearchBar} from '@rneui/themed';
import PostRenderItem from '../components/ui/PostRenderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNotifications} from 'react-native-notificated';
import {getPosts} from '../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {clearSharingPosts, pushSharingPost} from '../redux/SharingPostReducer';
import {ActivityIndicator} from 'react-native-paper';
import getDistance from 'geolib/es/getDistance';

const {useNotifications} = createNotifications();

const HomeScreen = ({navigation, route}: any) => {
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

  const location = useSelector((state: RootState) => state.location);

  const updateSearch = (search: any) => {
    setSearch(search);
  };

  const renderLoader = () => {
    return (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  };

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const onRefresh = () => {
    const getRecommendPost = async () => {
      if (accessToken) {
        getPosts(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            AsyncStorage.setItem(
              'recommendPost',
              JSON.stringify(response.data),
            );
            setRecommendPost(response.data);
            for (const post of response.data) {
              dispatch(pushSharingPost(post));
            }
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    setIsLoading(true);
    dispatch(clearSharingPosts());
    getRecommendPost();
    setCurrentPage(0);
    setIsLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const getRecommendPost = async () => {
      if (recommendedPost) {
        setRecommendPost(recommendedPost);
      } else if (accessToken) {
        getPosts(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            AsyncStorage.setItem(
              'recommendPost',
              JSON.stringify(response.data),
            );
            setRecommendPost(response.data);
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

    applyFilter();
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
      <Header
        imageUrl={userInfo.imageUrl}
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

      {isLoading ? (
        renderLoader()
      ) : (
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
            !isLoading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 500,
                }}>
                <Image
                  source={require('../assets/images/BgNoPost..png')}
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
            ) : null
          }
        />
      )}

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

export default HomeScreen;

const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
