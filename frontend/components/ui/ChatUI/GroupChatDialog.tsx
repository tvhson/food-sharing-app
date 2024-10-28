/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ZIMKit} from '@zegocloud/zimkit-rn';
import React from 'react';
import {Platform} from 'react-native';

function GroupChatDialog(props: any) {
  const {dialogVisible, onDialogVisibleChanged} = props;
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [userIDs, setUserIDs] = useState('');
  useEffect(() => {
    setGroupName('');
    setUserIDs('');
  }, [dialogVisible]);

  const onConfirmPress = () => {
    if (groupName) {
      onDialogVisibleChanged(false);
      const userIDsArr = userIDs.split(';');
      // const optional = { groupID: ''};
      ZIMKit.createGroup(groupName, userIDsArr).then((data: any) => {
        if (!data.code) {
          const {groupInfo, errorUserList} = data;
          const {baseInfo} = groupInfo;
          // if (errorUserList.length) {
          // } else {
          navigation.navigate('MessageListPage', {
            conversationID: baseInfo.groupID,
            conversationName: baseInfo.groupName,
            conversationType: 2,
            appBarActions: [
              {
                icon: 'goBack',
                onPressed: () => {
                  navigation.goBack();
                },
              },
            ],
          });
          // }
        }
      });
    }
  };

  const onCancelPress = () => {
    onDialogVisibleChanged(false);
  };

  return (
    <Modal transparent={true} visible={dialogVisible}>
      <View style={style.modalMask}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={style.modalView}>
            <Text style={style.title}>New Group Chat</Text>
            <TextInput
              style={style.input}
              placeholder="Group Name"
              value={groupName}
              onChangeText={text => setGroupName(text)}
            />
            <TextInput
              style={style.input}
              placeholder="Group member IDs, separated by ';'"
              value={userIDs}
              onChangeText={text => setUserIDs(text)}
            />
            <View style={style.btnBox}>
              <Button title="Cancel" onPress={onCancelPress} />
              <Button title="OK" onPress={onConfirmPress} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  modalMask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    marginRight: 10,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  btnBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default GroupChatDialog;
