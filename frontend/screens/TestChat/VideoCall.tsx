import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {ZEGO_APP_ID, ZEGO_APP_SIGN} from '../../components/data/SecretData';

const VideoCall = (props: any) => {
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={ZEGO_APP_ID}
        appSign={ZEGO_APP_SIGN}
        userID={'1234'} // userID can be something like a phone number or the user id on your own user system.
        userName={'abc'}
        callID={'123'} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onCallEnd: (callID, reason, duration) => {
            props.navigation.navigate('Home');
          },
        }}
      />
    </View>
  );
};

export default VideoCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
