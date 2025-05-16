import {
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  calculateDistance,
  calculateExpiredDate,
  timeAgo,
} from '../../../utils/helper';

import {FlatList} from 'react-native';
import {RootState} from '../../../redux/Store';
import {getFontFamily} from '../../../utils/fonts';
import {getOrganizationPostByUserId} from '../../../api/OrganizationPostApi';
import {getPostOfOther} from '../../../api/PostApi';
import screenWidth from '../../../global/Constant';
import {useLoading} from '../../../utils/LoadingContext';
import {useSelector} from 'react-redux';

interface ListPostProps {
  type: 'POST' | 'OPOST';
  otherId?: number;
  navigation: any;
}

const ListPost = (props: ListPostProps) => {
  const {type, otherId, navigation} = props;
  const {showLoading, hideLoading} = useLoading();

  const [refreshing, setRefreshing] = useState(false);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const location = useSelector((state: RootState) => state.location);

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const getPostCreate = async () => {
      showLoading();
      const response: any = await getPostOfOther(otherId, accessToken);
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        console.log('error');
      }
      hideLoading();
    };
    const getOrganizationsPost = async () => {
      showLoading();
      const response: any = await getOrganizationPostByUserId(
        otherId,
        accessToken,
      );
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        console.log('error');
      }
      hideLoading();
    };
    const fetchData = async () => {
      if (type === 'POST') {
        await getPostCreate();
      } else {
        await getOrganizationsPost();
      }
    };
    fetchData();
  }, [accessToken, otherId]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (type === 'POST') {
      showLoading();
      const response: any = await getPostOfOther(otherId, accessToken);
      if (response.status === 200) {
        setPosts(response.data);
      }
      hideLoading();
    } else {
      showLoading();
      const response: any = await getOrganizationPostByUserId(
        otherId,
        accessToken,
      );
      if (response.status === 200) {
        setPosts(response.data);
      }
      hideLoading();
    }
    setRefreshing(false);
  };

  const handleNavigate = (item: any) => () => {
    if (type === 'POST') {
      navigation.navigate('PostDetail2', {
        item,
        location,
        createdDate: timeAgo(item.createdDate),
        expiredString: calculateExpiredDate(new Date(item.expiredDate)),
        distance: calculateDistance(item, location),
      });
    } else {
      navigation.navigate('OrganizationPostDetail2', {
        item: {
          organizationposts: item,
        },
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        numColumns={3} // This makes 3 items per row
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              height: 300, // Ensure some height so user can pull
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: getFontFamily('semibold'),
                marginTop: 20,
              }}>
              Không có bài viết nào
            </Text>
          </View>
        }
        contentContainerStyle={{flexGrow: 1}}
        renderItem={({item}) => (
          <View
            style={{
              padding: 2,
              width: screenWidth / 3,
              height: screenWidth / 3,
            }}>
            <TouchableOpacity onPress={handleNavigate(item)}>
              <Image
                source={{uri: item?.images?.[0] || item?.imageUrl}}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default React.memo(ListPost);
