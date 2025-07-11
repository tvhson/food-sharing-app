import {Image} from '@rneui/themed';
import React, {useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {getMyPoint, getRewards} from '../api/LoyaltyApi';
import RewardItem from '../components/ui/ExchangePageUI/RewardItem';
import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {useLoading} from '../utils/LoadingContext';
import {moderateScale, scale} from '../utils/scale';

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
            padding: scale(20),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scale(20),
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source={'arrow-left'} size={scale(30)} color={Colors.white} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.white,
              fontSize: moderateScale(20),
              fontFamily: getFontFamily('semibold'),
            }}>
            Đổi quà
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: scale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                gap: scale(10),
                alignItems: 'center',
              }}>
              <View>
                <Image
                  source={require('../assets/images/star-white.png')}
                  style={{width: scale(60), height: scale(60)}}
                />
              </View>

              <Text
                style={{
                  color: Colors.white,
                  fontSize: moderateScale(55),
                  fontFamily: getFontFamily('bold'),
                }}>
                {myPoint}
              </Text>
            </View>
            <Text
              style={{
                color: Colors.white,
                fontSize: moderateScale(36),
                fontFamily: getFontFamily('semibold'),
              }}>
              Star Point
            </Text>
          </View>

          <View style={{justifyContent: 'space-between', gap: scale(10)}}>
            <Button
              mode="contained"
              buttonColor={Colors.greenLight3}
              style={styles.button1}
              onPress={() => navigation.navigate('HistoryExchangeGift')}>
              <Text
                style={{
                  color: Colors.black,
                  fontSize: moderateScale(20),
                  fontFamily: getFontFamily('bold'),
                  lineHeight: scale(30),
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
                  fontSize: moderateScale(20),
                  fontFamily: getFontFamily('bold'),
                  lineHeight: scale(30),
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
            paddingHorizontal: scale(50),
            borderBottomWidth: scale(5),
            borderBottomColor: Colors.greenPrimary,
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontSize: moderateScale(30),
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
          showsVerticalScrollIndicator={false}
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
    height: scale(300),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  listContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    marginHorizontal: scale(20),
    marginTop: scale(-70),
    flex: 1,
    paddingTop: scale(20),
  },
  button1: {
    borderRadius: scale(8),
    width: scale(150),
    height: scale(50),
    justifyContent: 'center',
  },
});
