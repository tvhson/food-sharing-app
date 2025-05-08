/* eslint-disable react-hooks/exhaustive-deps */

import {Button, Icon} from 'react-native-paper';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {getMyPoint, getRewards} from '../api/LoyaltyApi';

import Colors from '../global/Color';
/* eslint-disable react-native/no-inline-styles */
import {Image} from '@rneui/themed';
import RewardItem from '../components/ui/ExchangePageUI/RewardItem';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {useLoading} from '../utils/LoadingContext';
import {useSelector} from 'react-redux';

const ExchangeGiftScreen = ({navigation}: any) => {
  const {showLoading, hideLoading} = useLoading();
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [myPoint, setMyPoint] = React.useState(0);
  const accessToken = useSelector((state: RootState) => state.token.key);

  const getRewardData = async () => {
    const response: any = await getRewards(accessToken);
    if (response.status === 200) {
      setData(response.data);
    }
  };

  const getPoint = async () => {
    const response: any = await getMyPoint(accessToken);
    if (response.status === 200) {
      setMyPoint(response.data.pointsBalance);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      showLoading();
      await getRewardData();
      await getPoint();
      hideLoading();
    };
    fetchData();
  }, [accessToken]);

  const onRefresh = async () => {
    showLoading();
    await getRewardData();
    await getPoint();
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
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}>
              <View>
                <Image
                  source={require('../assets/images/star-white.png')}
                  style={{width: 60, height: 60}}
                />
              </View>

              <Text
                style={{
                  color: Colors.white,
                  fontSize: 55,
                  fontFamily: getFontFamily('bold'),
                }}>
                {myPoint}
              </Text>
            </View>
            <Text
              style={{
                color: Colors.white,
                fontSize: 36,
                fontFamily: getFontFamily('semibold'),
              }}>
              Star Point
            </Text>
          </View>

          <View style={{justifyContent: 'space-between', gap: 10}}>
            <Button
              mode="contained"
              buttonColor={Colors.greenLight3}
              style={styles.button1}
              onPress={() => navigation.navigate('HistoryExchangeGift')}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 20,
                  fontFamily: getFontFamily('bold'),
                }}>
                Lịch sử
              </Text>
            </Button>
            <Button
              mode="contained"
              buttonColor={Colors.greenLight3}
              style={styles.button1}
              onPress={() => navigation.navigate('PointRule')}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: 20,
                  fontFamily: getFontFamily('bold'),
                }}>
                Quy đổi
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.listContainer}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            paddingHorizontal: 50,
            borderBottomWidth: 5,
            borderBottomColor: Colors.greenPrimary,
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontSize: 30,
              color: Colors.black,
              fontFamily: getFontFamily('bold'),
            }}>
            Đổi điểm
          </Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <RewardItem
              imageUrl={item.imageUrl}
              rewardName={item.rewardName}
              id={item.id}
              pointsRequired={item.pointsRequired || 0}
              stockQuantity={item.stockQuantity || 0}
              myPoint={myPoint}
              onRefresh={onRefresh}
            />
          )}
          numColumns={2}
          style={{flex: 1, alignSelf: 'center'}}
        />
      </View>
    </View>
  );
};

export default ExchangeGiftScreen;

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
    marginTop: -70,
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
