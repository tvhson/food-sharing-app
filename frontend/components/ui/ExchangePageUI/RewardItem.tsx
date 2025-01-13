/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Image} from '@rneui/themed';
import {Button, Dialog, Icon, Menu, Portal} from 'react-native-paper';
import Colors from '../../../global/Color';
import {getFontFamily} from '../../../utils/fonts';
import {redeemPoint} from '../../../api/LoyaltyApi';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/Store';
import MAP_API_KEY from '../../data/SecretData';
import axios from 'axios';
import {useNotifications} from 'react-native-notificated';

const RewardItem = (props: {
  id: number;
  imageUrl: string | undefined;
  rewardName: string | undefined;
  pointsRequired: number;
  stockQuantity: number;
  myPoint?: number;
  onRefresh?: () => void;
}) => {
  const {notify} = useNotifications();
  const [dialogRedeemVisible, setDialogRedeemVisible] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [point, setPoint] = React.useState(props.pointsRequired);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const autocompleteRef = useRef<any | null>(null);
  const [locationName, setLocationName] = React.useState('');
  const location = useSelector((state: RootState) => state.location);
  const [phone, setPhone] = React.useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [anchor, setAnchor] = React.useState({x: 0, y: 0});

  const openMenu = () => {
    setVisible(true);
  };
  const closeMenu = () => setVisible(false);

  const handleOnLongPress = (event: any) => {
    const anchorEvent = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    setAnchor(anchorEvent);
    openMenu();
  };

  const getLocationName = async (
    latitudeCurrent: number,
    longitudeCurrent: number,
  ) => {
    try {
      if (!latitudeCurrent || !longitudeCurrent) {
        notify('error', {
          params: {
            description: 'Không thể lấy vị trí hiện tại.',
            title: 'Lỗi',
          },
        });
        return;
      }
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitudeCurrent},${longitudeCurrent}&key=${MAP_API_KEY}`,
      );
      if (response.data.results.length > 0) {
        setLocationName(response.data.results[0].formatted_address);

        autocompleteRef.current?.setAddressText(
          response.data.results[0].formatted_address,
        );
        return response.data.results[0].formatted_address;
      }
      notify('error', {
        params: {
          description: 'Không thể lấy vị trí hiện tại.',
          title: 'Lỗi',
        },
      });
      return '';
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedeem = async () => {
    //regex phone number
    const phoneRegex = new RegExp('^[0-9]{10}$');
    if (!phoneRegex.test(phone)) {
      notify('error', {
        params: {
          description: 'Số điện thoại không hợp lệ.',
          title: 'Lỗi',
        },
      });
      return;
    }

    if (!locationName || !phone) {
      notify('error', {
        params: {
          description: 'Vui lòng điền đầy đủ thông tin.',
          title: 'Lỗi',
        },
      });
      return;
    }

    const response: any = await redeemPoint(
      {
        point: point || 0,
        rewardId: props.id,
        location: locationName,
        phone: phone,
      },
      accessToken,
    );
    if (response.status === 200) {
      setDialogRedeemVisible(false);
      props.onRefresh?.();
      setQuantity(1);
      setPoint(props.pointsRequired);
      setPhone('');
      setLocationName('');

      notify('success', {
        params: {
          description: 'Đổi quà thành công.',
          title: 'Thành công',
        },
      });
    } else {
      setDialogRedeemVisible(false);
      setQuantity(1);
      setPoint(props.pointsRequired);
      setPhone('');
      setLocationName('');

      notify('error', {
        params: {
          description: 'Đổi quà thất bại.',
          title: 'Lỗi',
        },
      });
    }
  };

  const dialogRedeem = () => {
    return (
      <Portal>
        <Dialog
          style={{backgroundColor: 'white', paddingHorizontal: 20}}
          visible={dialogRedeemVisible}
          onDismiss={() => {
            setQuantity(1);
            setPoint(props.pointsRequired);
            setPhone('');
            setLocationName('');
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
                    fontSize: 24,
                    fontFamily: getFontFamily('semibold'),
                    color: Colors.black,
                  }}>
                  {props.rewardName}
                </Text>
                <View
                  style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                        setPoint((point ?? 0) - (props.pointsRequired ?? 0));
                      }
                    }}
                    disabled={quantity === 1}
                    style={{
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: Colors.black,
                    }}>
                    <Icon source={'minus'} size={20} color={Colors.black} />
                  </TouchableOpacity>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 30,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: getFontFamily('semibold'),
                        color: Colors.black,
                      }}>
                      {quantity}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (quantity < props.stockQuantity) {
                        setQuantity(quantity + 1);
                        setPoint((point ?? 0) + (props.pointsRequired ?? 0));
                      }
                    }}
                    disabled={quantity === props.stockQuantity}
                    style={{
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: Colors.black,
                    }}>
                    <Icon source={'plus'} size={20} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: getFontFamily('semibold'),
                    color: Colors.black,
                  }}>
                  Star Point
                </Text>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: Colors.black,
                        fontSize: 24,
                        fontFamily: getFontFamily('bold'),
                      }}>
                      {point}
                    </Text>
                    <View>
                      <Image
                        source={require('../../../assets/images/star-black.png')}
                        style={{width: 24, height: 24}}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <TextInput
                placeholder="Số điện thoại"
                placeholderTextColor={'#706d6d'}
                style={{
                  fontSize: 16,
                  padding: 10,
                  backgroundColor: '#eff2ff',
                  borderRadius: 8,
                  color: 'black',
                  borderWidth: 2,
                  borderColor: Colors.greenPrimary,
                  fontFamily: getFontFamily('regular'),
                }}
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Địa chỉ nhận"
                placeholderTextColor={'#706d6d'}
                style={{
                  fontSize: 16,
                  padding: 10,
                  backgroundColor: '#eff2ff',
                  borderRadius: 8,
                  color: 'black',
                  borderWidth: 2,
                  borderColor: Colors.greenPrimary,
                  fontFamily: getFontFamily('regular'),
                }}
                value={locationName}
                onChangeText={setLocationName}
              />

              <Button
                onPress={() =>
                  getLocationName(location.latitude, location.longitude)
                }
                style={{
                  backgroundColor: Colors.greenPrimary,
                  width: 200,
                  alignSelf: 'center',
                  borderRadius: 10,
                }}
                labelStyle={{
                  fontFamily: getFontFamily('bold'),
                  fontSize: 16,
                  color: 'white',
                }}>
                Sử dụng vị trí hiện tại
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogRedeemVisible(false);
                setQuantity(1);
                setPoint(props.pointsRequired);
                setPhone('');
                setLocationName('');
              }}
              textColor="red"
              labelStyle={{fontFamily: getFontFamily('regular'), fontSize: 20}}>
              Hủy
            </Button>
            <Button
              onPress={handleRedeem}
              textColor={Colors.greenPrimary}
              labelStyle={{fontFamily: getFontFamily('regular'), fontSize: 20}}>
              Đổi quà
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const menuList = () => {
    return (
      <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
        <Menu.Item title="Edit" leadingIcon="pencil" />
        <Menu.Item title="Delete" leadingIcon="delete" />
        <Menu.Item title="Report" leadingIcon="alert-octagon" />
      </Menu>
    );
  };

  return (
    <TouchableWithoutFeedback onLongPress={event => handleOnLongPress(event)}>
      <View
        style={{
          padding: 15,
          width: 175,
          height: 280,
        }}>
        {dialogRedeem()}
        {userInfo.role === 'ADMIN' ? menuList() : null}
        <Image
          source={{uri: props.imageUrl}}
          style={{width: '100%', height: 145, borderRadius: 10}}
        />
        <Text
          style={{
            fontSize: 20,
            color:
              props.stockQuantity === 0
                ? Colors.gray
                : props.myPoint === undefined
                ? Colors.greenPrimary
                : props.myPoint > props.pointsRequired
                ? Colors.greenPrimary
                : Colors.red,
            fontFamily: getFontFamily('semibold'),
            alignSelf: 'center',
            marginTop: 4,
          }}>
          {props.rewardName}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color:
              props.stockQuantity === 0
                ? Colors.gray
                : props.myPoint === undefined
                ? Colors.greenPrimary
                : props.myPoint > props.pointsRequired
                ? Colors.greenPrimary
                : Colors.red,
            fontFamily: getFontFamily('regular'),
            alignSelf: 'center',
            marginTop: 4,
          }}>
          {props.pointsRequired} Star Point
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
          disabled={
            props.myPoint === undefined ||
            props.myPoint < props.pointsRequired ||
            props.stockQuantity === 0
          }
          onPress={() => {
            setDialogRedeemVisible(true);
            setQuantity(1);
            setPoint(props.pointsRequired);
            setPhone('');
            setLocationName('');
          }}>
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
    </TouchableWithoutFeedback>
  );
};

export default RewardItem;
