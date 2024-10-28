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
import {getFontFamily} from '../../utils/fonts';

const Conversation = ({navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [isFilter, setIsFilter] = useState(false);
  const [filterValue, setFilterValue] = useState('');

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
        <Text style={styles.title}>Tin nhắn</Text>
        <View style={styles.utils}>
          <TouchableWithoutFeedback onPress={filterConversation}>
            <Image
              style={[styles.icon, {marginRight: 8}]}
              source={require('../../assets/images/search.png')}
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
            placeholder="Tìm kiếm"
            // onFocus={onFocus}
            // onBlur={onBlur}
          />
        </View>
      ) : null}
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
  },
  title: {
    marginLeft: 18,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: getFontFamily('regular'),
    color: 'black',
  },
  utils: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
  },
  inputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  input: {
    paddingHorizontal: 20,
    width: '90%',
    height: 45,
    borderRadius: 20,
    backgroundColor: '#f3f2f2ff',
    fontFamily: getFontFamily('regular'),
    fontSize: 16,
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
