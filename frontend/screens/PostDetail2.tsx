/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../components/ui/Header';
import {Icon} from 'react-native-paper';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';
import ImageSwiper from '../components/ui/ImageSwiper';
import screenWidth from '../global/Constant';
import CommentItem from '../components/ui/CommentItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {getInfoUserById} from '../api/AccountsApi';
import {getRoomChats} from '../api/ChatApi';
import {
  createCommentToPost,
  getCommentByPostId,
  getPostById,
  likePost,
} from '../api/PostApi';
import {
  likePostReducer,
  receivedPostReducer,
} from '../redux/SharingPostReducer';
import {useNotifications} from 'react-native-notificated';
import {createNotification} from '../api/NotificationApi';
import {set} from 'react-hook-form';

const PostDetail2 = ({route, navigation}: any) => {
  const [roomChat, setRoomChat] = useState<any>(null);
  const [createPostUser, setCreatePostUser] = useState<any>(null);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const commentInputRef = useRef<TextInput>(null);
  const [item, setItem] = useState(route.params.item);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const locationStart = {
    latitude: route.params.location.latitude,
    longitude: route.params.location.longitude,
  };
  const locationEnd = {
    latitude: route.params.item.latitude,
    longitude: route.params.item.longitude,
  };
  const [liked, setLiked] = React.useState(item.isLiked);
  const [likeCount, setLikeCount] = React.useState(item.likeCount);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const createdDate = route.params.createdDate;
  const distance = route.params.distance;
  const expiredString = route.params.expiredString;
  const {notify} = useNotifications();
  const dispatch = useDispatch();

  useEffect(() => {
    const getInfoUserCreatePost = async () => {
      if (accessToken && item.createdById !== userInfo.id) {
        getInfoUserById(item.createdById, accessToken)
          .then((response: any) => {
            if (response.status === 200) {
              setCreatePostUser(response.data);
              getRoomChats(accessToken.toString())
                .then((response2: any) => {
                  if (response2.status === 200) {
                    const roomChats = response2.data;
                    const roomChatFind = roomChats.find(
                      (room: any) =>
                        (room.senderId === userInfo.id &&
                          room.recipientId === response.data.id) ||
                        (room.senderId === response.data.id &&
                          room.recipientId === userInfo.id),
                    );
                    setRoomChat(roomChatFind);
                  } else {
                    console.log(response);
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    const getCommentList = async () => {
      // get comment list
      if (accessToken) {
        // get comment list
        getCommentByPostId(item.id, accessToken).then((response: any) => {
          if (response.status === 200) {
            setCommentList(response.data);
          } else {
            notify('error', {
              params: {description: 'Không thể tạo comment', title: 'Lỗi'},
            });
          }
        });
      }
    };
    getCommentList();
    getInfoUserCreatePost();
  }, [accessToken, item.createdById, item.id, notify, userInfo.id]);

  const getPostData = async () => {
    const response: any = await getPostById(item.id, accessToken);
    if (response.status === 200) {
      setItem(response.data);
      setLiked(response.data.isLiked);
      setLikeCount(
        response.data.isLiked
          ? response.data.likeCount + 1
          : response.data.likeCount,
      );
    }
  };

  const getCommentList = async () => {
    // get comment list
    if (accessToken) {
      // get comment list
      getCommentByPostId(item.id, accessToken).then((response: any) => {
        if (response.status === 200) {
          setCommentList(response.data);
        } else {
          notify('error', {
            params: {description: 'Không thể tạo comment', title: 'Lỗi'},
          });
        }
      });
    }
  };

  const handleReceived = async () => {
    if (accessToken) {
      try {
        const response: any = await createNotification(
          {
            title: 'Xác nhận việc nhận thức ăn',
            imageUrl: item.images[0],
            description:
              userInfo.name +
              ' muốn bạn xác nhận rằng bạn đã đưa thức ăn cho họ',
            type: 'RECEIVED',
            linkId: item.id,
            userId: createPostUser.id,
            senderId: userInfo.id,
          },
          accessToken,
        ).catch((error: any) => {
          console.log(error);
        });
        if (response.status === 200) {
          navigation.goBack();
          notify('success', {
            params: {
              description: 'Đã gửi yêu cầu nhận thức ăn',
              title: 'Yêu cầu đã được gửi',
            },
          });
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLiked = async () => {
    setLiked(!liked);
    dispatch(likePostReducer(item.id));
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    const response: any = await likePost(item.id, accessToken);
    if (response.status !== 200) {
      dispatch(likePostReducer(item.id));
      setLiked(!liked);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getPostData();
    await getCommentList();

    setRefreshing(false);
  };

  const handleShowComment = () => {
    //focust input comment
    commentInputRef.current?.focus();
  };

  const handleTagPress = (tag: string) => {
    console.log(`Tag ${tag} clicked`);
  };

  const handleDirection = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${locationStart.latitude},${locationStart.longitude}&destination=${locationEnd.latitude},${locationEnd.longitude}`;
    Linking.openURL(url);
  };

  const handleCreateComment = async () => {
    const response: any = await createCommentToPost(
      item.id,
      {content: comment},
      accessToken,
    );
    if (response.status === 200) {
      setComment('');
      getCommentByPostId(item.id, accessToken).then((response: any) => {
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

  const handleGoToMessage = () => {
    if (roomChat) {
      navigation.navigate('ChatRoom', {item: roomChat});
    } else {
      navigation.navigate('ChatRoom', {
        item: {
          senderProfilePic: userInfo.imageUrl,
          recipientProfilePic: createPostUser.imageUrl,
          senderId: userInfo.id,
          recipientId: createPostUser.id,
          senderName: userInfo.name,
          recipientName: createPostUser.name,
        },
      });
    }
  };

  const tags = [
    'Sản phẩm động vật',
    'Rau củ',
    'Trái cây',
    'Đồ uống',
    'Ngũ cốc',
    'Sản phẩm từ sữa',
    'Gia vị',
    'Hải sản',
    'Sản phẩm từ lò nướng',
    'Thực phẩm chế biến',
    'Các loại hạt',
    'Đậu',
    'Sản phẩm chay',
    'Thức ăn nhanh',
    'Đồ ăn vặt',
    'Thực phẩm đông lạnh',
  ];

  const renderTags = () => {
    return tags.map((tag, index) => (
      <TouchableOpacity
        key={index}
        style={styles.tagButton}
        onPress={() => handleTagPress(tag)}>
        <Text style={styles.tagText}>#{tag}</Text>
      </TouchableOpacity>
    ));
  };

  const renderHeader = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          //dismiss keyboard
          commentInputRef.current?.blur();
        }}>
        <View style={{padding: 16}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity>
              <Image
                source={{
                  uri:
                    createPostUser?.avatar ||
                    userInfo.imageUrl ||
                    'https://randomuser.me/api/portraits/men/36.jpg',
                }}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
            </TouchableOpacity>
            <View style={{alignSelf: 'center', marginLeft: 16}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: getFontFamily('semibold'),
                  color: Colors.text,
                }}>
                {createPostUser?.name || userInfo.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../assets/images/ion_earth.png')}
                  style={{width: 20, height: 20}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.grayText,
                    marginLeft: 4,
                  }}>
                  {createdDate}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,

                height: 40,
                alignSelf: 'center',
                position: 'absolute',
                right: 0,
                flexDirection: 'row',
              }}>
              {item.createdById !== userInfo.id && (
                <>
                  {!item.isReceived && (
                    <TouchableOpacity onPress={handleReceived}>
                      <Icon
                        source={'hand-heart'}
                        size={30}
                        color={Colors.black}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handleGoToMessage}
                    style={{marginLeft: 10}}>
                    <Icon
                      source={'chat-processing'}
                      size={30}
                      color={Colors.black}
                    />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                onPress={handleDirection}
                style={{marginLeft: 10}}>
                <Icon source={'directions'} size={30} color={Colors.black} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/foodIcon.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: getFontFamily('bold'),
                    color: Colors.text,
                    marginLeft: 16,
                  }}>
                  {item.title}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/distance.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.text,
                    marginLeft: 16,
                  }}>
                  Cách bạn{' '}
                  {distance < 0.1 ? `${distance * 1000}m` : `${distance}km`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/clock.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color: expiredString === 'Hết hạn' ? 'red' : Colors.text,
                    marginLeft: 16,
                  }}>
                  {expiredString === 'Hết hạn'
                    ? 'Hết hạn'
                    : `Hết hạn sau ${expiredString}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/part.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color: item.portion === 0 ? 'red' : Colors.text,
                    marginLeft: 16,
                  }}>
                  {item.portion > 0 ? `Còn ${item.portion} phần` : 'Hết phần'}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/scales.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.text,
                    marginLeft: 16,
                  }}>
                  {item.weight} kg
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/pickUp.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color:
                      new Date(item.pickUpEndDate) < new Date()
                        ? 'red'
                        : Colors.text,
                    marginLeft: 16,
                  }}>
                  Lấy từ ngày{' '}
                  {new Date(item.pickUpStartDate).toLocaleDateString()} đến ngày{' '}
                  {new Date(item.pickUpEndDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/location_color.png')}
                style={{width: 25, height: 25}}
              />
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.text,
                    marginLeft: 16,
                  }}>
                  Nhận tại {item.locationName}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 5,
              }}>
              <Image
                source={require('../assets/images/tag.png')}
                style={{width: 25, height: 25}}
              />
              <View style={styles.tagsContainer}>{renderTags()}</View>
            </View> */}
            <View
              style={{
                width: screenWidth * 0.85,
                height: screenWidth,
                borderRadius: 20,
                marginTop: 10,
                overflow: 'hidden',
                alignSelf: 'center',
              }}>
              <ImageSwiper images={item.images} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <TouchableOpacity onPress={handleLiked}>
                <Image
                  source={
                    liked
                      ? require('../assets/images/liked.png')
                      : require('../assets/images/like.png')
                  }
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={handleShowComment}>
                <Image
                  source={require('../assets/images/comment.png')}
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 10}}>
                <Image
                  source={require('../assets/images/share.png')}
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 10,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.black,
                  fontSize: 14,
                }}>
                {liked
                  ? likeCount === 1
                    ? 'Bạn'
                    : `Bạn và ${likeCount - 1} người khác`
                  : `${likeCount} người`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Chi tiết bài viết" navigation={navigation} />
      <FlatList
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={{height: 70}} />}
        data={commentList}
        renderItem={({item}) => <CommentItem comment={item} />}
        keyExtractor={(item: any) => item.id.toString()}
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

export default PostDetail2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    paddingHorizontal: 10,
  },
  tagText: {
    color: '#007bff',
    fontFamily: getFontFamily('regular'),
    fontSize: 16,
  },
});
