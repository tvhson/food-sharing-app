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
  const [peopleAttended, setPeopleAttended] = React.useState(
    item.organizationposts.peopleAttended,
  );

  const handleAttend = async () => {
    setIsJoin(!isJoin);
    setPeopleAttended(
      (prev: any) => (prev ? prev - 1 : prev + 1), // Adjust count dynamically
    );
    const response: any = await attendOrganizationPost(
      item.organizationposts.id,
      token,
    );
    if (response.status !== 200) {
      setIsJoin(!isJoin);
      setPeopleAttended(
        (prev: any) => (prev ? prev - 1 : prev + 1), // Adjust count dynamically
      );
    }
  };
  const handleNavigateToDetail = () => {
    navigation.navigate('OrganizationPostDetail2', {
      item,
      isJoin,
      peopleAttended,
      handleAttend,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToDetail}
      style={styles.container}
      activeOpacity={0.8}>
      <TouchableOpacity style={styles.btnFloat}>
        <Icon source={'dots-horizontal'} size={30} color={Colors.grayPrimary} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.btnFloat, {right: 10}]}>
        <Icon source={'close'} size={25} color={Colors.grayPrimary} />
      </TouchableOpacity> */}
      <View>
        <Image
          source={{
            uri: item.organizationposts.imageUrl,
          }}
          style={styles.img}
        />
        <View style={styles.itemContainer}>
          <Text style={styles.textTime}>Diễn ra vào hôm nay lúc 15:00</Text>
          <Text style={styles.textTitle}>{item.organizationposts.title}</Text>
          <Text style={styles.textTime}>
            Địa điểm: {item.organizationposts.locationName}
          </Text>
          <Text style={styles.textLocation}>
            {peopleAttended} người tham gia
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
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
              {isJoin ? 'Đã tham gia' : 'Tham gia'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../assets/images/share.png')}
              style={{width: 50, height: 50}}
            />
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
    right: 10,
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
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
});
