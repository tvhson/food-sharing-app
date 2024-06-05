/* eslint-disable react-native/no-inline-styles */
import {Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import React, {useState} from 'react';
import {Image} from '@rneui/themed';
import Colors from '../../global/Color';
import {Button, Dialog, Menu, Portal, RadioButton} from 'react-native-paper';
import {changeRoleById} from '../../api/AccountsApi';
import {useDispatch, useSelector} from 'react-redux';
import {changeRole} from '../../redux/AccountsReducer';
import {RootState} from '../../redux/Store';
import {banAccount} from '../../api/ReportApi';
import {createNotifications} from 'react-native-notificated';

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
          description: 'Role has been changed successfully',
          title: 'Change role',
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
          description: 'Account has been banned successfully',
          title: 'Ban account',
          style: {multiline: 100},
        },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onLongPress={handleOnLongPress}>
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
                  Change role of {item.name}
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
                      <Text>Organization</Text>
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
                  Ban account {item.name}
                </Dialog.Title>
                <Dialog.Content>
                  <RadioButton.Group
                    onValueChange={newValue => setBanDays(newValue)}
                    value={role}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="1" />
                      <Text>1 day</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="7" />
                      <Text>1 week</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="14" />
                      <Text>2 weeks</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="30" />
                      <Text>1 month</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="90" />
                      <Text>3 months</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="180" />
                      <Text>6 months</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20,
                      }}>
                      <RadioButton value="365" />
                      <Text>1 year</Text>
                    </View>
                  </RadioButton.Group>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => setVisibleDialogBan(false)}
                    textColor="red">
                    Cancel
                  </Button>
                  <Button onPress={() => handleBanAccount()}>Ban</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  setVisibleDialogRole(true);
                }}
                title="Change role"
                leadingIcon="account-wrench"
              />
              <Menu.Item
                onPress={() => {
                  setVisible(false);
                  setVisibleDialogBan(true);
                }}
                title="Ban account"
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
                  {'\u2022'} Role:{' '}
                </Text>
                {item.role.charAt(0).toUpperCase() +
                  item.role.slice(1).toLowerCase()}
              </Text>
              {item.birthDate ? (
                <Text style={{fontSize: 16, color: Colors.grayText}}>
                  <Text style={{fontWeight: '500', color: 'black'}}>
                    {'\u2022'} Birth date:{' '}
                  </Text>
                  {new Date(item.birthDate).toLocaleDateString()}
                </Text>
              ) : null}
              {item.locationName ? (
                <Text style={{fontSize: 16, color: Colors.grayText}}>
                  <Text style={{fontWeight: '500', color: 'black'}}>
                    {'\u2022'} Location:{' '}
                  </Text>
                  {item.locationName}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default ReportAccountItem;
