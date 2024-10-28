/* eslint-disable react-native/no-inline-styles */
import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import Modal from 'react-native-modal';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import CommentItem from './CommentItem';

const CommentData = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 1',
    time: '1 giờ trước',
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Nguyễn Văn B',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 2',
    time: '2 giờ trước',
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 4,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 5,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 6,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 7,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 8,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 9,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 10,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 11,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 12,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 13,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 14,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 15,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 16,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 17,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 18,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 19,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 20,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 21,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 22,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 23,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 24,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
  {
    id: 25,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
];

const Comment = (props: any) => {
  const {isVisible, setVisible} = props;
  const handleCreateComment = () => {};

  return (
    <Modal
      style={styles.modal}
      hideModalContentWhileAnimating={true}
      avoidKeyboard={true}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      isVisible={isVisible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.4}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      swipeDirection={['down', 'left', 'right']}
      onSwipeComplete={() => setVisible(false)}
      propagateSwipe={true}>
      <View style={styles.modalContent}>
        <View style={styles.barIcon} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Bình luận</Text>
        </View>
        <FlatList
          data={CommentData}
          renderItem={({item}) => <CommentItem comment={item} />}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={<View style={{height: 70}} />}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: Colors.gray,
            backgroundColor: Colors.white,
          }}>
          <TextInput
            multiline
            placeholder="Viết bình luận"
            style={{
              backgroundColor: Colors.background,
              borderRadius: 20,
              padding: 10,
              flex: 1,
            }}
          />
          <TouchableOpacity onPress={handleCreateComment}>
            <Image
              source={require('../../assets/images/send.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Comment;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 5,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
    alignSelf: 'center',
  },
  panelTitle: {
    marginTop: 10,
    fontSize: 20,
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
  },
});
