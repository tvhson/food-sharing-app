/* eslint-disable react-native/no-inline-styles */
import LottieView from 'lottie-react-native';
import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import Colors from '../global/Color';

const LoadingScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <Text style={styles.textLoading}>HappyFood</Text>
      <LottieView
        source={require('../assets/json/loading.json')}
        autoPlay
        loop
        style={{flex: 1}}
      />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  textLoading: {
    alignSelf: 'center',
    fontSize: 36,
    marginTop: 50,
    color: Colors.postTitle,
    fontWeight: 'bold',
  },
});
