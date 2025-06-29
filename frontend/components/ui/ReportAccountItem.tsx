import React, {useState} from 'react';
import {Button, Dialog, Menu, Portal, RadioButton} from 'react-native-paper';
/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Image} from '@rneui/themed';
import {createNotifications} from 'react-native-notificated';
import {changeRoleById} from '../../api/AccountsApi';
import {banAccount} from '../../api/ReportApi';
import Colors from '../../global/Color';
import {changeRole} from '../../redux/AccountsReducer';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {useNavigation} from '@react-navigation/native';

const {useNotifications} = createNotifications();

const ReportAccountItem = ({item, isReport}: any) => {
  const {notify} = useNotifications();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [visibleDialogRole, setVisibleDialogRole] = useState(false);
  const [visibleDialogBan, setVisibleDialogBan] = useState(false);
  const [role, setRole] = useState(item.role);
  const [banDays, setBanDays] = useState('1');
  const [visible, setVisible] = useState<boolean>(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0});
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
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
  const handleOnPress = () => {
    navigation.navigate(Route.PersonalPageOfOther, {id: item.id});
  };
  const handleChangeRole = async () => {
    const response: any = await changeRoleById(item.id, role, accessToken);
    if (response.status === 200) {
      setVisibleDialogRole(false);
      dispatch(
        changeRole({
          id: item.id,
          role: role,
          email: item.email,
          name: item.name,
          birthDate: item.birthDate,
          imageUrl: item.imageUrl,
          phone: item.phone,
          description: item.description,
          locationName: item.locationName,
          status: item.status,
          bannedDate: item.bannedDate,
          latitude: item.latitude,
          longitude: item.longitude,
        }),
      );
      notify('success', {
        params: {
          description: 'Đã thay đổi vai trò thành công',
          title: 'Thay đổi vai trò',
          style: {multiline: 100},
        },
      });
    } else {
      console.log(response);
    }
  };
  const handleBanAccount = async () => {
    const response: any = await banAccount(
      item.id,
      Number(banDays),
      accessToken,
    );
    if (response.status === 200) {
      setVisibleDialogBan(false);
      notify('success', {
        params: {
          description: 'Đã khóa tài khoản thành công',
          title: 'Khóa tài khoản',
          style: {multiline: 100},
        },
      });
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress} onLongPress={handleOnLongPress}>
      <View
        style={{
          padding: 10,
          marginVertical: 4,
          backgroundColor: 'white',
          borderRadius: 8,
          flexDirection: 'row',
          elevation: 2,
        }}>
        {!isReport ? (
          <>
            <Portal>
              <Dialog
                visible={visibleDialogRole}
                onDismiss={() => setVisibleDialogRole(false)}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={{textAlign: 'center'}}>
                  Thay đổi vai trò của {item.name}
                </Dialog.Title>
                <Dialog.Content>
                  <RadioButton.Group
                    onValueChange={newValue => setRole(newValue)}
                    value={role}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="USER" />
                      <Text>User</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="ORGANIZATION" />
                      <Text>Tổ chức</Text>
                    </View>
                  </RadioButton.Group>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => setVisibleDialogRole(false)}
                    textColor="red">
                    Cancel
                  </Button>
                  <Button onPress={() => handleChangeRole()}>Save</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <Portal>
              <Dialog
                visible={visibleDialogBan}
                onDismiss={() => setVisibleDialogBan(false)}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={{textAlign: 'center'}}>
                  Khóa tài khoản {item.name}
                </Dialog.Title>
                <Dialog.Content>
                  <RadioButton.Group
                    onValueChange={newValue => setBanDays(newValue)}
                    value={banDays}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="1" />
                      <Text>1 ngày</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="7" />
                      <Text>1 tuần</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="14" />
                      <Text>2 tuần</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="30" />
                      <Text>1 tháng</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="90" />
                      <Text>3 tháng</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="180" />
                      <Text>6 tháng</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="365" />
                      <Text>1 năm</Text>
                    </View>
                  </RadioButton.Group>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => setVisibleDialogBan(false)}
                    textColor="red">
                    Hủy
                  </Button>
                  <Button onPress={() => handleBanAccount()}>
                    Khóa tài khoản
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={anchor}
              contentStyle={{backgroundColor: 'white'}}>
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  setVisibleDialogRole(true);
                }}
                title="Thay đổi vai trò"
                leadingIcon="account-wrench"
              />
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  setVisibleDialogBan(true);
                }}
                title="Khóa tài khoản"
                leadingIcon="account-lock"
              />
            </Menu>
          </>
        ) : null}
        <Image
          source={{
            uri: item.imageUrl
              ? item.imageUrl
              : 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={{width: 150, height: 150, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
                color: Colors.postTitle,
              }}>
              {item.name}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Email:{' '}
                </Text>
                {item.email}
              </Text>
              <Text style={{fontSize: 16, color: Colors.grayText}}>
                <Text style={{fontWeight: '500', color: 'black'}}>
                  {'\u2022'} Vai trò:{' '}
                </Text>
                {item.role.charAt(0).toUpperCase() +
                  item.role.slice(1).toLowerCase()}
              </Text>
              {item.birthDate ? (
                <Text style={{fontSize: 16, color: Colors.grayText}}>
                  <Text style={{fontWeight: '500', color: 'black'}}>
                    {'\u2022'} Ngày sinh:{' '}
                  </Text>
                  {new Date(item.birthDate).toLocaleDateString('vi-VN')}
                </Text>
              ) : null}
              {item.locationName ? (
                <Text style={{fontSize: 16, color: Colors.grayText}}>
                  <Text style={{fontWeight: '500', color: 'black'}}>
                    {'\u2022'} Địa chỉ:{' '}
                  </Text>
                  {item.locationName}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ReportAccountItem;
