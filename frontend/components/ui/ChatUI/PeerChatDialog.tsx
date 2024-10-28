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
import React from 'react';
import {Platform} from 'react-native';

function PeerChatDialog(props: any) {
  const {dialogVisible, onDialogVisibleChanged} = props;
  const navigation = useNavigation();
  const [userID, setUserID] = useState('');
  useEffect(() => {
    setUserID('');
  }, [dialogVisible]);

  const onConfirmPress = () => {
    if (userID) {
      onDialogVisibleChanged(false);
      navigation.navigate('MessageListPage', {
        conversationID: userID,
        conversationName: userID,
        conversationType: 0,
        appBarActions: [
          {
            icon: 'goBack',
            onPressed: () => {
              navigation.goBack();
            },
          },
        ],
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
            <Text style={style.title}>New Chat</Text>
            <TextInput
              style={style.input}
              placeholder="User ID"
              value={userID}
              onChangeText={text => setUserID(text)}
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

export default PeerChatDialog;
