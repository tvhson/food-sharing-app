import {Bubble, GiftedChat, IMessage, Send} from 'react-native-gifted-chat';
import {
  IChatBotMessage,
  getHistoryChat,
  sendMessage,
} from '../../api/ChatBotApi';
import {Image, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import Colors from '../../global/Color';
import Header from '../../components/ui/Header';
import Markdown from '@ronradtke/react-native-markdown-display';
import {RootState} from '../../redux/Store';
import {Text} from 'react-native';
import dayjs from 'dayjs';
import dayvi from 'dayjs/locale/vi';
import {getFontFamily} from '../../utils/fonts';
import {useLoading} from '../../utils/LoadingContext';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

dayjs.locale('vi');

const SupportScreen = () => {
  const navigation = useNavigation();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const {showLoading, hideLoading} = useLoading();
  const insets = useSafeAreaInsets();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    getHistoryChat(accessToken, userInfo.id).then(response => {
      setMessages(
        response.map((message, index) => convertMessage(message, index)),
      );
    });
  }, []);

  const convertMessage = (
    message: IChatBotMessage,
    index: number,
  ): IMessage => {
    return {
      _id: index,
      text: message.content,
      createdAt: new Date(message.createdDate),
      user: {
        _id: message.role === 'assistant' ? 1 : 2,
        name: message.role === 'assistant' ? 'Bot' : userInfo.name,
        avatar:
          message.role === 'assistant'
            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHavAqEKhY8MRX7NntKRnkGqFTk42uJT_TuA&s'
            : userInfo.imageUrl,
      },
    };
  };

  const onSend = useCallback(
    async (newMessage: IMessage[]) => {
      const message = newMessage[0];
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, newMessage),
      );
      const response = await sendMessage(
        message.text,
        accessToken,
        userInfo.id,
      );
      console.log('newMessage', newMessage);

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [
          convertMessage(response, previousMessages.length),
        ]),
      );
    },
    [accessToken, userInfo.id, messages],
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <Header title="Hỗ trợ" navigation={navigation} />
      <GiftedChat
        messages={messages}
        user={{
          _id: 2,
          name: userInfo.name,
          avatar: userInfo.imageUrl
            ? userInfo.imageUrl
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHavAqEKhY8MRX7NntKRnkGqFTk42uJT_TuA&s',
        }}
        renderSend={props => {
          return (
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Send {...props}>
                <View style={{marginRight: 10, marginBottom: 10}}>
                  <Image
                    source={require('../../assets/images/send-message.png')}
                    style={{width: 30, height: 30}}
                  />
                </View>
              </Send>
            </View>
          );
        }}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: Colors.white,
              },
              right: {
                backgroundColor: Colors.bluePrimary,
              },
            }}
            textStyle={{
              left: {
                color: Colors.black,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
              },
              right: {
                color: Colors.white,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
              },
            }}
            renderMessageText={props2 => {
              if (typeof props2?.currentMessage?.text === 'string') {
                return (
                  <Markdown
                    style={{
                      body: {
                        color: props2.position === 'left' ? 'black' : 'white',
                        fontSize: 16,
                        fontFamily: getFontFamily('regular'),
                        paddingHorizontal: 10,
                      },
                    }}>
                    {props2.currentMessage.text}
                  </Markdown>
                );
              }
              return null;
            }}
          />
        )}
        renderSystemMessage={() => {
          return (
            <View>
              <Text>Không có tin nhắn</Text>
            </View>
          );
        }}
        textInputProps={styles.composer}
        placeholder="Nhập tin nhắn..."
        bottomOffset={insets.bottom}
        alwaysShowSend
        keyboardShouldPersistTaps={'handled'}
        locale={dayvi}
        onSend={onSend}
      />
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  composer: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    alignSelf: 'center',
    fontFamily: getFontFamily('regular'),
    fontSize: 16,
  },
});
