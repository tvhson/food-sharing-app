/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {Button, Icon} from 'react-native-paper';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';
import {Image} from '@rneui/themed';
import {historyExchangeItems} from '../components/data/PostData';
import {NavigationProp, RouteProp} from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const HistoryExchangeGiftScreen = ({navigation, route}: Props) => {
  const type = route?.params?.type;
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
          data={historyExchangeItems}
          style={{flex: 1}}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View
              style={{
                padding: 15,
              }}>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Image
                  source={{uri: item.rewardDetail.imageUrl}}
                  style={{width: 130, height: 'auto', borderRadius: 5}}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: getFontFamily('bold'),
                      color: Colors.black,
                    }}>
                    {item.rewardDetail.rewardName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: getFontFamily('regular'),
                      color: Colors.gray,
                    }}>
                    -{item.pointsUsed} Star Point
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: getFontFamily('regular'),
                      color:
                        item.status === 'PENDING'
                          ? Colors.bluePrimary
                          : Colors.greenPrimary,
                    }}>
                    {item.status === 'PENDING' ? 'Đang xử lý' : 'Đã giao'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: getFontFamily('regular'),
                      color: Colors.black,
                    }}>
                    {new Date(item.createdDate).toLocaleString('vi', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
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
