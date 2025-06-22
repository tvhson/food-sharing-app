import React, {useEffect, useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
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
import {setHomePageFundingPost} from '../../redux/OrganizationPostReducer';
import {moderateScale, scale, verticalScale} from '../../utils/scale';

import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {ScrollView} from 'react-native';
import {useNotifications} from 'react-native-notificated';
import {Icon} from 'react-native-paper';
import {getOrganizationPost} from '../../api/OrganizationPostApi';
import Comment from '../../components/ui/Comment';
import {CustomInput} from '../../components/ui/CustomInput/CustomInput';
import GroupPostItem from '../../components/ui/GroupUI/GroupPostItem';
import {Route} from '../../constants/route';
import Colors from '../../global/Color';
import {screenHeight} from '../../global/Constant';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {useLoading} from '../../utils/LoadingContext';
import {
  CreateGroupTodoSchema,
  createGroupTodoValidate,
} from '../../utils/schema/create-group-todos';
import {parseDDMMYYYY} from '../../utils/schema/hook-forms';
import GroupModalMember from './component/GroupModalMember';
import GroupStatementItem from './component/GroupStatementItem';
import GroupTodoItem from './component/GroupTodoItem';
import {
  CreateGroupStatementSchema,
  createGroupStatementValidate,
} from '../../utils/schema/create-group-statement';

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
  const [statementMember, setStatementMember] =
    useState<IGetGroupResponse['members'][number]>();
  const [isModalMemberVisible, setIsModalMemberVisible] = useState(false);
  const [statementData, setStatementData] = useState<
    IGetGroupStatementResponse[]
  >([]);
  const {notify} = useNotifications();
  const {showLoading, hideLoading} = useLoading();

  const {
    control: todoControl,
    handleSubmit: handleTodoSubmit,
    reset: resetTodoForm,
    formState: {errors: todoErrors},
  } = useForm<CreateGroupTodoSchema>({
    resolver: zodResolver(createGroupTodoValidate()),
    defaultValues: {
      title: '',
      date: '',
    },
  });

  const {
    control: statementControl,
    handleSubmit: handleStatementSubmit,
    reset: resetStatementForm,
    setValue: setStatementValue,
    formState: {errors: statementErrors},
  } = useForm<CreateGroupStatementSchema>({
    resolver: zodResolver(createGroupStatementValidate()),
    defaultValues: {
      description: '',
      user: '',
    },
  });

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

  const handleCreateTodo = async (data: CreateGroupTodoSchema) => {
    try {
      const response = await createGroupTodo(accessToken, group.id, {
        title: data.title,
        date: data.date ? parseDDMMYYYY(data.date) || new Date() : new Date(),
        status: 'pending',
      });
      resetTodoForm();
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

  const handleCreateStatement = async (data: CreateGroupStatementSchema) => {
    try {
      if (!statementMember) {
        notify('error', {
          params: {
            description: 'Vui lòng chọn người ủng hộ',
            title: 'Lỗi',
          },
        });
        return;
      }
      const response = await createGroupStatement(accessToken, group.id, {
        user: {
          id: statementMember?.id,
        },
        description: data.description,
      });
      resetStatementForm();
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
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(Route.GroupMember, {
            group,
          });
        }}
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
      </TouchableOpacity>
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
              borderRadius: scale(10),
              marginHorizontal: scale(10),
              borderWidth: 1,
              borderColor: Colors.gray400,
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
            key={post.organizationposts.id}
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
              borderRadius: scale(10),
              width: '90%',
              marginTop: scale(10),
              gap: scale(10),
              paddingHorizontal: scale(10),
            }}>
            <CustomInput
              controller={{
                control: todoControl,
                name: 'title',
              }}
              label="Việc cần làm..."
              labelColor={Colors.gray600}
              errorText={todoErrors.title?.message}
            />
            <CustomInput
              controller={{
                control: todoControl,
                name: 'date',
              }}
              errorText={todoErrors.date?.message}
              label="Ngày bắt đầu"
              labelColor={Colors.gray600}
              isDatePicker
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.greenPrimary,
                paddingHorizontal: scale(10),
                paddingVertical: scale(5),
                borderRadius: scale(10),
                alignSelf: 'flex-end',
              }}
              onPress={handleTodoSubmit(handleCreateTodo)}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: getFontFamily('bold'),
                  fontSize: moderateScale(16),
                }}>
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
              borderRadius: scale(10),
              width: '90%',
              marginTop: scale(10),
              gap: scale(10),
              paddingHorizontal: scale(10),
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsModalMemberVisible(true);
              }}>
              <View pointerEvents="none">
                <CustomInput
                  controller={{
                    control: statementControl,
                    name: 'user',
                  }}
                  label="Người ủng hộ"
                  labelColor={Colors.gray600}
                  errorText={statementErrors.user?.message}
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>
            <CustomInput
              controller={{
                control: statementControl,
                name: 'description',
              }}
              label="Đồ ủng hộ"
              labelColor={Colors.gray600}
              errorText={statementErrors.description?.message}
            />
            <TouchableOpacity
              style={{
                backgroundColor: Colors.greenPrimary,
                paddingHorizontal: scale(10),
                paddingVertical: scale(5),
                borderRadius: scale(10),
                alignSelf: 'flex-end',
              }}
              onPress={handleStatementSubmit(handleCreateStatement)}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: getFontFamily('bold'),
                  fontSize: moderateScale(16),
                }}>
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
            setStatementValue('user', member.name);
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
