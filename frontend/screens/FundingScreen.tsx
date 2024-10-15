/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getOrganizationPost} from '../api/OrganizationPostApi';
import {
  addToTheEndOfFundingPost,
  clearFundingPosts,
  pushFundingPost,
  setHomePageFundingPost,
} from '../redux/OrganizationPostReducer';
import {OrganizationPost} from '../components/ui/OrganizationPost';
import Colors from '../global/Color';
import {Button} from 'react-native-paper';
import PostRenderItem2 from '../components/ui/PostRenderItem2';
import Comment from '../components/ui/Comment';

export const FundingScreen = ({navigation}: any) => {
  const FundingPostData = useSelector(
    (state: RootState) => state.fundingPost.HomePage,
  );
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const token = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const [commentPostId, setCommentPostId] = useState('');

  return (
    <View style={styles.container}>
      <View>
        <PostRenderItem2
          setShowComment={setShowComment}
          setCommentPostId={setCommentPostId}
        />
      </View>
      <Comment
        isVisible={showComment}
        setVisible={setShowComment}
        commentPostId={commentPostId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
