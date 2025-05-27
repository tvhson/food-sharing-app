import {Image, StyleSheet, Text, View} from 'react-native';

import Colors from '../../../global/Color';
import {IGetGroupStatementResponse} from '../../../api/GroupApi';
import React from 'react';
import {getFontFamily} from '../../../utils/fonts';
import {scale} from '../../../utils/scale';
import {timeAgo} from '../../../utils/helper';

const GroupStatementItem = ({
  statement,
}: {
  statement: IGetGroupStatementResponse;
}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: statement.user.imageUrl}} style={styles.image} />
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <Text style={styles.title}>{statement.user.name}</Text>
          <Text style={styles.time}>
            {timeAgo(statement.createdAt || new Date())}
          </Text>
        </View>
        <Text style={styles.description}>
          Đã quyên góp {statement.description}
        </Text>
      </View>
    </View>
  );
};

export default GroupStatementItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: scale(10),
    padding: scale(10),
    marginBottom: scale(10),
    flexDirection: 'row',
  },
  time: {
    fontSize: scale(12),
    fontFamily: getFontFamily('light'),
    color: Colors.grayPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  image: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },
  title: {
    fontSize: scale(16),
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
  },
  description: {
    fontSize: scale(14),
    fontFamily: getFontFamily('regular'),
  },
});
