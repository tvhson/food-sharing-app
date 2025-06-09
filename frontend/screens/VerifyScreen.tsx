import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {IconButton, SegmentedButtons} from 'react-native-paper';
/* eslint-disable react-native/no-inline-styles */
import {Image, SearchBar} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {clearAccounts, setAccounts} from '../redux/AccountsReducer';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import ReportAccountItem from '../components/ui/ReportAccountItem';
import {RootState} from '../redux/Store';
import {getAllAccounts} from '../api/AccountsApi';

const VerifyScreen = ({navigation}: any) => {
  const AccountUserDatas = useSelector(
    (state: RootState) => state.account.user,
  );
  const AccountOrganizationDatas = useSelector(
    (state: RootState) => state.account.organization,
  );
  const accessToken = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const [accountUser, setAccountUser] = useState<any>(AccountUserDatas);
  const [accountOrganization, setAccountOrganization] = useState<any>(
    AccountOrganizationDatas,
  );
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [valueOfSegmentButton, setValueOfSegmentButton] = useState('User');

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
    const saveAccount = async () => {
      if (accessToken) {
        getAllAccounts(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            dispatch(setAccounts(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    dispatch(clearAccounts());
    saveAccount();
    setCurrentPage(0);
    setRefreshing(false);
  };
  const updateSearch = (data: any) => {
    setSearch(data);
  };
  useEffect(() => {
    const applyFilter = () => {
      if (search === '') {
        if (valueOfSegmentButton === 'User') {
          setAccountUser(AccountUserDatas);
        } else if (valueOfSegmentButton === 'Organization') {
          setAccountOrganization(AccountOrganizationDatas);
        }
      } else {
        if (valueOfSegmentButton === 'User') {
          setAccountUser(
            AccountUserDatas.filter((item: any) =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            ),
          );
        } else if (valueOfSegmentButton === 'Organization') {
          setAccountOrganization(
            AccountOrganizationDatas.filter((item: any) =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            ),
          );
        }
      }
    };
    applyFilter();
  }, [
    search,
    AccountOrganizationDatas,
    AccountUserDatas,
    valueOfSegmentButton,
  ]);

  useEffect(() => {
    const saveAccounts = async () => {
      if (AccountOrganizationDatas || AccountUserDatas) {
        setAccountOrganization(AccountOrganizationDatas);
        setAccountUser(AccountUserDatas);
      } else if (accessToken) {
        getAllAccounts(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            dispatch(setAccounts(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await saveAccounts();
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, accessToken, AccountOrganizationDatas, AccountUserDatas]);

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        flexDirection: 'column',
      }}>
      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: Colors.button,
          borderBottomWidth: 1,
          borderBlockColor: '#ccc',
          justifyContent: 'center',

          alignItems: 'center',
        }}>
        <View style={{position: 'absolute', top: -1, left: 10}}>
          <IconButton
            icon="chevron-left"
            size={40}
            iconColor="white"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Quản lý tài khoản
        </Text>
      </View>
      <SearchBar
        placeholder="Tìm tài khoản bằng tên"
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
      <SegmentedButtons
        style={{margin: 20, marginTop: 10}}
        value={valueOfSegmentButton}
        onValueChange={setValueOfSegmentButton}
        buttons={[
          {
            value: 'User',
            label: 'Người',
            checkedColor: 'white',
            style: {
              backgroundColor:
                valueOfSegmentButton === 'User' ? Colors.button : 'transparent',
            },
          },
          {
            value: 'Organization',
            label: 'Tổ chức',
            checkedColor: 'white',
            style: {
              backgroundColor:
                valueOfSegmentButton === 'Organization'
                  ? Colors.button
                  : 'transparent',
            },
          },
        ]}
      />
      <FlatList
        style={{marginHorizontal: 8}}
        data={
          valueOfSegmentButton === 'User' ? accountUser : accountOrganization
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => <ReportAccountItem item={item} />}
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
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 500,
            }}>
            <Image
              source={require('../assets/images/BgNoData.png')}
              style={{width: 300, height: 400}}
            />
          </View>
        }
      />
    </View>
  );
};

export default VerifyScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
