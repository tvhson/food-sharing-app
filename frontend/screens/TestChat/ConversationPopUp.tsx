import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

export default function ConversationPopUp(props: any) {
  const {
    visible,
    onModalMaskPress,
    onNewPeerChatPress,
    onNewGroupChatPress,
    onJoinGroupChatPress,
  } = props;

  return (
    <Modal transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onModalMaskPress}>
        <View style={style.modalMask} />
      </TouchableWithoutFeedback>
      <View style={style.modalView}>
        <TouchableOpacity onPress={onNewPeerChatPress}>
          <View style={[style.modalItem, style.borderBottom]}>
            <Text style={style.text}>One-on-one Chat</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNewGroupChatPress}>
          <View style={[style.modalItem, style.borderBottom]}>
            <Text style={style.text}>Group Chat</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onJoinGroupChatPress}>
          <View style={style.modalItem}>
            <Text style={style.text}>Join a group</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
const style = StyleSheet.create({
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
  },
  modalItem: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  text: {
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
});
