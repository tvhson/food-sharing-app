/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {attendOrganizationPost} from '../../api/OrganizationPostApi';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';

const screenWidth = Dimensions.get('window').width;
const OrganizationPost2 = (props: any) => {
  const token = useSelector((state: RootState) => state.token.key);
  const {navigation, item} = props;
  const [isJoin, setIsJoin] = React.useState(item.organizationposts.attended);

  const handleAttend = async () => {
    setIsJoin(!isJoin);
    const response: any = await attendOrganizationPost(
      item.organizationposts.id,
      token,
    );
    if (response.status !== 200) {
      setIsJoin(!isJoin);
    }
  };
  const handleNavigateToDetail = () => {
    navigation.navigate('OrganizationPostDetail2', {item});
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToDetail}
      style={styles.container}
      activeOpacity={0.8}>
      <TouchableOpacity style={styles.btnFloat}>
        <Icon source={'dots-horizontal'} size={30} color={Colors.grayPrimary} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btnFloat, {right: 10}]}>
        <Icon source={'close'} size={25} color={Colors.grayPrimary} />
      </TouchableOpacity>
      <View>
        <Image
          source={{
            uri: item.organizationposts.imageUrl,
          }}
          style={styles.img}
        />
        <View style={styles.itemContainer}>
          <Text style={styles.textTime}>Hôm nay lúc 15:00</Text>
          <Text style={styles.textTitle}>{item.organizationposts.title}</Text>
          <Text style={styles.textTime}>
            Địa điểm: {item.organizationposts.locationName}
          </Text>
          <Text style={styles.textLocation}>
            {item.organizationposts.peopleAttended} người sẽ tham gia
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={[
              styles.btnJoin,
              {
                backgroundColor: isJoin ? Colors.greenLight : Colors.background,
              },
            ]}
            onPress={handleAttend}>
            <Image
              source={
                isJoin
                  ? require('../../assets/images/star-green.png')
                  : require('../../assets/images/star-black.png')
              }
              style={{width: 20, height: 20}}
            />
            <Text
              style={[
                styles.textBtn,
                {
                  color: isJoin ? Colors.greenPrimary : Colors.black,
                },
              ]}>
              Tham gia
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrganizationPost2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: screenWidth * 0.9,
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  btnFloat: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignSelf: 'center',
    position: 'absolute',
    right: 60,
    top: 10,
    zIndex: 100,
  },
  img: {
    width: '100%',
    height: 200,
  },
  itemContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  textTime: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: getFontFamily('regular'),
  },
  textTitle: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
    marginTop: 5,
  },
  textLocation: {
    fontSize: 14,
    color: Colors.grayPrimary,
    fontFamily: getFontFamily('regular'),
    marginTop: 5,
  },
  textBtn: {
    fontSize: 16,
    fontFamily: getFontFamily('bold'),
    marginLeft: 5,
  },
  btnJoin: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    borderRadius: 10,
  },
});
