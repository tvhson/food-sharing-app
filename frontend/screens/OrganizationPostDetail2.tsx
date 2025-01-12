/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Icon} from 'react-native-paper';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';

import {Linking} from 'react-native';
import {
  attendOrganizationPost,
  createCommentToOrganizationPost,
  getCommentByOrganizationPostId,
  getOrganizationPostById,
} from '../api/OrganizationPostApi';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {useNotifications} from 'react-native-notificated';
import CommentItem from '../components/ui/CommentItem';

const OrganizationPostDetail2 = (props: any) => {
  const {navigation} = props;
  const [item, setItem] = useState<any>(props.route.params.item);
  const [isJoin, setIsJoin] = useState(
    props.route.params?.isJoin || item.organizationposts.attended,
  );
  const [peopleAttended, setPeopleAttended] = useState(
    props.route?.params?.peopleAttended ||
      item.organizationposts.peopleAttended,
  );
  const handleAttende = props.route?.params?.handleAttend;
  const commentInputRef = useRef<TextInput>(null);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [refreshing, setRefreshing] = useState(false);
  const {notify} = useNotifications();

  const handleAttend = async () => {
    setIsJoin(!isJoin);
    setPeopleAttended((prev: any) => (prev ? prev - 1 : prev + 1));
    if (!handleAttende) {
      const response: any = await attendOrganizationPost(
        item.organizationposts.id,
        accessToken,
      );
      if (response.status !== 200) {
        setIsJoin(!isJoin);
        setPeopleAttended(
          (prev: any) => (prev ? prev - 1 : prev + 1), // Adjust count dynamically
        );
      }
      return;
    }
    handleAttende();
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

  useEffect(() => {
    const getCommentList = async () => {
      // get comment list
      if (accessToken) {
        // get comment list
        getCommentByOrganizationPostId(
          item.organizationposts.id,
          accessToken,
        ).then((response: any) => {
          if (response.status === 200) {
            setCommentList(response.data);
          }
        });
      }
    };
    getCommentList();
  }, [accessToken, item.organizationposts.id]);

  const handleCreateComment = async () => {
    const response: any = await createCommentToOrganizationPost(
      item.organizationposts.id,
      {content: comment},
      accessToken,
    );
    if (response.status === 200) {
      setComment('');
      getCommentByOrganizationPostId(
        item.organizationposts.id,
        accessToken,
      ).then((response: any) => {
        if (response.status === 200) {
          setCommentList(response.data);
        }
      });
    } else {
      notify('error', {
        params: {description: 'Không thể tạo comment', title: 'Lỗi'},
      });
    }
  };

  const getOrganizationPostData = async () => {
    const response: any = await getOrganizationPostById(item.id, accessToken);
    if (response.status === 200) {
      setItem(response.data);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getOrganizationPostData();
    setRefreshing(false);
  };

  const renderHeader = () => {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <>
          <View style={styles.container}>
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
                <Text style={styles.textTitle}>
                  {item.organizationposts.title}
                </Text>
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
                    {isJoin ? 'Đã tham gia' : 'Tham gia'}
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
                      {peopleAttended} người tham gia
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}>
                <Text style={styles.textTitle2}>Chi tiết chiến dịch</Text>
                <View style={{flex: 1}}>
                  <Text style={styles.textNormal}>
                    {item.organizationposts.description}
                  </Text>
                </View>
                <View
                  style={{
                    height: 0.8,
                    backgroundColor: '#ccc',
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                />
              </View>
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={{height: 70}} />}
        data={commentList}
        renderItem={({item}) => <CommentItem comment={item} />}
        keyExtractor={(data: any) => data.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
          backgroundColor: Colors.white,
        }}>
        <TextInput
          ref={commentInputRef}
          multiline
          placeholder="Viết bình luận"
          style={{
            backgroundColor: Colors.background,
            borderRadius: 20,
            padding: 10,
            flex: 1,
          }}
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleCreateComment} disabled={!comment}>
          <Image
            source={require('../assets/images/send.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
    </View>
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
