import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {getFontFamily} from '../../utils/fonts';
import Colors from '../../global/Color';

const CommentItem = (props: any) => {
  const {comment} = props;
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const handleLikeComment = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image source={comment.user.avatar} style={styles.avatar} />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.textName}>{comment.user.name}</Text>
          <Text style={styles.textTime}>{comment.time}</Text>
        </View>

        <Text>{comment.content}</Text>
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
        <Text style={styles.textLike}>{likeCount > 0 ? likeCount : null}</Text>
      </View>
    </View>
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
});
