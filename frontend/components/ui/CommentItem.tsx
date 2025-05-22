import {IComment, likeComment} from '../../api/PostApi';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';

import Colors from '../../global/Color';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {timeAgo} from '../../utils/helper';
import {useSelector} from 'react-redux';

interface ICommentItemProps {
  comment: IComment;
}

const CommentItem = (props: ICommentItemProps) => {
  const {comment} = props;
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [isLiked, setIsLiked] = useState(comment.isLove || false);
  const [likeCount, setLikeCount] = useState(comment.loveCount || 0);
  const handleLikeComment = async () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    const response: any = await likeComment(comment.id, accessToken);
    if (response.status !== 200) {
      setIsLiked(isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  };
  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <TouchableOpacity>
          <Image
            source={{
              uri:
                comment.avatar ||
                'https://randomuser.me/api/portraits/men/36.jpg',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <Text style={styles.textName}>{comment.userName}</Text>
            <Text style={styles.textTime}>{timeAgo(comment.createdDate)}</Text>
          </View>

          {comment.content && <Text>{comment.content}</Text>}
          {comment.imageUrl && (
            <Image source={{uri: comment.imageUrl}} style={styles.image} />
          )}
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleLikeComment}>
            <Image
              source={
                isLiked
                  ? require('../../assets/images/heart-fill.png')
                  : require('../../assets/images/heart.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.textLike}>
            {likeCount > 0 ? likeCount : null}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentContainer: {
    paddingLeft: 15,
    flex: 1,
    paddingRight: 30,
  },
  iconContainer: {
    alignItems: 'center',
  },
  textName: {
    fontSize: 14,
    fontFamily: getFontFamily('semibold'),
    color: Colors.black,
  },
  textContent: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
  },
  textTime: {
    fontSize: 14,
    fontFamily: getFontFamily('thin'),
    color: Colors.black,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    height: 20,
  },
  textLike: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: Colors.darkGray,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
