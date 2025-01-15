/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {Image} from '@rneui/themed';
import {getFontFamily} from '../../../utils/fonts';
import Colors from '../../../global/Color';
import {RootState} from '../../../redux/Store';
import {useSelector} from 'react-redux';
import {Switch} from 'react-native-paper';
import {updateStatusRedemption} from '../../../api/LoyaltyApi';
import screenWidth from '../../../global/Constant';

const HistoryRenderItem = ({item}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [status, setStatus] = React.useState(item.status);

  const handleUpdateStatus = async (updatedStatus: string) => {
    const response: any = await updateStatusRedemption(
      {
        status: updatedStatus,
      },
      item.id,
      accessToken,
    );
    if (response.status === 200) {
      setStatus(updatedStatus);
    }
  };

  return (
    <View
      style={{
        padding: 15,
      }}>
      <View style={{flexDirection: 'row', gap: 20}}>
        <Image
          source={{uri: item.imageUrl}}
          style={{width: 130, height: 'auto', borderRadius: 5}}
        />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: getFontFamily('bold'),
              color: Colors.black,
            }}>
            {item.rewardName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: getFontFamily('regular'),
              color: Colors.gray,
            }}>
            -{item.pointsUsed} Star Point
          </Text>
          {userInfo.role === 'ADMIN' ? (
            <View style={{flexDirection: 'row', gap: 10}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.black,
                }}>
                Xử lý
              </Text>
              <Switch
                value={status !== 'PENDING'}
                color={Colors.greenPrimary}
                onValueChange={() => {
                  handleUpdateStatus(status === 'PENDING' ? 'DONE' : 'PENDING');
                }}
              />
            </View>
          ) : (
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
          )}
          {userInfo.role === 'ADMIN' && (
            <>
              <View
                style={{
                  flexDirection: 'column',
                  width: (screenWidth * 50) / 100,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.black,
                  }}>
                  Địa chỉ: {item.location}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.black,
                }}>
                Số điện thoại: {item.phone}
              </Text>
            </>
          )}

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
  );
};

export default HistoryRenderItem;
