import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Colors from '../global/Color';
import {Avatar, Icon, SegmentedButtons} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import {moderateScale, scale} from '../utils/scale';
import {getFontFamily} from '../utils/fonts';
import AddPeopleModal from '../components/ui/AddPeopleModal';
import {UserInfo} from '../redux/UserReducer';
import {
  acceptInvite,
  IGetGroupResponse,
  inviteUser,
  kickUser,
  rejectInvite,
} from '../api/GroupApi';
import {RootState} from '../redux/Store';
import {useSelector} from 'react-redux';
import {notify} from 'react-native-notificated';

const ListGroupScreen = () => {
  const route: any = useRoute();
  const {group}: {group: IGetGroupResponse} = route.params;
  const token = useSelector((state: RootState) => state.token.key);
  const [valueOfSegmentButton, setValueOfSegmentButton] = useState('Member');
  const [isAddPeopleModalVisible, setIsAddPeopleModalVisible] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Partial<UserInfo>[]>([]);

  const handleAddMember = async (people: Partial<UserInfo>[]) => {
    for (const person of people) {
      try {
        await inviteUser(token, group.id, person.id || 0);
      } catch (error) {
        console.log('error', error);
      }
    }
    setIsAddPeopleModalVisible(false);
    setSelectedPeople([]);
    notify('success', {
      params: {
        title: 'Thành công',
        description: 'Thêm thành viên thành công',
        style: {
          multiline: 100,
        },
      },
    });
  };

  const handleAcceptRequest = async (requestId: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn chấp nhận yêu cầu này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Chấp nhận',
        onPress: async () => {
          try {
            await acceptInvite(token, group.id, requestId);
            notify('success', {
              params: {
                title: 'Thành công',
                description: 'Chấp nhận yêu cầu thành công',
                style: {
                  multiline: 100,
                },
              },
            });
          } catch (error) {
            console.log('error', error);
            notify('error', {
              params: {
                title: 'Lỗi',
                description: 'Chấp nhận yêu cầu thất bại',
                style: {
                  multiline: 100,
                },
              },
            });
          }
        },
      },
    ]);
  };

  const handleDenyRequest = async (requestId: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn từ chối yêu cầu này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Từ chối',
        onPress: async () => {
          try {
            await rejectInvite(token, group.id, requestId);
            notify('success', {
              params: {
                title: 'Thành công',
                description: 'Từ chối yêu cầu thành công',
                style: {
                  multiline: 100,
                },
              },
            });
          } catch (error) {
            console.log('error', error);
            notify('error', {
              params: {
                title: 'Lỗi',
                description: 'Từ chối yêu cầu thất bại',
                style: {
                  multiline: 100,
                },
              },
            });
          }
        },
      },
    ]);
  };

  const handleDeleteMember = async (memberId: number) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await kickUser(token, group.id, memberId);
              notify('success', {
                params: {
                  title: 'Thành công',
                  description: 'Xóa thành viên thành công',
                  style: {
                    multiline: 100,
                  },
                },
              });
            } catch (error) {
              console.log('error', error);
              notify('error', {
                params: {
                  title: 'Lỗi',
                  description: 'Xóa thành viên thất bại',
                  style: {
                    multiline: 100,
                  },
                },
              });
            }
          },
        },
      ],
    );
  };

  const renderMember = () => {
    return (
      <>
        {group.members.map((member, index) => (
          <View
            key={member.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: scale(10),
            }}>
            <Avatar.Image
              size={60}
              source={{uri: member.imageUrl}}
              style={{marginRight: 10}}
            />
            <View style={{flex: 1}}>
              <Text style={styles.textTitle2}>{member.name}</Text>
              {index === 0 && (
                <Text style={styles.textNormal}>Trưởng nhóm</Text>
              )}
            </View>

            {index !== 0 && (
              <TouchableOpacity
                onPress={() => handleDeleteMember(member.id || 0)}>
                <Icon source="delete" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </>
    );
  };

  const renderRequest = () => {
    return (
      <>
        {group.requests.map(request => (
          <View
            key={request.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: scale(10),
            }}>
            <Avatar.Image
              size={60}
              source={{uri: request.imageUrl}}
              style={{marginRight: 10}}
            />
            <View style={{flex: 1}}>
              <Text style={styles.textTitle2}>{request.name}</Text>
            </View>

            <TouchableOpacity
              style={{marginRight: scale(10)}}
              onPress={() => handleAcceptRequest(request.id || 0)}>
              <Icon source="check" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDenyRequest(request.id || 0)}>
              <Icon source="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  };
  const renderAddMember = () => {
    return (
      <View style={{flexDirection: 'row', marginVertical: scale(20)}}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => setIsAddPeopleModalVisible(true)}>
          <Icon source="account-plus" size={24} color="black" />
          <Text
            style={{
              fontFamily: getFontFamily('bold'),
              fontSize: moderateScale(16),
              color: Colors.black,
              marginHorizontal: scale(10),
            }}>
            Thêm thành viên
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={{flex: 1, paddingHorizontal: scale(20)}}>
      <AddPeopleModal
        isVisible={isAddPeopleModalVisible}
        onClose={() => setIsAddPeopleModalVisible(false)}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
        isAddMember={true}
        groupMembers={group.members}
        onAddMember={(people: Partial<UserInfo>[]) => {
          handleAddMember(people);
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: scale(20),
        }}>
        <TouchableOpacity
          onPress={() => setValueOfSegmentButton('Member')}
          style={{
            padding: scale(10),
            flex: 1,
            borderTopLeftRadius: scale(100),
            borderBottomLeftRadius: scale(100),
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              valueOfSegmentButton === 'Member' ? Colors.button : 'transparent',
          }}>
          <Text
            style={{
              color: valueOfSegmentButton === 'Member' ? 'white' : Colors.black,
              fontFamily: getFontFamily('bold'),
              fontSize: moderateScale(16),
            }}>
            Thành viên
          </Text>
        </TouchableOpacity>
        <View style={{width: 1, height: '100%', backgroundColor: 'black'}} />
        <TouchableOpacity
          onPress={() => setValueOfSegmentButton('Request')}
          style={{
            padding: scale(10),
            flex: 1,
            borderTopRightRadius: scale(100),
            borderBottomRightRadius: scale(100),
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              valueOfSegmentButton === 'Request'
                ? Colors.button
                : 'transparent',
          }}>
          <Text
            style={{
              color:
                valueOfSegmentButton === 'Request' ? 'white' : Colors.black,
              fontFamily: getFontFamily('bold'),
              fontSize: moderateScale(16),
            }}>
            Yêu cầu
          </Text>
        </TouchableOpacity>
      </View>
      {renderAddMember()}
      {valueOfSegmentButton === 'Member' && renderMember()}
      {valueOfSegmentButton === 'Request' && renderRequest()}
    </ScrollView>
  );
};

export default ListGroupScreen;

const styles = StyleSheet.create({
  textTitle2: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
    color: Colors.text,
  },
  textNormal: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
  },
});
