/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import screenWidth from '../../../global/Constant';
import {useLoading} from '../../../utils/LoadingContext';
import {getPostOfOther} from '../../../api/PostApi';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/Store';
import {getOrganizationPostByUserId} from '../../../api/OrganizationPostApi';
import {
  calculateDistance,
  calculateExpiredDate,
  timeAgo,
} from '../../../utils/helper';

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
      const response: any = await getPostOfOther(otherId, accessToken);
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        console.log('error');
      }
    };
    const getOrganizationsPost = async () => {
      const response: any = await getOrganizationPostByUserId(
        otherId,
        accessToken,
      );
      if (response.status === 200) {
        setPosts(response.data);
      } else {
        console.log('error');
      }
    };
    const fetchData = async () => {
      showLoading();
      if (type === 'POST') {
        await getPostCreate();
      } else {
        await getOrganizationsPost();
      }
      hideLoading();
    };
    fetchData();
  }, [accessToken, otherId]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (type === 'POST') {
      const response: any = await getPostOfOther(otherId, accessToken);
      if (response.status === 200) {
        setPosts(response.data);
      }
    } else {
      const response: any = await getOrganizationPostByUserId(
        otherId,
        accessToken,
      );
      if (response.status === 200) {
        setPosts(response.data);
      }
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
    <View>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        numColumns={3} // This makes 3 items per row
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
