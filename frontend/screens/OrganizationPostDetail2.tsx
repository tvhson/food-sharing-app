/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';

import {Linking} from 'react-native';

const OrganizationPostDetail2 = (props: any) => {
  const {navigation} = props;
  const item = props.route.params.item;
  const [isJoin, setIsJoin] = React.useState(item.organizationposts.attended);

  const handleAttend = () => {
    setIsJoin(!isJoin);
  };
  const handleBack = () => {
    navigation.goBack();
  };
  const handleGoToWebsite = () => {
    navigation.navigate('WebView', {url: item.organizationposts.linkWebsites});
  };
  const handlePressLocation = () => {
    //open google map
    Linking.openURL(
      'https://www.google.com/maps/dir/?api=1&destination=84+Cách+Mạng+Tháng+8+Đà+Nẵng+Việt+Nam',
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.floatBtn} onPress={handleBack}>
        <Icon source={'arrow-left'} size={25} color={Colors.text} />
      </TouchableOpacity>
      <View>
        <Image
          source={{
            uri: item.organizationposts.imageUrl,
          }}
          style={styles.topImg}
        />
        <View style={{backgroundColor: '#00000004', paddingBottom: 10}}>
          <Text style={styles.textTitle}>{item.organizationposts.title}</Text>
          <Text style={styles.textLink} onPress={handleGoToWebsite}>
            {item.organizationposts.linkWebsites}
          </Text>

          <TouchableOpacity
            style={[
              styles.btnJoin,
              {
                backgroundColor: isJoin
                  ? Colors.greenLight2
                  : Colors.greenPrimary,
              },
            ]}
            onPress={handleAttend}>
            <Image
              source={
                isJoin
                  ? require('../assets/images/star-green.png')
                  : require('../assets/images/star-white.png')
              }
              style={{width: 20, height: 20}}
            />
            <Text
              style={[
                styles.textBtn,
                {
                  color: isJoin ? Colors.greenText : Colors.white,
                },
              ]}>
              Tham gia
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingBottom: 10,
            marginHorizontal: 20,
            borderBottomColor: '#ccc',
            borderBottomWidth: 0.8,
          }}>
          <TouchableWithoutFeedback onPress={handlePressLocation}>
            <View style={styles.row}>
              <Image
                source={require('../assets/images/location.png')}
                style={styles.iconText}
              />
              <View style={{flex: 1}}>
                <Text style={styles.textNormal}>
                  Địa điểm: {item.organizationposts.locationName}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.row}>
            <Image
              source={require('../assets/images/care.png')}
              style={styles.iconText}
            />
            <View style={{flex: 1}}>
              <Text style={styles.textNormal}>
                {item.organizationposts.peopleAttended} người tham gia
              </Text>
            </View>
          </View>
        </View>
        <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
          <Text style={styles.textTitle2}>Chi tiết chiến dịch</Text>
          <View style={{flex: 1}}>
            <Text style={styles.textNormal}>
              {item.organizationposts.description}
            </Text>
          </View>
        </View>
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
    color: '#3498db',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  btnJoin: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    borderRadius: 10,
    alignSelf: 'center',
  },
  textBtn: {
    fontSize: 16,
    fontFamily: getFontFamily('bold'),
    marginLeft: 5,
  },
  textNormal: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  iconText: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  textTitle2: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
    color: Colors.text,
  },
});
