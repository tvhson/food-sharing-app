import React from 'react';
import {View, Text} from 'react-native';
import Colors from '../../global/Color';
import {moderateScale, scale} from '../../utils/scale';
import {getFontFamily} from '../../utils/fonts';

const AiComment = ({comment}: {comment: string}) => {
  return (
    <View
      key={comment}
      style={{
        backgroundColor: Colors.white,
        padding: scale(10),
        paddingHorizontal: scale(15),
        borderRadius: scale(100),
        borderWidth: 1,
        borderColor: Colors.gray300,
        marginRight: scale(10),
      }}>
      <Text
        style={{
          fontFamily: getFontFamily('regular'),
          fontSize: moderateScale(14),
          color: Colors.text,
        }}>
        {comment}
      </Text>
    </View>
  );
};

export default AiComment;
