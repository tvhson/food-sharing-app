import {Button, Icon} from 'react-native-paper';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';

import Colors from '../../global/Color';
import RewardItem from '../../components/ui/ExchangePageUI/RewardItem';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {getRewards} from '../../api/LoyaltyApi';
import {useLoading} from '../../utils/LoadingContext';
import {useSelector} from 'react-redux';

const ManageReward = ({navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const getRewardData = async () => {
    showLoading();
    const response: any = await getRewards(accessToken);
    if (response.status === 200) {
      setData(response.data);
    }
    hideLoading();
  };

  useEffect(() => {
    getRewardData();
  }, [accessToken]);

  const onRefresh = () => {
    getRewardData();
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
            Quản lý quà tặng
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
          Danh sách quà
        </Text>
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({item}) => {
            console.log(item);
            return (
              <RewardItem
                imageUrl={item.imageUrl}
                rewardName={item.rewardName}
                id={item.id}
                pointsRequired={item.pointsRequired}
                stockQuantity={item.stockQuantity}
                onRefresh={onRefresh}
              />
            );
          }}
          numColumns={2}
          style={{flex: 1, alignSelf: 'center'}}
        />
      </View>
    </View>
  );
};

export default ManageReward;

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
  button1: {
    borderRadius: 8,
    width: 150,
    height: 50,
    justifyContent: 'center',
  },
});
