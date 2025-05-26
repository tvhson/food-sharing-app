import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IGetGroupResponse, joinGroup} from '../../api/GroupApi';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../global/Color';
import React from 'react';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {addGroup} from '../../redux/GroupReducer';
import {getFontFamily} from '../../utils/fonts';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

interface IOrganizationPost2Props {
  item: IGetGroupResponse;
}

const OrganizationPost2 = (props: IOrganizationPost2Props) => {
  const token = useSelector((state: RootState) => state.token.key);
  const user = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const {item} = props;

  const handleAttend = async () => {
    if (item.joined === 'JOINED') {
      navigation.navigate(Route.GroupHomeScreen, {
        item,
      });
      return;
    }
    await joinGroup(token, item.id, user.id).then(response => {
      dispatch(addGroup(response));
    });
  };
  const handleNavigateToDetail = () => {
    navigation.navigate(Route.OrganizationPostDetail2, {
      item,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigateToDetail}
      style={styles.container}
      activeOpacity={0.8}>
      <View>
        <Image
          source={{
            uri: item.imageUrl,
          }}
          style={styles.img}
        />
        <View style={styles.itemContainer}>
          <Text style={styles.textTime}>
            Diễn ra vào {new Date(item.startDate).toLocaleDateString()}
          </Text>
          {item.endDate && (
            <Text style={styles.textTime}>
              Kết thúc vào {new Date(item.endDate).toLocaleDateString()}
            </Text>
          )}
          <Text style={styles.textTitle}>{item.name}</Text>
          <Text style={styles.textTime}>Địa điểm: {item.locationName}</Text>
          <Text style={styles.textLocation}>
            {item.members.length} thành viên
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
                backgroundColor:
                  item.joined === 'JOINED'
                    ? Colors.greenLight
                    : Colors.background,
                zIndex: 2,
              },
            ]}
            disabled={item.joined === 'JOINED' || item.joined === 'REQUESTED'}
            onPress={handleAttend}>
            <Image
              source={
                item.joined === 'JOINED'
                  ? require('../../assets/images/star-green.png')
                  : require('../../assets/images/star-black.png')
              }
              style={{width: 20, height: 20}}
            />
            <Text
              style={[
                styles.textBtn,
                {
                  color:
                    item.joined === 'JOINED'
                      ? Colors.greenPrimary
                      : Colors.black,
                },
              ]}>
              {item.joined === 'JOINED'
                ? 'Truy cập nhóm'
                : item.joined === 'REQUESTED'
                ? 'Đang chờ'
                : 'Tham gia'}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../assets/images/share.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity> */}
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
