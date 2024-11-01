// LoadingScreen.js
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Colors from '../global/Color';

const LoadingUI = ({visible}: any) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.gray} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default LoadingUI;
