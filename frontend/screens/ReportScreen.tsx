/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Colors from '../global/Color';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {Image} from '@rneui/themed';
import {IconButton, SegmentedButtons} from 'react-native-paper';
import {getReport} from '../api/ReportApi';
import {clearReports, setReports} from '../redux/ReportReducer';
import ReportItem from '../components/ui/ReportItem';

const ReportScreen = ({navigation}: any) => {
  const ReportPendingDatas = useSelector(
    (state: RootState) => state.report.reportsPending,
  );
  const ReportFinishedDatas = useSelector(
    (state: RootState) => state.report.reportsFinished,
  );
  const accessToken = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const [reportPending, setReportPending] = useState<any>(ReportPendingDatas);
  const [reportFinished, setReportFinished] =
    useState<any>(ReportFinishedDatas);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [valueOfSegmentButton, setValueOfSegmentButton] = useState('Pending');

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
    const saveReport = async () => {
      if (accessToken) {
        getReport(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            console.log(response.data);
            dispatch(setReports(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    setRefreshing(true);
    dispatch(clearReports());
    saveReport();
    setCurrentPage(0);
    setRefreshing(false);
  };

  useEffect(() => {
    const saveReport = async () => {
      if (ReportPendingDatas || ReportFinishedDatas) {
        setReportFinished(ReportFinishedDatas);
        setReportPending(ReportPendingDatas);
      } else if (accessToken) {
        getReport(accessToken.toString()).then((response: any) => {
          if (response.status === 200) {
            dispatch(setReports(response.data));
          } else {
            console.log(response);
          }
        });
      }
    };
    const fetchData = async () => {
      setIsLoading(true);
      await saveReport();
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, accessToken, ReportPendingDatas, ReportFinishedDatas]);

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
          Reports
        </Text>
      </View>
      <SegmentedButtons
        style={{margin: 20}}
        value={valueOfSegmentButton}
        onValueChange={setValueOfSegmentButton}
        buttons={[
          {
            value: 'Pending',
            label: 'Pending',
            checkedColor: 'white',
            style: {
              backgroundColor:
                valueOfSegmentButton === 'Pending'
                  ? Colors.button
                  : 'transparent',
            },
          },
          {
            value: 'Finished',
            label: 'Finished',
            checkedColor: 'white',
            style: {
              backgroundColor:
                valueOfSegmentButton === 'Finished'
                  ? Colors.button
                  : 'transparent',
            },
          },
        ]}
      />
      <FlatList
        style={{marginHorizontal: 8}}
        data={
          valueOfSegmentButton === 'Pending' ? reportPending : reportFinished
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ReportItem item={item} navigation={navigation} />
        )}
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

export default ReportScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
