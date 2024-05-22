/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Header from '../components/ui/Header';
import Colors from '../global/Color';
import {Button, Image, SearchBar} from '@rneui/themed';
import PostRenderItem from '../components/ui/PostRenderItem';
import GetLocation, {
  Location,
  LocationErrorCode,
  isLocationError,
} from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNotifications} from 'react-native-notificated';
import {getPostOfUser, getPosts} from '../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {
  clearMyPosts,
  clearSharingPosts,
  pushMyPost,
  pushSharingPost,
} from '../redux/SharingPostReducer';

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
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationErrorCode | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPosts, setFilterPosts] = useState<any>(null);

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
    dispatch(clearSharingPosts());
    dispatch(clearMyPosts());
    getRecommendPost();
    setCurrentPage(0);
    setRefreshing(false);
  };

  useEffect(() => {
    const getRecommendPost = async () => {
      if (!recommendedPost) {
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
    const getLocation = async () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        rationale: {
          title: 'Location permission',
          message: 'The app needs the permission to request your location.',
          buttonPositive: 'Ok',
        },
      })
        .then(newLocation => {
          setLocation(newLocation);
        })
        .catch(ex => {
          if (isLocationError(ex)) {
            const {code, message} = ex;
            setError(code);
          }
          setLocation(null);
        });
    };

    const fetchData = async () => {
      setIsLoading(true);
      await getLocation();
      await getRecommendPost();
      setIsLoading(false);
    };
    fetchData();
  }, [accessToken, recommendedPost]);
  useEffect(() => {
    const applyFilter = () => {
      if (search === '') {
        setFilterPosts(recommendPost);
      } else {
        const filtered = recommendPost.filter((item: any) =>
          item.title.toLowerCase().includes(search.toLowerCase()),
        );
        setFilterPosts(filtered);
      }
    };
    applyFilter();
  }, [recommendPost, search]);

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        flexDirection: 'column',
      }}>
      <Header imageUrl={userInfo.imageUrl} navigation={navigation} />
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

export default HomeScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
