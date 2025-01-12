/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../global/Color';
import {Button, Icon} from 'react-native-paper';
import {getFontFamily} from '../utils/fonts';
import {Image} from '@rneui/themed';
import screenWidth from '../global/Constant';
import {rewardItems} from '../components/data/PostData';
import RewardItem from '../components/ui/ExchangePageUI/RewardItem';

const ExchangeGiftScreen = ({navigation}: any) => {
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
              <Text>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 55,
                    fontFamily: getFontFamily('bold'),
                  }}>
                  100
                </Text>
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
          data={rewardItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <RewardItem
              imageUrl={item.imageUrl}
              rewardName={item.rewardName}
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
