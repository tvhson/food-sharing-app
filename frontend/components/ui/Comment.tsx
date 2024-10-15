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
];

const Comment = (props: any) => {
  const {isVisible, setVisible} = props;
  const handleCreateComment = () => {};

  return (
    <Modal
      style={styles.modal}
      avoidKeyboard={true}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      isVisible={isVisible}
      onSwipeComplete={() => setVisible(false)}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.4}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      swipeDirection={['down', 'left', 'right']}
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
