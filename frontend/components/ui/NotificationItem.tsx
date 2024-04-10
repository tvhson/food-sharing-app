/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View,  StyleSheet, Image} from 'react-native';

const NotificationItem = ({}: any) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
        }}
        style={{width: 30, height: 30, marginRight: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
});

export default NotificationItem;
