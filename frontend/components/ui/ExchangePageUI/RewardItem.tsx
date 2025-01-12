/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {Image} from '@rneui/themed';
import {Button, Dialog, Icon, Portal} from 'react-native-paper';
import Colors from '../../../global/Color';
import {getFontFamily} from '../../../utils/fonts';

const RewardItem = (item: {
  imageUrl: string | undefined;
  rewardName: string | undefined;
  pointsRequired: number | undefined;
}) => {
  const [dialogRedeemVisible, setDialogRedeemVisible] = React.useState(false);

  const handleRedeem = () => {};

  const dialogRedeem = () => {
    return (
      <Portal>
        <Dialog
          style={{backgroundColor: 'white', paddingHorizontal: 20}}
          visible={dialogRedeemVisible}
          onDismiss={() => {
            setDialogRedeemVisible(false);
          }}>
          <Dialog.Content>
            <View
              style={{
                paddingBottom: 10,
                borderBottomWidth: 4,
                borderBottomColor: Colors.greenPrimary,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 24,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Đổi quà
              </Text>
            </View>
            <View style={{gap: 10, marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.black,
                  }}>
                  {item.rewardName}
                </Text>
              </View>
              <View></View>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  };

  return (
    <View
      style={{
        padding: 15,
        width: 175,
        height: 280,
      }}>
      {dialogRedeem()}
      <Image
        source={{uri: item.imageUrl}}
        style={{width: '100%', height: 145, borderRadius: 10}}
      />
      <Text
        style={{
          fontSize: 20,
          color: Colors.greenPrimary,
          fontFamily: getFontFamily('semibold'),
          alignSelf: 'center',
          marginTop: 4,
        }}>
        {item.rewardName}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: Colors.greenPrimary,
          fontFamily: getFontFamily('regular'),
          alignSelf: 'center',
          marginTop: 4,
        }}>
        {item.pointsRequired} Star Point
      </Text>
      <Button
        mode="contained"
        buttonColor={Colors.greenPrimary}
        style={{
          borderRadius: 8,

          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 10,
        }}
        onPress={() => setDialogRedeemVisible(true)}>
        <Icon source={'gift-outline'} size={20} color={Colors.white} />
        <Text
          style={{
            color: Colors.white,
            fontSize: 14,
            fontFamily: getFontFamily('bold'),
          }}>
          Đổi quà
        </Text>
      </Button>
    </View>
  );
};

export default RewardItem;
