/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import CommentItem from './CommentItem';
import {RootState} from '../../redux/Store';
import {useSelector} from 'react-redux';
import {createCommentToPost, getCommentByPostId} from '../../api/PostApi';
import {useNotifications} from 'react-native-notificated';

const Comment = (props: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);
  const {commentPostId} = props;
  const {isVisible, setVisible} = props;
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const {notify} = useNotifications();

  useEffect(() => {
    const getCommentList = async () => {
      // get comment list
      if (accessToken) {
        if (commentPostId === 0) return;
        // get comment list
        getCommentByPostId(commentPostId, accessToken).then((response: any) => {
          if (response.status === 200) {
            setCommentList(response.data);
          }
        });
      }
    };
    getCommentList();
  }, [accessToken, commentPostId, notify, isVisible]);

  const handleCreateComment = async () => {
    const response: any = await createCommentToPost(
      commentPostId,
      {content: comment},
      accessToken,
    );
    if (response.status === 200) {
      setComment('');
      getCommentByPostId(commentPostId, accessToken).then((response2: any) => {
        if (response2.status === 200) {
          setCommentList(response2.data);
          console.log('commentList', commentList);
        }
      });
    } else {
      notify('error', {
        params: {description: 'Không thể tạo comment', title: 'Lỗi'},
      });
    }
  };

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
          data={commentList}
          renderItem={({item}) => <CommentItem comment={item} />}
          keyExtractor={(item: any) => item.id.toString()}
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
            value={comment}
            onChangeText={setComment}
            style={{
              backgroundColor: Colors.background,
              borderRadius: 20,
              padding: 10,
              flex: 1,
            }}
          />
          <TouchableOpacity onPress={handleCreateComment} disabled={!comment}>
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
