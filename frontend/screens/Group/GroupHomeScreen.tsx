import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IGetGroupResponse,
  IGetGroupStatementResponse,
  IGetGroupTodoResponse,
  createGroupStatement,
  createGroupTodo,
  getGroupStatement,
  getGroupTodo,
  updateGroupTodo,
} from '../../api/GroupApi';
import {
  IOrganizationPost,
  setHomePageFundingPost,
} from '../../redux/OrganizationPostReducer';
import React, {useEffect, useState} from 'react';
import {moderateScale, scale, verticalScale} from '../../utils/scale';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../global/Color';
import Comment from '../../components/ui/Comment';
import {DatePickerInput} from 'react-native-paper-dates';
import GroupModalMember from './component/GroupModalMember';
import GroupPostItem from '../../components/ui/GroupUI/GroupPostItem';
import GroupStatementItem from './component/GroupStatementItem';
import GroupTodoItem from './component/GroupTodoItem';
import {IGroupPost} from '../../global/types';
import {Icon} from 'react-native-paper';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {ScrollView} from 'react-native';
import {getFontFamily} from '../../utils/fonts';
import {getOrganizationPost} from '../../api/OrganizationPostApi';
import {screenHeight} from '../../global/Constant';
import {useLoading} from '../../utils/LoadingContext';
import {useNavigation} from '@react-navigation/native';
import {useNotifications} from 'react-native-notificated';

const GroupHomeScreen = ({route}: {route: any}) => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const accessToken = useSelector((state: RootState) => state.token.key);
  const groupPosts = useSelector(
    (state: RootState) => state.fundingPost.HomePage,
  );

  const {group}: {group: IGetGroupResponse} = route.params;
  const [todoData, setTodoData] = useState<IGetGroupTodoResponse[]>([]);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [tab, setTab] = useState<'post' | 'todo' | 'statement'>('post');
  const [refreshing, setRefreshing] = useState(false);
  const [commentPostId, setCommentPostId] = useState<number>(0);
  const [showComment, setShowComment] = useState(false);
  const [todoDescription, setTodoDescription] = useState('');
  const [todoStartDate, setTodoStartDate] = useState(new Date());
  const [statementMember, setStatementMember] =
    useState<IGetGroupResponse['members'][number]>();
  const [isModalMemberVisible, setIsModalMemberVisible] = useState(false);
  const [statementDescription, setStatementDescription] = useState('');
  const [statementData, setStatementData] = useState<
    IGetGroupStatementResponse[]
  >([]);
  const {notify} = useNotifications();
  const {showLoading, hideLoading} = useLoading();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const IMAGE_HEIGHT = screenHeight * 0.25;
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > IMAGE_HEIGHT - scale(30));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getGroupPost();
    await getTodoData();
    await getStatementData();
    setRefreshing(false);
  };

  const handleGoToCreateGroupPost = () => {
    navigation.navigate(Route.CreateFundingPost, {
      group,
    });
  };

  const handleCreateTodo = async () => {
    try {
      if (todoDescription.trim() === '') {
        notify('error', {
          params: {
            description: 'Vui lòng nhập mô tả',
            title: 'Lỗi',
          },
        });
        return;
      }
      const response = await createGroupTodo(accessToken, group.id, {
        title: todoDescription,
        date: todoStartDate,
        status: 'pending',
      });
      setTodoDescription('');
      setTodoStartDate(new Date());
      handleRefresh();
    } catch (error) {
      notify('error', {
        params: {
          description: 'Không thể tạo todo',
          title: 'Lỗi',
        },
      });
    }
  };

  const handleFinishTodo = async (todoId: number) => {
    try {
      showLoading();
      const todo = todoData.find(todo => todo.id === todoId);
      const response = await updateGroupTodo(accessToken, todoId, {
        title: todo?.title || '',
        date: new Date(todo?.date || ''),
        status: todo?.status === 'completed' ? 'pending' : 'completed',
      });
      setTodoData(todoData.map(todo => (todo.id === todoId ? response : todo)));

      hideLoading();
    } catch (error) {
      hideLoading();
      notify('error', {
        params: {
          description: 'Không thể hoàn thành todo',
          title: 'Lỗi',
        },
      });
    }
  };

  const handleCreateStatement = async () => {
    try {
      if (!statementMember || statementDescription.trim() === '') {
        notify('error', {
          params: {
            description: 'Vui lòng chọn người ủng hộ và nhập mô tả',
            title: 'Lỗi',
          },
        });
        return;
      }
      const response = await createGroupStatement(accessToken, group.id, {
        user: {
          id: statementMember?.id,
        },
        description: statementDescription,
      });
      setStatementDescription('');
      setStatementMember(undefined);
      handleRefresh();
    } catch (error) {
      notify('error', {
        params: {
          description: 'Không thể tạo sao kê',
          title: 'Lỗi',
        },
      });
    }
  };

  const getStatementData = async () => {
    try {
      const response = await getGroupStatement(accessToken, group.id);
      setStatementData(response);
    } catch (error) {
      notify('error', {
        params: {
          description: 'Không thể lấy data',
          title: 'Lỗi',
        },
      });
    }
  };

  const getTodoData = async () => {
    try {
      const response = await getGroupTodo(accessToken, group.id);
      setTodoData(response);
    } catch (error) {
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

  const getGroupPost = async () => {
    showLoading();
    const response: any = await getOrganizationPost(accessToken, group.id);
    if (response.status === 200) {
      dispatch(setHomePageFundingPost(response.data));
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
    hideLoading();
  };

  useEffect(() => {
    getGroupPost();
    getTodoData();
    getStatementData();
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
        {group.joinType === 'PRIVATE' && group.author.id === userInfo.id && (
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
      {group.author.id === userInfo.id && (
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
              handleGoToCreateGroupPost();
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
              handleGoToCreateGroupPost();
            }}>
            <Icon source="image" size={20} color={Colors.greenPrimary} />
          </TouchableOpacity>
        </View>
      )}
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

  const renderPost = () => {
    return groupPosts.length > 0 ? (
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
      <View style={{flex: 1, alignItems: 'center', marginTop: scale(40)}}>
        <Text style={styles.title}>Không có bài viết</Text>
      </View>
    );
  };

  const renderTodo = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {group.author.id === userInfo.id && (
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: scale(10),
              borderRadius: 8,
              width: '90%',
              marginTop: scale(10),
              gap: scale(10),
            }}>
            <TextInput
              placeholder="Việc cần làm..."
              placeholderTextColor={'#706d6d'}
              style={{
                fontSize: 16,
                padding: 10,
                backgroundColor: '#eff2ff',
                borderRadius: 8,
                color: 'black',
                borderWidth: 2,
                borderColor: Colors.greenPrimary,
                marginHorizontal: scale(10),
              }}
              value={todoDescription}
              onChangeText={setTodoDescription}
            />
            <DatePickerInput
              locale="vi"
              label="Ngày bắt đầu"
              value={todoStartDate}
              onChange={(date: Date | undefined) =>
                setTodoStartDate(date || new Date())
              }
              inputMode="start"
              saveLabel="Lưu"
              style={{
                backgroundColor: '#eff2ff',
                color: 'black',
                fontFamily: getFontFamily('regular'),
              }}
              mode="outlined"
              outlineStyle={{
                borderColor: Colors.greenPrimary,
                borderRadius: 8,
                borderWidth: 2,
                marginHorizontal: scale(10),
              }}
              contentStyle={{
                fontFamily: getFontFamily('regular'),
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.greenPrimary,
                paddingHorizontal: scale(10),
                paddingVertical: scale(5),
                borderRadius: 8,
                alignSelf: 'flex-end',
                marginHorizontal: scale(10),
              }}
              onPress={() => {
                handleCreateTodo();
              }}>
              <Text style={{color: 'white', fontFamily: getFontFamily('bold')}}>
                Thêm
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flex: 1,
            width: '90%',
            marginTop: scale(10),
            borderRadius: scale(10),
            overflow: 'hidden',
          }}>
          {todoData.map((todo, index) => (
            <GroupTodoItem
              key={todo.id}
              todo={todo}
              handleFinishTodo={handleFinishTodo}
              isAuthor={group.author.id === userInfo.id}
              index={index}
            />
          ))}
        </View>
        {todoData.length === 0 && (
          <View style={{flex: 1, alignItems: 'center', marginTop: scale(30)}}>
            <Text style={styles.title}>Không có bài viết</Text>
          </View>
        )}
      </View>
    );
  };

  const renderStatement = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {group.author.id === userInfo.id && (
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: scale(10),
              borderRadius: 8,
              width: '90%',
              marginTop: scale(10),
              gap: scale(10),
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsModalMemberVisible(true);
              }}>
              <TextInput
                placeholder="Nguời ủng hộ"
                placeholderTextColor={'#706d6d'}
                style={{
                  fontSize: 16,
                  padding: 10,
                  backgroundColor: '#eff2ff',
                  borderRadius: 8,
                  color: 'black',
                  borderWidth: 2,
                  borderColor: Colors.greenPrimary,
                  marginHorizontal: scale(10),
                }}
                editable={false}
                value={statementMember?.name || ''}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Đồ ủng hộ"
              placeholderTextColor={'#706d6d'}
              style={{
                fontSize: 16,
                padding: 10,
                backgroundColor: '#eff2ff',
                borderRadius: 8,
                color: 'black',
                borderWidth: 2,
                borderColor: Colors.greenPrimary,
                marginHorizontal: scale(10),
              }}
              value={statementDescription}
              onChangeText={setStatementDescription}
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.greenPrimary,
                paddingHorizontal: scale(10),
                paddingVertical: scale(5),
                borderRadius: 8,
                alignSelf: 'flex-end',
                marginHorizontal: scale(10),
              }}
              onPress={() => {
                handleCreateStatement();
              }}>
              <Text style={{color: 'white', fontFamily: getFontFamily('bold')}}>
                Thêm
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{height: scale(10)}} />
        <View style={{flex: 1, width: '90%'}}>
          {statementData.map(statement => (
            <GroupStatementItem key={statement.id} statement={statement} />
          ))}
        </View>
        {statementData.length === 0 && (
          <View style={{flex: 1, alignItems: 'center', marginTop: scale(30)}}>
            <Text style={styles.title}>Không có bài viết</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={styles.backButtonHeader}
        onPress={() => navigation.goBack()}>
        <Icon source="arrow-left" size={20} color="black" />
      </TouchableOpacity>
      {showStickyHeader && renderStickyHeader()}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={handleScroll}>
        {renderHeader()}
        {renderTab()}
        {tab === 'post' && renderPost()}
        {tab === 'todo' && renderTodo()}
        {tab === 'statement' && renderStatement()}
        <Comment
          isVisible={showComment}
          setVisible={setShowComment}
          commentPostId={commentPostId}
          type="GROUP_POST"
        />
        <GroupModalMember
          members={group.members}
          setSelectedMember={member => {
            setStatementMember(member);

            setIsModalMemberVisible(false);
          }}
          selectedMember={statementMember}
          isVisible={isModalMemberVisible}
          onClose={() => setIsModalMemberVisible(false)}
        />
        <View style={{height: scale(20)}} />
      </ScrollView>
    </View>
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
    height: screenHeight * 0.25,
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
