import {
  Button,
  Dialog,
  Icon,
  Menu,
  Portal,
  RadioButton,
} from 'react-native-paper';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {IGetGroupResponse, joinGroup} from '../../api/GroupApi';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../global/Color';
import React, {useState} from 'react';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {addGroup} from '../../redux/GroupReducer';
import {getFontFamily} from '../../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import {notify} from 'react-native-notificated';
import {moderateScale, scale} from '../../utils/scale';
import {reportPost} from '../../api/PostApi';

const screenWidth = Dimensions.get('window').width;

interface IOrganizationPost2Props {
  item: IGetGroupResponse;
}

const OrganizationPost2 = (props: IOrganizationPost2Props) => {
  const token = useSelector((state: RootState) => state.token.key);
  const user = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const {item} = props;

  // Dialog and menu state
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDialogReport, setVisibleDialogReport] =
    useState<boolean>(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0});
  const [reason, setReason] = useState<string>(
    'Nhóm linh tinh, lặp lại, thông tin sai lệch',
  );
  const [descriptionReason, setDescriptionReason] = useState<string>('');

  const openMenu = () => {
    setReason('Nhóm linh tinh, lặp lại, thông tin sai lệch');
    setDescriptionReason('');
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const handleOnLongPress = (event: any) => {
    const anchorEvent = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    setAnchor(anchorEvent);
    openMenu();
  };

  const handleReportGroup = async () => {
    if (token) {
      // You'll need to implement the reportGroup API function
      const response: any = await reportPost(token, {
        title: reason,
        description: descriptionReason,
        imageUrl: item.imageUrl,
        status: 'PENDING',
        linkId: item.id,
        note: '',
        type: 'ORGANIZATION',
        senderId: user.id,
        accusedId: item.author.id,
        senderName: user.name,
      });
      if (response.status === 200) {
        console.log('Report group success');
        notify('success', {
          params: {
            description: 'Báo cáo thành công',
            title: 'Thành công',
          },
        });
      }

      setVisibleDialogReport(false);
    }
  };

  const handleAttend = async () => {
    if (item.joined === 'JOINED') {
      navigation.navigate(Route.GroupHomeScreen, {
        item,
      });
      return;
    }
    await joinGroup(token, item.id, user.id).then(response => {
      dispatch(addGroup(response));
    });
  };

  const handleNavigateToDetail = () => {
    navigation.navigate(Route.OrganizationPostDetail2, {
      item,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToDetail}
      style={styles.container}
      activeOpacity={0.8}>
      <Portal>
        <Dialog
          style={{backgroundColor: 'white'}}
          visible={visibleDialogReport}
          onDismiss={() => setVisibleDialogReport(false)}>
          <Dialog.Icon icon="alert" color={Colors.red} />
          <Dialog.Title
            style={{textAlign: 'center', fontFamily: getFontFamily('regular')}}>
            Báo cáo nhóm
          </Dialog.Title>
          <Dialog.Content style={{paddingHorizontal: scale(16)}}>
            <RadioButton.Group
              onValueChange={newValue => setReason(newValue)}
              value={reason}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Nhóm linh tinh, lặp lại, thông tin sai lệch"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Nhóm linh tinh, lặp lại, thông tin sai lệch
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Nội dung không lành mạnh"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Nội dung không lành mạnh
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton value="Nhóm lừa đảo" color={Colors.greenPrimary} />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Nhóm lừa đảo
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton
                  value="Nhóm chứa các lo ngại về sức khỏe"
                  color={Colors.greenPrimary}
                />
                <Text style={{fontFamily: getFontFamily('regular')}}>
                  Nhóm chứa các lo ngại về sức khỏe
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RadioButton value="Khác" color={Colors.greenPrimary} />
                <Text style={{fontFamily: getFontFamily('regular')}}>Khác</Text>
              </View>
            </RadioButton.Group>
            {reason === 'Khác' && (
              <View
                style={{paddingHorizontal: scale(10), marginTop: scale(10)}}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.gray500,
                    borderRadius: scale(10),
                    color: 'black',
                    fontSize: moderateScale(14),
                    fontFamily: getFontFamily('regular'),
                  }}
                  placeholder="Nhập lý do của bạn"
                  value={descriptionReason}
                  multiline
                  numberOfLines={4}
                  onChangeText={text => setDescriptionReason(text)}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => setVisibleDialogReport(false)}
              textColor={Colors.gray500}>
              Hủy
            </Button>
            <Button
              labelStyle={{fontFamily: getFontFamily('bold')}}
              onPress={() => handleReportGroup()}
              textColor={Colors.red}>
              Báo cáo
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
            setVisibleDialogReport(true);
          }}
          title="Báo cáo"
          leadingIcon="alert-octagon"
        />
      </Menu>
      <View>
        <TouchableOpacity
          onPress={event => handleOnLongPress(event)}
          style={styles.btnFloat}>
          <Icon
            source={'dots-horizontal'}
            size={30}
            color={Colors.grayPrimary}
          />
        </TouchableOpacity>
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={styles.img}
        />
        <View style={styles.itemContainer}>
          <Text style={styles.textTime}>
            Bắt đầu hoạt động từ{' '}
            {new Date(item.startDate).toLocaleDateString('vi-VN')}
          </Text>
          {item.endDate && (
            <Text style={styles.textTime}>
              Kết thúc vào {new Date(item.endDate).toLocaleDateString('vi-VN')}
            </Text>
          )}
          <Text style={styles.textTitle}>{item.name}</Text>
          <Text style={styles.textTime}>Địa điểm: {item.locationName}</Text>
          <Text style={styles.textLocation}>
            {item.members.length} thành viên
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={[
              styles.btnJoin,
              {
                backgroundColor:
                  item.joined === 'JOINED'
                    ? Colors.greenLight
                    : Colors.background,
                zIndex: 2,
              },
            ]}
            disabled={item.joined === 'JOINED' || item.joined === 'REQUESTED'}
            onPress={handleAttend}>
            <Image
              source={
                item.joined === 'JOINED'
                  ? require('../../assets/images/star-green.png')
                  : require('../../assets/images/star-black.png')
              }
              style={{width: 20, height: 20}}
            />
            <Text
              style={[
                styles.textBtn,
                {
                  color:
                    item.joined === 'JOINED'
                      ? Colors.greenPrimary
                      : Colors.black,
                },
              ]}>
              {item.joined === 'JOINED'
                ? 'Truy cập nhóm'
                : item.joined === 'REQUESTED'
                ? 'Đang chờ'
                : 'Tham gia'}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../assets/images/share.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrganizationPost2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: screenWidth * 0.9,
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  btnFloat: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 100,
  },
  img: {
    width: '100%',
    height: 200,
  },
  itemContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  textTime: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: getFontFamily('regular'),
  },
  textTitle: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
    marginTop: 5,
  },
  textLocation: {
    fontSize: 14,
    color: Colors.grayPrimary,
    fontFamily: getFontFamily('regular'),
    marginTop: 5,
  },
  textBtn: {
    fontSize: 16,
    fontFamily: getFontFamily('bold'),
    marginLeft: 5,
  },
  btnJoin: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
});
