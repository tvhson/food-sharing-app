/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useEffect} from 'react';
import {Button, Icon} from 'react-native-paper';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import RewardItem from '../../components/ui/ExchangePageUI/RewardItem';
import {rewardItems} from '../../components/data/PostData';
import {getRewards} from '../../api/LoyaltyApi';
import {useSelector} from 'react-redux';
import {useLoading} from '../../utils/LoadingContext';
import {RootState} from '../../redux/Store';

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
          renderItem={({item}) => (
            <RewardItem
              imageUrl={item.imageUrl}
              rewardName={item.rewardName}
              id={item.id}
              pointsRequired={item.pointsRequired}
            />
          )}
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
