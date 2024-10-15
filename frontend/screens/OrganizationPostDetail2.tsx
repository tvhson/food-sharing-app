import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';

const OrganizationPostDetail2 = (props: any) => {
  const {navigation, item} = props;
  const handleBack = () => {
    navigation.goBack();
  };
  const handleGoToWebsite = () => {
    navigation.navigate('WebView', {url: 'https://google.com'});
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.floatBtn} onPress={handleBack}>
        <Icon source={'arrow-left'} size={25} color={Colors.text} />
      </TouchableOpacity>
      <View>
        <Image
          source={{
            uri: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
          }}
          style={styles.topImg}
        />
        <Text style={styles.textTitle}>Tiêu đề ở đây</Text>
        <Text style={styles.textLink} onPress={handleGoToWebsite}>
          Link website ở đây
        </Text>
      </View>
    </ScrollView>
  );
};

export default OrganizationPostDetail2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImg: {
    width: '100%',
    height: 300,
  },
  floatBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  textLink: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
    textAlign: 'center',
  },
});
