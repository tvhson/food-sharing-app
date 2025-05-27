import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import Colors from '../../../global/Color';
import {IGetGroupResponse} from '../../../api/GroupApi';
import ReactNativeModal from 'react-native-modal';
import {Searchbar} from 'react-native-paper';
import {scale} from '../../../utils/scale';

const GroupModalMember = ({
  isVisible,
  onClose,
  members,
  setSelectedMember,
  selectedMember,
}: {
  isVisible: boolean;
  onClose: () => void;
  members: IGetGroupResponse['members'];
  setSelectedMember: (member: IGetGroupResponse['members'][number]) => void;
  selectedMember: IGetGroupResponse['members'][number] | undefined;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={() => {
        onClose();
        setSearchQuery('');
      }}
      style={styles.modal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      propagateSwipe>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Searchbar
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={{height: scale(10)}} />
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <TouchableOpacity
              key={member.id}
              onPress={() => setSelectedMember(member)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: scale(10),
                padding: scale(10),
                borderRadius: scale(10),
                backgroundColor: '#f0f0f0',
                marginBottom: scale(10),
                borderWidth: 1,
                borderColor:
                  selectedMember?.id === member.id
                    ? Colors.greenPrimary
                    : 'transparent',
              }}>
              <Image
                source={{uri: member.imageUrl}}
                style={{
                  width: scale(40),
                  height: scale(40),
                  borderRadius: scale(20),
                }}
              />
              <Text>{member.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Không tìm thấy thành viên</Text>
        )}
      </ScrollView>
    </ReactNativeModal>
  );
};

export default GroupModalMember;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: scale(20),
    padding: scale(20),
    maxHeight: scale(500),
  },
});
