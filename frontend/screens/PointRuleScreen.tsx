import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Colors from '../global/Color';
import {Icon} from 'react-native-paper';
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {getFontFamily} from '../utils/fonts';

const PointRuleScreen = ({navigation}: any) => {
  const data = [
    {
      id: 1,
      title: 'Đăng bài chia sẻ',
      point: 10,
    },
    {
      id: 2,
      title: 'Đánh giá thực phẩm',
      point: 5,
    },
    {
      id: 3,
      title: 'Tham gia chiến dịch',
      point: 20,
    },
    {
      id: 4,
      title: 'Cập nhật hồ sơ',
      point: 5,
    },
  ];

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
          Quy đổi
        </Text>
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          style={{marginTop: 20}}
          renderItem={({item}) => (
            <View
              style={{
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: getFontFamily('semibold'),
                  color: Colors.greenPrimary,
                }}>
                {item.point} Star Point
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default PointRuleScreen;
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
