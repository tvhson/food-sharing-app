import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {moderateScale, scale, verticalScale} from '../../utils/scale';

import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {IGetGroupResponse} from '../../api/GroupApi';
import GroupPostItem from '../../components/ui/GroupUI/GroupPostItem';
import {Route} from '../../constants/route';
import Colors from '../../global/Color';
import {screenHeight} from '../../global/Constant';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {ScrollView} from 'react-native';
import {getOrganizationPost} from '../../api/OrganizationPostApi';
import {IOrganizationPost} from '../../redux/OrganizationPostReducer';
import {IGroupPost} from '../../global/types';
import {useNotifications} from 'react-native-notificated';
import Comment from '../../components/ui/Comment';

const IMAGE_HEIGHT = screenHeight * 0.25;

const GroupHomeScreen = ({route}: {route: any}) => {
  const navigation: any = useNavigation();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const {group}: {group: IGetGroupResponse} = route.params;
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [tab, setTab] = useState<'post' | 'todo' | 'statement'>('post');
  const [refreshing, setRefreshing] = useState(false);
  const [groupPosts, setGroupPosts] = useState<IGroupPost[]>([]);
  const [commentPostId, setCommentPostId] = useState<number>(0);
  const [showComment, setShowComment] = useState(false);
  const {notify} = useNotifications();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > IMAGE_HEIGHT - 30);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getGroupPost();
    setRefreshing(false);
  };

  const getGroupPost = async () => {
    const response: any = await getOrganizationPost(accessToken, group.id);
    if (response.status === 200) {
      setGroupPosts(response.data);
    } else {
      notify('error', {
        params: {
          description: 'Không thể lấy data',
          title: 'Lỗi',
          style: {
            multiline: 100,
          },
        },
      });
    }
  };

  useEffect(() => {
    getGroupPost();
  }, []);

  const renderStickyHeader = () => (
    <View style={styles.stickyHeader}>
      <Text style={styles.title}>{group.name}</Text>
    </View>
  );

  const renderHeader = () => (
    <View
      style={{justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Image source={{uri: group.imageUrl}} style={styles.image} />
      <Text style={styles.title}>{group.name}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: scale(30),
        }}>
        <Text
          style={{
            fontFamily: getFontFamily('regular'),
            color: Colors.black,
            fontSize: moderateScale(16),
          }}>
          <Icon source="account-group" size={18} color="black" />
          {'  '}
          {group.members.length} thành viên
        </Text>
        {group.joinType === 'private' && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: getFontFamily('regular'),
                color: Colors.black,
                fontSize: moderateScale(16),
              }}>
              <Icon source="account-group" size={18} color="black" />
              {'  '}
              {group.requests.length} yêu cầu
            </Text>
            {userInfo.id === group.author.id && (
              <TouchableOpacity
                style={{
                  marginLeft: scale(10),
                  padding: scale(5),
                  paddingHorizontal: scale(10),
                  backgroundColor: Colors.greenPrimary,
                  borderRadius: 10,
                }}
                onPress={() => {}}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: moderateScale(12),
                    fontFamily: getFontFamily('bold'),
                  }}>
                  Xem
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          width: '90%',
          marginTop: scale(10),
          backgroundColor: Colors.white,
          padding: scale(10),
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: group.imageUrl}}
          style={{width: 30, height: 30, borderRadius: 100}}
        />
        <Text
          onPress={() => {
            navigation.navigate(Route.GroupEditPost, {
              group,
            });
          }}
          style={{
            flex: 1,
            fontSize: moderateScale(16),
            fontFamily: getFontFamily('regular'),
            color: Colors.grayText,
            borderRadius: 20,
            marginHorizontal: scale(10),
            borderWidth: 1,
            borderColor: Colors.black,
            paddingVertical: scale(5),
            paddingHorizontal: scale(16),
          }}>
          Bạn muốn nhắn gì?
        </Text>

        <TouchableOpacity
          style={{alignItems: 'center', justifyContent: 'center'}}
          onPress={() => {
            navigation.navigate(Route.GroupCreatePost, {
              group,
            });
          }}>
          <Icon source="image" size={20} color={Colors.greenPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTab = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.tabItem} onPress={() => setTab('post')}>
        <Text style={styles.tabText}>Bài viết</Text>
        {tab === 'post' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => setTab('todo')}>
        <Text style={styles.tabText}>Tiến độ</Text>
        {tab === 'todo' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => setTab('statement')}>
        <Text style={styles.tabText}>Sao kê</Text>
        {tab === 'statement' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onScroll={handleScroll}>
      {showStickyHeader && renderStickyHeader()}
      <TouchableOpacity
        style={styles.backButtonHeader}
        onPress={() => navigation.goBack()}>
        <Icon source="arrow-left" size={20} color="black" />
      </TouchableOpacity>
      {renderHeader()}
      {renderTab()}
      {tab === 'post' &&
        (groupPosts.length > 0 ? (
          <View>
            {groupPosts.map(post => (
              <GroupPostItem
                item={post}
                setCommentPostId={setCommentPostId}
                setShowComment={setShowComment}
              />
            ))}
          </View>
        ) : (
          <Text>Không có bài viết</Text>
        ))}
      <Comment
        isVisible={showComment}
        setVisible={setShowComment}
        commentPostId={commentPostId}
        type="GROUP_POST"
      />
    </ScrollView>
  );
};

export default GroupHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  backButtonHeader: {
    padding: 10,
    position: 'absolute',
    zIndex: 101,
    left: 10,
    top: 10,
    backgroundColor: 'white',
    borderRadius: 100,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(50),
    backgroundColor: 'white',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    elevation: 4,
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold'),
    color: Colors.black,
  },

  postItem: {
    paddingVertical: scale(4),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
  },
  tabItem: {
    padding: scale(10),
    position: 'relative',
  },
  tabText: {
    fontSize: moderateScale(16),
    fontFamily: getFontFamily('bold'),
    color: Colors.black,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.greenPrimary,
  },
});
