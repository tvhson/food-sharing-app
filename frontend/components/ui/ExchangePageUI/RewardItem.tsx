import {Button, Dialog, Icon, Menu, Portal} from 'react-native-paper';
import {FormProvider, useForm} from 'react-hook-form';
import {
  IReward,
  deleteReward,
  redeemPoint,
  updateReward,
} from '../../../api/LoyaltyApi';
import React, {useRef, useState} from 'react';
/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Colors from '../../../global/Color';
import EditRewardItem from './EditRewardItem';
import {Image} from '@rneui/themed';
import {MAP_API_KEY} from '@env';
import {RootState} from '../../../redux/Store';
import UploadPhoto from '../UploadPhoto';
import axios from 'axios';
import {getFontFamily} from '../../../utils/fonts';
import screenWidth from '../../../global/Constant';
import {uploadPhoto} from '../../../api/UploadPhotoApi';
import {useNotifications} from 'react-native-notificated';
import {useSelector} from 'react-redux';
import {moderateScale, scale} from '../../../utils/scale';
import {CustomInput} from '../CustomInput/CustomInput';
import {createExchangeRewardValidate} from '../../../utils/schema/exchange-reward';
import {zodResolver} from '@hookform/resolvers/zod';
import {ExchangeRewardValidateSchema} from '../../../utils/schema/exchange-reward';
import {CustomText} from '../CustomText';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

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
  const [dialogEditVisible, setDialogEditVisible] = React.useState(false);
  const [dialogDeleteVisible, setDialogDeleteVisible] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [point, setPoint] = React.useState(props.pointsRequired);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const autocompleteRef = useRef<any | null>(null);
  const location = useSelector((state: RootState) => state.location);

  const [visible, setVisible] = useState<boolean>(false);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [isUploadVisible, setIsUploadVisible] = useState(0);
  const [anchor, setAnchor] = React.useState({x: 0, y: 0});

  const methods = useForm<IReward>({
    defaultValues: {
      rewardName: props.rewardName,
      pointsRequired: props.pointsRequired,
      stockQuantity: props.stockQuantity,
      imageUrl: props.imageUrl,
    },
  });

  const {
    control: redeemControl,
    handleSubmit: redeemHandleSubmit,
    formState: redeemFormState,
    setValue: redeemSetValue,
  } = useForm<ExchangeRewardValidateSchema>({
    resolver: zodResolver(createExchangeRewardValidate()),
    defaultValues: {
      phone: '',
      address: '',
    },
    mode: 'onChange',
  });

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
        redeemSetValue('address', response.data.results[0].formatted_address, {
          shouldValidate: true,
        });

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

  const handleRedeem = async (data: ExchangeRewardValidateSchema) => {
    const response: any = await redeemPoint(
      {
        point: point || 0,
        rewardId: props.id,
        location: data.address,
        phone: data.phone,
      },
      accessToken,
    );
    if (response.status === 200) {
      setDialogRedeemVisible(false);
      props.onRefresh?.();
      setQuantity(1);
      setPoint(props.pointsRequired);

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

      notify('error', {
        params: {
          description: 'Đổi quà thất bại.',
          title: 'Lỗi',
        },
      });
    }
  };

  const handleEdit = async (data: IReward) => {
    setDialogEditVisible(false);
    const response: any = await updateReward(data, accessToken, props.id);

    if (response.status === 200) {
      notify('success', {
        params: {
          description: 'Chỉnh sửa quà thành công.',
          title: 'Thành công',
        },
      });
      props.onRefresh?.();
    } else {
      notify('error', {
        params: {
          description: 'Chỉnh sửa quà không thành công.',
          title: 'Lỗi',
        },
      });
    }
  };

  const onError = (errors: any) => {
    setDialogEditVisible(false);
    notify('error', {
      params: {
        description: 'Vui lòng điền đầy đủ thông tin.',
        title: 'Lỗi',
      },
    });
  };

  const handleDelete = async () => {
    setDialogDeleteVisible(false);
    const response: any = await deleteReward(props.id, accessToken);

    if (response.status === 200) {
      notify('success', {
        params: {
          description: 'Xóa quà thành công.',
          title: 'Thành công',
        },
      });
      props.onRefresh?.();
    } else {
      notify('error', {
        params: {
          description: 'Xóa quà không thành công.',
          title: 'Lỗi',
        },
      });
    }
  };
  const dialogRedeem = () => {
    return (
      <Portal>
        <Dialog
          style={{backgroundColor: 'white'}}
          visible={dialogRedeemVisible}
          onDismiss={() => {
            setQuantity(1);
            setPoint(props.pointsRequired);
            setDialogRedeemVisible(false);
          }}>
          <Dialog.Content>
            <View
              style={{
                paddingBottom: scale(10),
                borderBottomWidth: scale(4),
                borderBottomColor: Colors.greenPrimary,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: moderateScale(20),
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Đổi quà
              </Text>
            </View>
            <View style={{gap: scale(10), marginTop: scale(10)}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: getFontFamily('regular'),
                    color: Colors.black,
                  }}>
                  {props.rewardName}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: scale(10),
                    alignItems: 'center',
                  }}>
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
                      width: scale(30),
                    }}>
                    <Text
                      style={{
                        fontSize: moderateScale(16),
                        fontFamily: getFontFamily('regular'),
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
                      borderRadius: scale(100),
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
                    fontSize: moderateScale(16),
                    fontFamily: getFontFamily('regular'),
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
                        fontSize: moderateScale(16),
                        fontFamily: getFontFamily('regular'),
                      }}>
                      {point}
                    </Text>
                    <View>
                      <Image
                        source={require('../../../assets/images/star-black.png')}
                        style={{width: scale(24), height: scale(24)}}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <CustomInput
                controller={{
                  control: redeemControl,
                  name: 'phone',
                }}
                label="Số điện thoại"
                labelColor={Colors.gray600}
                keyboardType="numeric"
                errorText={redeemFormState.errors.phone?.message}
              />
              <View style={{height: scale(50)}}>
                <GooglePlacesAutocomplete
                  ref={autocompleteRef}
                  fetchDetails={true}
                  placeholder="Địa chỉ nhận"
                  onPress={(data, details = null) => {
                    redeemSetValue('address', data.description, {
                      shouldValidate: true,
                    });
                  }}
                  disableScroll={true}
                  query={{
                    key: MAP_API_KEY,
                    language: 'vi',
                  }}
                  styles={{
                    container: {
                      borderColor: redeemFormState.errors.address
                        ? Colors.red
                        : Colors.gray300,
                      borderRadius: scale(10),
                      borderWidth: 1,
                      backgroundColor: Colors.white,
                    },
                    textInput: {
                      fontSize: scale(16),
                      color: Colors.black,
                      backgroundColor: Colors.white,
                      fontFamily: getFontFamily('regular'),
                    },
                  }}
                />
                {redeemFormState.errors.address && (
                  <CustomText
                    fontType="medium"
                    size={14}
                    textColor={Colors.red}
                    style={[
                      {marginTop: scale(-16), paddingHorizontal: scale(10)},
                    ]}>
                    {redeemFormState.errors.address.message}
                  </CustomText>
                )}
              </View>

              <Button
                onPress={() =>
                  getLocationName(location.latitude, location.longitude)
                }
                style={{
                  backgroundColor: Colors.greenPrimary,
                  width: scale(200),
                  alignSelf: 'center',
                  borderRadius: scale(10),
                }}
                labelStyle={{
                  fontFamily: getFontFamily('bold'),
                  fontSize: moderateScale(16),
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
              }}
              textColor="red"
              labelStyle={{
                fontFamily: getFontFamily('regular'),
                fontSize: moderateScale(20),
              }}>
              Hủy
            </Button>
            <Button
              onPress={redeemHandleSubmit(handleRedeem)}
              textColor={Colors.greenPrimary}
              labelStyle={{
                fontFamily: getFontFamily('regular'),
                fontSize: moderateScale(20),
                lineHeight: scale(30),
              }}>
              Đổi quà
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const dialogEdit = () => {
    const postImage = async (image: any) => {
      const dataForm = new FormData();
      dataForm.append('file', {
        uri: image.path,
        type: image.mime || 'image/jpeg',
        name: image.filename || 'image.jpg',
      });
      const response: any = await uploadPhoto(dataForm, accessToken);
      if (response.status === 200) {
        methods.setValue('imageUrl', response.data[0]);
      } else {
        notify('error', {
          params: {
            description: 'Lỗi không thể tải ảnh lên',
            title: 'Lỗi',
          },
        });
      }
    };
    return (
      <Portal>
        <UploadPhoto
          isVisible={isUploadVisible}
          setVisible={setIsUploadVisible}
          height={scale(300)}
          width={scale(350)}
          isCircle={false}
          postImage={postImage}
          isMultiple={false}
        />
        <Dialog
          style={{backgroundColor: 'white', paddingHorizontal: 20}}
          visible={dialogEditVisible}
          onDismiss={() => {
            setDialogEditVisible(false);
          }}>
          <Dialog.Content>
            <View
              style={{
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: moderateScale(24),
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Chỉnh sửa
              </Text>
            </View>
            <FormProvider {...methods}>
              <EditRewardItem setUploadPhoto={setIsUploadVisible} />
            </FormProvider>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogEditVisible(false);
              }}
              textColor="red"
              labelStyle={{
                fontFamily: getFontFamily('regular'),
                fontSize: moderateScale(20),
              }}>
              Hủy
            </Button>
            <Button
              onPress={methods.handleSubmit(handleEdit, onError)}
              textColor={Colors.greenPrimary}
              labelStyle={{
                fontFamily: getFontFamily('regular'),
                fontSize: moderateScale(20),
              }}>
              Lưu
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const dialogDelete = () => {
    return (
      <Portal>
        <Dialog
          style={{backgroundColor: 'white', paddingHorizontal: 20}}
          visible={dialogDeleteVisible}
          onDismiss={() => {
            setDialogDeleteVisible(false);
          }}>
          <Dialog.Content>
            <View
              style={{
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: moderateScale(24),
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Xóa quà
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontFamily: getFontFamily('semibold'),
                  color: Colors.black,
                }}>
                Bạn có chắc chắn muốn xóa quà này không?
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialogDeleteVisible(false);
              }}
              textColor="red"
              labelStyle={{
                fontFamily: getFontFamily('regular'),
                fontSize: moderateScale(20),
              }}>
              Hủy
            </Button>
            <Button
              onPress={handleDelete}
              textColor={Colors.greenPrimary}
              labelStyle={{
                fontFamily: getFontFamily('regular'),
                fontSize: moderateScale(20),
              }}>
              Xóa
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const menuList = () => {
    return (
      <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
        <Menu.Item
          title="Chỉnh sửa"
          leadingIcon="pencil"
          onPress={() => {
            setDialogEditVisible(true);
            closeMenu();
          }}
        />
        <Menu.Item
          title="Xóa"
          leadingIcon="delete"
          onPress={() => {
            setDialogDeleteVisible(true);
            closeMenu();
          }}
        />
      </Menu>
    );
  };

  return (
    <TouchableWithoutFeedback onLongPress={event => handleOnLongPress(event)}>
      <View
        style={{
          padding: scale(10),
          width: screenWidth * 0.45,
          height: 'auto',
        }}>
        {dialogRedeem()}
        {userInfo.role === 'ADMIN' ? dialogEdit() : null}
        {userInfo.role === 'ADMIN' ? menuList() : null}
        {userInfo.role === 'ADMIN' ? dialogDelete() : null}
        <Image
          source={{uri: props.imageUrl}}
          style={{width: '100%', height: scale(145), borderRadius: scale(10)}}
        />
        <Text
          style={{
            fontSize: moderateScale(20),
            color:
              props.stockQuantity === 0
                ? Colors.gray
                : props.myPoint === undefined
                ? Colors.greenPrimary
                : props.myPoint >= props.pointsRequired
                ? Colors.greenPrimary
                : Colors.red,
            fontFamily: getFontFamily('semibold'),
            alignSelf: 'center',
            marginTop: scale(4),
          }}>
          {props.rewardName}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(15),
            color:
              props.stockQuantity === 0
                ? Colors.gray
                : props.myPoint === undefined
                ? Colors.greenPrimary
                : props.myPoint >= props.pointsRequired
                ? Colors.greenPrimary
                : Colors.red,
            fontFamily: getFontFamily('regular'),
            alignSelf: 'center',
            marginTop: scale(4),
          }}>
          {props.pointsRequired} Star Point
        </Text>
        <Button
          mode="contained"
          buttonColor={Colors.greenPrimary}
          style={{
            borderRadius: scale(8),
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: scale(10),
            gap: scale(10),
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
          }}>
          <Icon source={'gift-outline'} size={scale(20)} color={Colors.white} />
          <Text
            style={{
              color: Colors.white,
              fontSize: moderateScale(14),
              fontFamily: getFontFamily('bold'),
              marginLeft: scale(5),
            }}>
            Đổi quà
          </Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RewardItem;
