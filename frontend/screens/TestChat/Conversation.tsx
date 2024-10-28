/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ConversationList} from '@zegocloud/zimkit-rn';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';
import {Image} from 'react-native';
import ConversationPopUp from './ConversationPopUp';
import PeerChatDialog from '../../components/ui/ChatUI/PeerChatDialog';
import GroupChatDialog from '../../components/ui/ChatUI/GroupChatDialog';
import JoinGroupChatDialog from '../../components/ui/ChatUI/JoinGroupChatDialog';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Conversation = ({navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [menuVisible, setMenuVisible] = useState(false);
  const [peerDialogVisible, setPeerDialogVisible] = useState(false);
  const [groupDialogVisible, setGroupDialogVisible] = useState(false);
  const [joinGroupDialogVisible, setJoinGroupDialogVisible] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const openMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const onModalMaskPress = () => {
    setMenuVisible(!menuVisible);
  };
  const onNewPeerChatPress = () => {
    setMenuVisible(!menuVisible);
    setPeerDialogVisible(true);
  };
  const onNewGroupChatPress = () => {
    setMenuVisible(!menuVisible);
    setGroupDialogVisible(true);
  };
  const onJoinGroupChatPress = () => {
    setMenuVisible(!menuVisible);
    setJoinGroupDialogVisible(true);
  };
  const onPeerDialogVisibleChanged = (
    visible: boolean | ((prevState: boolean) => boolean),
  ) => {
    setPeerDialogVisible(visible);
  };
  const onGroupDialogVisibleChanged = (
    visible: boolean | ((prevState: boolean) => boolean),
  ) => {
    setGroupDialogVisible(visible);
  };
  const onJoinGroupDialogVisibleChanged = (
    visible: boolean | ((prevState: boolean) => boolean),
  ) => {
    setJoinGroupDialogVisible(visible);
  };
  const lastMessageTimeBuilder = () => {
    return <Text>lastMessageTimeBuilder</Text>;
  };
  const lastMessageBuilder = () => {
    return <Text>lastMessageBuilder</Text>;
  };

  const onPressed = (props: any) => {
    const itemBuilder = () => {
      return (
        <View>
          <Text>item Builder</Text>
        </View>
      );
    };
    const loadingBuilder = () => {
      return (
        <View>
          <Text>loading Builder</Text>
        </View>
      );
    };
    const errorBuilder = () => {
      return (
        <View>
          <Text>error Builder</Text>
        </View>
      );
    };
    const preMessageSending = (message: any) => {
      return message;
    };
    console.log('#######props', props);
    navigation.navigate('MessageListPage', {
      ...props,
      preMessageSending,
      appBarActions:
        props.conversationType === 0
          ? [
              {
                icon: 'goBack',
                onPressed: () => {
                  navigation.navigate('Conversation');
                },
              },
              () => (
                <ZegoSendCallInvitationButton
                  invitees={[
                    {
                      userID: props.conversationID,
                      userName: props.conversationName,
                    },
                  ]}
                  resourceID={'happyfood_call'}
                />
              ),
              // Video call button
              () => (
                <ZegoSendCallInvitationButton
                  isVideoCall={true}
                  invitees={[
                    {
                      userID: props.conversationID,
                      userName: props.conversationName,
                    },
                  ]}
                  resourceID={'happyfood_call'}
                />
              ),
            ]
          : [
              {
                icon: 'goBack',
                onPressed: () => {
                  navigation.navigate('Conversation');
                },
              },
            ],
    });
  };
  const onLongPress = () => {
    console.log('onLongPress');
  };
  const errorBuilder = () => {
    return (
      <View style={styles.errorView}>
        <Text>error view</Text>
      </View>
    );
  };
  const emptyBuilder = () => {
    return (
      <View style={styles.emptyView}>
        <Text>No chats.</Text>
        <Text>Start chatting now.</Text>
      </View>
    );
  };
  const loadingBuilder = () => {
    return (
      <View style={styles.emptyView}>
        <ActivityIndicator />
      </View>
    );
  };
  const itemBuilder = () => {
    return (
      <View style={styles.conversationItem}>
        <Text>custom conversation item</Text>
      </View>
    );
  };

  const filterConversation = () => {
    setIsFilter(!isFilter);
    setFilterValue('');
  };

  const filter = (conversationList: any[]) => {
    let filteredList = [];
    if (filterValue) {
      filteredList = conversationList.filter(
        (item: {conversationName: string | string[]}) =>
          item.conversationName.includes(filterValue),
      );
    } else {
      filteredList = conversationList;
    }
    return filteredList;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.title}>In-app Chat({`${userInfo.id}`})</Text>
        <View style={styles.utils}>
          <TouchableWithoutFeedback onPress={filterConversation}>
            <Image
              style={[styles.icon, {marginRight: 8}]}
              source={require('../../assets/images/icon-more.png')}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={openMenu}>
            <Image
              style={styles.icon}
              source={require('../../assets/images/icon-create.png')}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      {isFilter ? (
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setFilterValue(text);
            }}
            value={filterValue}
            placeholder="Search"
            // onFocus={onFocus}
            // onBlur={onBlur}
          />
        </View>
      ) : null}
      <ConversationPopUp
        visible={menuVisible}
        onModalMaskPress={onModalMaskPress}
        onNewPeerChatPress={onNewPeerChatPress}
        onNewGroupChatPress={onNewGroupChatPress}
        onJoinGroupChatPress={onJoinGroupChatPress}
      />
      <PeerChatDialog
        dialogVisible={peerDialogVisible}
        onDialogVisibleChanged={onPeerDialogVisibleChanged}
      />
      <GroupChatDialog
        dialogVisible={groupDialogVisible}
        onDialogVisibleChanged={onGroupDialogVisibleChanged}
      />
      <JoinGroupChatDialog
        dialogVisible={joinGroupDialogVisible}
        onDialogVisibleChanged={onJoinGroupDialogVisibleChanged}
      />
      <View style={styles.conversation}>
        <ConversationList
          filter={filter}
          // lastMessageBuilder={lastMessageBuilder}
          // lastMessageTimeBuilder={lastMessageTimeBuilder}
          onPressed={onPressed}
          onLongPress={onLongPress}
          errorBuilder={errorBuilder}
          emptyBuilder={emptyBuilder}
          loadingBuilder={loadingBuilder}
          //itemBuilder={itemBuilder}
        />
      </View>
    </SafeAreaView>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  title: {
    marginLeft: 18,
    fontSize: 18,
    fontWeight: 'bold',
  },
  utils: {
    flexDirection: 'row',
  },
  icon: {
    width: 36,
    height: 36,
  },
  inputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  input: {
    paddingHorizontal: 20,
    width: '90%',
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  conversation: {
    flex: 1,
    width: '100%',
  },
  errorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  conversationItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
    height: 68,
    backgroundColor: '#fff',
  },
});
