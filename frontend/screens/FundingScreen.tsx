/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getOrganizationPost} from '../api/OrganizationPostApi';
import {
  clearFundingPosts,
  pushFundingPost,
} from '../redux/OrganizationPostReducer';
import Colors from '../global/Color';
import {Menu} from 'react-native-paper';
import OrganizationPost2 from '../components/ui/OrganizationPost2';
import {Icon, SearchBar} from '@rneui/themed';
import HeaderHome from '../components/ui/HeaderHome';
import {getFontFamily} from '../utils/fonts';
import {useNotifications} from 'react-native-notificated';
import getDistance from 'geolib/es/getDistance';

export const FundingScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const token = useSelector((state: RootState) => state.token.key);
  const location = useSelector((state: RootState) => state.location);
  const [fundingPost, setFundingPost] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPosts, setFilterPosts] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [sortingMethod, setSortingMethod] = useState('');

  const loadMoreItem = () => {
    setCurrentPage(currentPage + 1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);

    const getFundingPost = async () => {
      if (token) {
        const response: any = await getOrganizationPost(token.toString());
        if (response.status === 200) {
          dispatch(clearFundingPosts());
          setFundingPost(response.data);
          response.data.forEach((post: any) => dispatch(pushFundingPost(post)));
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
      setCurrentPage(0);
      setIsLoading(false);
      setRefreshing(false);
    };

    getFundingPost();
  };

  useEffect(() => {
    const getFundingPost = async () => {
      if (token) {
        const response: any = await getOrganizationPost(token.toString());
        if (response.status === 200) {
          dispatch(clearFundingPosts());
          setFundingPost(response.data);
          response.data.forEach((post: any) => dispatch(pushFundingPost(post)));
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
      setCurrentPage(0);
      setIsLoading(false);
      setRefreshing(false);
    };
    const fetchData = async () => {
      setIsLoading(true);
      getFundingPost();
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, notify, token]);

  useEffect(() => {
    const applyFilter = () => {
      try {
        let filtered = fundingPost;
        if (search) {
          console.log(filtered);
          filtered = filtered.filter((post: any) =>
            post?.organizationposts?.title
              ?.toLowerCase()
              .includes(search.toLowerCase()),
          );
        }
        if (sortingMethod === 'distance') {
          filtered = filtered.sort((a: any, b: any) => {
            const distanceA = getDistance(
              {
                latitude: a.organizationposts.latitude,
                longitude: a.organizationposts.longitude,
              },
              location,
            );
            const distanceB = getDistance(
              {
                latitude: b.organizationposts.latitude,
                longitude: b.organizationposts.longitude,
              },
              location,
            );
            return distanceA - distanceB;
          });
        }

        setFilterPosts(filtered);
      } catch (error) {
        console.error('Error filtering posts: ', error);
      }
    };
    if (fundingPost) {
      applyFilter();
    }
  }, [search, sortingMethod, fundingPost, location]);

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
            onChangeText={setSearch}
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
        data={filterPosts ?? fundingPost}
        renderItem={({item}) => (
          <OrganizationPost2 navigation={navigation} item={item} />
        )}
        keyExtractor={item => item.organizationposts.id.toString()}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{height: 16}} />}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreateFundingPost', {location, token})
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
