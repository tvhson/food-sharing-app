import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';
import {getStatistics, IStatisticResponse} from '../../api/StatisticApi';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {scale, moderateScale} from '../../utils/scale';
import StatisticCard from '../../components/ui/StatisticCard';
import TopUserCard from '../../components/ui/TopUserCard';
import Badge from '../../components/ui/Badge';
import {useLoading} from '../../utils/LoadingContext';
import {Icon} from 'react-native-paper';
import Header from '../../components/ui/Header';

const StatisticScreen = ({navigation}: any) => {
  const [statistics, setStatistics] = useState<IStatisticResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const {showLoading, hideLoading} = useLoading();

  const accessToken = useSelector((state: RootState) => state.token.key);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await getStatistics(accessToken);
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [accessToken]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatistics();
    setRefreshing(false);
  };

  const getAssistedBadge = (count: number) => {
    if (count >= 100) return 'Người Đổi Đời';
    if (count >= 50) return 'Người Châm Hy Vọng';
    if (count >= 10) return 'Người Khởi Lửa';
    return '';
  };

  const getPostsBadge = (count: number) => {
    if (count >= 100) return 'Sứ Giả Thực Phẩm';
    if (count >= 50) return 'Người Lan Tỏa';
    if (count >= 10) return 'Người Gieo Hạt';
    return '';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.greenPrimary} />
        <Text style={styles.loadingText}>Đang tải thống kê...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header title="Thống Kê Tháng" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Header Content */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            Tổng quan hoạt động chia sẻ thực phẩm
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatisticCard
            title="Bài chia sẻ"
            value={statistics?.totalPosts || 0}
            icon="🍽️"
            color={Colors.greenPrimary}
          />
          <StatisticCard
            title="Người được giúp"
            value={statistics?.totalAssistedPeople || 0}
            icon="🤝"
            color={Colors.bluePrimary}
          />
          <StatisticCard
            title="Sự kiện"
            value={statistics?.totalEvents || 0}
            icon="📅"
            color={Colors.purple}
          />
        </View>

        {/* Your Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống Kê Của Bạn</Text>
          <View style={styles.yourStatsContainer}>
            <View style={styles.yourStatItem}>
              <Text style={styles.yourStatValue}>
                {statistics?.totalPostsYou || 0}
              </Text>
              <Text style={styles.yourStatLabel}>Bài viết chia sẻ</Text>
            </View>
            <View style={styles.yourStatItem}>
              <Text style={styles.yourStatValue}>
                {statistics?.totalAssistedPeopleYou || 0}
              </Text>
              <Text style={styles.yourStatLabel}>Người đã giúp</Text>
            </View>
          </View>

          {/* Your Badges */}
          <View style={styles.badgesSection}>
            <Text style={styles.badgesTitle}>Huy Hiệu Của Bạn</Text>
            <View style={styles.badgesContainer}>
              {getAssistedBadge(statistics?.totalAssistedPeopleYou || 0) && (
                <Badge
                  title={getAssistedBadge(
                    statistics?.totalAssistedPeopleYou || 0,
                  )}
                  type="assisted"
                  count={statistics?.totalAssistedPeopleYou || 0}
                />
              )}
              {getPostsBadge(statistics?.totalPostsYou || 0) && (
                <Badge
                  title={getPostsBadge(statistics?.totalPostsYou || 0)}
                  type="posts"
                  count={statistics?.totalPostsYou || 0}
                />
              )}
              {!getAssistedBadge(statistics?.totalAssistedPeopleYou || 0) &&
                !getPostsBadge(statistics?.totalPostsYou || 0) && (
                  <Text style={styles.noBadgeText}>
                    Chưa có huy hiệu nào. Hãy tiếp tục chia sẻ để nhận huy hiệu!
                  </Text>
                )}
            </View>
          </View>
        </View>

        {/* Top Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top 3 Người Chia Sẻ</Text>
          {statistics?.topUsers && statistics.topUsers.length > 0 ? (
            statistics.topUsers.map((user, index) => (
              <TopUserCard key={user.id} user={user} rank={index + 1} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Chưa có dữ liệu người dùng hàng đầu
              </Text>
            </View>
          )}
        </View>

        {/* Badge Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hệ Thống Huy Hiệu</Text>

          <View style={styles.badgeInfoContainer}>
            <Text style={styles.badgeInfoTitle}>Huy Hiệu Người Giúp:</Text>
            <View style={styles.badgeInfoItem}>
              <Badge title="Người Khởi Lửa" type="assisted" count={10} />
              <Text style={styles.badgeInfoText}>Giúp hơn 10 người</Text>
            </View>
            <View style={styles.badgeInfoItem}>
              <Badge title="Người Châm Hy Vọng" type="assisted" count={50} />
              <Text style={styles.badgeInfoText}>Giúp hơn 50 người</Text>
            </View>
            <View style={styles.badgeInfoItem}>
              <Badge title="Người Đổi Đời" type="assisted" count={100} />
              <Text style={styles.badgeInfoText}>Giúp hơn 100 người</Text>
            </View>
          </View>

          <View style={styles.badgeInfoContainer}>
            <Text style={styles.badgeInfoTitle}>Huy Hiệu Bài Viết:</Text>
            <View style={styles.badgeInfoItem}>
              <Badge title="Người Gieo Hạt" type="posts" count={10} />
              <Text style={styles.badgeInfoText}>Chia sẻ hơn 10 bài</Text>
            </View>
            <View style={styles.badgeInfoItem}>
              <Badge title="Người Lan Tỏa" type="posts" count={50} />
              <Text style={styles.badgeInfoText}>Chia sẻ hơn 50 bài</Text>
            </View>
            <View style={styles.badgeInfoItem}>
              <Badge title="Sứ Giả Thực Phẩm" type="posts" count={100} />
              <Text style={styles.badgeInfoText}>Chia sẻ hơn 100 bài</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.greenPrimary,
    paddingTop: moderateScale(40),
    paddingBottom: moderateScale(16),
    paddingHorizontal: moderateScale(20),
  },
  backButton: {
    padding: moderateScale(8),
  },
  placeholder: {
    width: moderateScale(40),
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: moderateScale(16),
    fontSize: scale(16),
    fontFamily: getFontFamily('medium'),
    color: Colors.grayText,
  },
  header: {
    padding: moderateScale(20),
    paddingTop: moderateScale(20),
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: scale(20),
    fontFamily: getFontFamily('bold'),
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: scale(14),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: moderateScale(16),
    padding: moderateScale(20),
  },
  sectionTitle: {
    fontSize: scale(18),
    fontFamily: getFontFamily('semibold'),
    color: Colors.black,
    marginBottom: moderateScale(16),
  },
  yourStatsContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(20),
  },
  yourStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: moderateScale(16),
    backgroundColor: Colors.greenLight,
    borderRadius: moderateScale(12),
    marginHorizontal: moderateScale(4),
  },
  yourStatValue: {
    fontSize: scale(24),
    fontFamily: getFontFamily('bold'),
    color: Colors.greenPrimary,
    marginBottom: moderateScale(4),
  },
  yourStatLabel: {
    fontSize: scale(12),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
    textAlign: 'center',
  },
  badgesSection: {
    marginTop: moderateScale(16),
  },
  badgesTitle: {
    fontSize: scale(16),
    fontFamily: getFontFamily('semibold'),
    color: Colors.black,
    marginBottom: moderateScale(12),
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noBadgeText: {
    fontSize: scale(14),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
    paddingVertical: moderateScale(20),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: moderateScale(40),
  },
  emptyText: {
    fontSize: scale(16),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
    textAlign: 'center',
  },
  badgeInfoContainer: {
    marginBottom: moderateScale(20),
  },
  badgeInfoTitle: {
    fontSize: scale(16),
    fontFamily: getFontFamily('semibold'),
    color: Colors.black,
    marginBottom: moderateScale(12),
  },
  badgeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  badgeInfoText: {
    fontSize: scale(14),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
    marginLeft: moderateScale(12),
  },
});

export default StatisticScreen;
