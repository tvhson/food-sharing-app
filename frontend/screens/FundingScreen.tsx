/* eslint-disable react-hooks/exhaustive-deps */
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IGetGroupResponse, getGroup} from '../api/GroupApi';
import {Icon, SearchBar} from '@rneui/themed';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  clearFundingPosts,
  pushFundingPost,
} from '../redux/OrganizationPostReducer';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import HeaderHome from '../components/ui/HeaderHome';
import {Menu} from 'react-native-paper';
import OrganizationPost2 from '../components/ui/OrganizationPost2';
import {RootState} from '../redux/Store';
import {Route} from '../constants/route';
import getDistance from 'geolib/es/getDistance';
import {getFontFamily} from '../utils/fonts';
import {getOrganizationPost} from '../api/OrganizationPostApi';
import {moderateScale} from 'react-native-size-matters';
import {scale} from '../utils/scale';
import screenWidth from '../global/Constant';
import {setGroup} from '../redux/GroupReducer';
import {useFocusEffect} from '@react-navigation/native';
import {useLoading} from '../utils/LoadingContext';
import {useNotifications} from 'react-native-notificated';

export const FundingScreen = ({navigation}: any) => {
  const {notify} = useNotifications();
  const dispatch = useDispatch();
  const {showLoading, hideLoading} = useLoading();
  const groups = useSelector((state: RootState) => state.group.groups);
  const token = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const location = useSelector((state: RootState) => state.location);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterPosts, setFilterPosts] = useState<IGetGroupResponse[]>([]);
  const [visible, setVisible] = useState(false);
  const [sortingMethod, setSortingMethod] = useState('');

  const getFundingGroup = async () => {
    showLoading();
    await getGroup(token.toString())
      .then(response => {
        dispatch(setGroup(response));
      })
      .catch(error => {
        console.log(error);
        notify('error', {
          params: {
            description: 'Không thể tải dữ liệu mới',
            title: 'Lỗi',
          },
        });
      })
      .finally(() => {
        hideLoading();
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getFundingGroup();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getFundingGroup();
    }, []),
  );

  useEffect(() => {
    const applyFilter = () => {
      try {
        let filtered = groups;
        if (search) {
          console.log(filtered);
          filtered = filtered.filter(
            post =>
              post.name?.toLowerCase().includes(search.toLowerCase()) ||
              post.description?.toLowerCase().includes(search.toLowerCase()),
          );
        }
        if (sortingMethod === 'distance') {
          filtered = filtered.sort((a, b) => {
            const distanceA = getDistance(
              {
                latitude: a.latitude,
                longitude: a.longitude,
              },
              location,
            );
            const distanceB = getDistance(
              {
                latitude: b.latitude,
                longitude: b.longitude,
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
    if (groups) {
      applyFilter();
    }
  }, [search, sortingMethod, groups, location]);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <HeaderHome navigation={navigation} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <SearchBar
            placeholder="Tìm nhóm"
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
        data={filterPosts ?? groups}
        renderItem={({item}) => <OrganizationPost2 item={item} />}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={<View style={{height: 16}} />}
        ListHeaderComponent={
          userInfo.role === 'ORGANIZATION' ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Route.CreateGroup, {
                  location,
                  token,
                })
              }
              style={{
                backgroundColor: Colors.button,
                width: screenWidth * 0.7,
                alignSelf: 'center',
                borderRadius: scale(10),
                padding: 10,
                margin: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="add" color="white" size={24} />
              <Text
                style={{
                  color: 'white',
                  fontSize: moderateScale(16),
                  fontFamily: getFontFamily('bold'),
                  textAlign: 'center',
                }}>
                Tạo nhóm
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
