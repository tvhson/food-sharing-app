import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import {NavigationProp, RouteProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {getAllRedemptions, getMyHistoryRedeem} from '../api/LoyaltyApi';

import Colors from '../global/Color';
import HistoryRenderItem from '../components/ui/ExchangePageUI/HistoryRenderItem';
import {Icon} from 'react-native-paper';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {useLoading} from '../utils/LoadingContext';
import {useSelector} from 'react-redux';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const HistoryExchangeGiftScreen = ({navigation, route}: Props) => {
  const type = route?.params?.type;
  const {showLoading, hideLoading} = useLoading();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [data, setData] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const getHistoryExchange = async () => {
    if (userInfo.role === 'ADMIN') {
      const response: any = await getAllRedemptions(accessToken);
      if (response.status === 200) {
        setData(response.data);
      }
    } else {
      const response: any = await getMyHistoryRedeem(accessToken);
      if (response.status === 200) {
        setData(response.data);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      showLoading();
      await getHistoryExchange();
      hideLoading();
    };
    fetchData();
  }, [accessToken]);

  const onRefresh = async () => {
    showLoading();
    await getHistoryExchange();
    hideLoading();
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source={'arrow-left'} size={30} color={Colors.white} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.white,
              fontSize: 20,
              fontFamily: getFontFamily('semibold'),
            }}>
            Đổi quà
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.listContainer}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 24,
            fontFamily: getFontFamily('bold'),
            color: Colors.greenPrimary,
          }}>
          Lịch sử
        </Text>
        <FlatList
          data={data}
          style={{flex: 1}}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => <HistoryRenderItem item={item} />}
        />
      </View>
    </View>
  );
};

export default HistoryExchangeGiftScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.greenPrimary,
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  listContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 20,
    marginTop: -220,
    flex: 1,
    paddingTop: 20,
  },
});
