import {
  ActivityIndicator,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {clearReports, setReports} from '../redux/ReportReducer';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import ReportItem from '../components/ui/ReportItem';
import {RootState} from '../redux/Store';
import {getReport} from '../api/ReportApi';
import {moderateScale, scale} from '../utils/scale';
import {getFontFamily} from '../utils/fonts';
import Header from '../components/ui/Header';

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
            dispatch(clearReports());
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
      <Header title="Quản lý báo cáo" navigation={navigation} />

      <SegmentedButtons
        style={{margin: scale(20)}}
        value={valueOfSegmentButton}
        onValueChange={setValueOfSegmentButton}
        buttons={[
          {
            value: 'Pending',
            label: 'Đang chờ',
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
            label: 'Đã xử lý',
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
        style={{marginHorizontal: scale(8)}}
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
      />
    </View>
  );
};

export default ReportScreen;
const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: scale(16),
    alignItems: 'center',
  },
});
