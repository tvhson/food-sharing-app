/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';

const WebViewScreen = (props: any) => {
  const uri = props.route.params.url;
  return <WebView source={{uri: uri}} style={{flex: 1}} />;
};

export default WebViewScreen;

const styles = StyleSheet.create({});
