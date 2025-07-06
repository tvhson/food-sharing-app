import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {scale, moderateScale} from '../../utils/scale';
import {ITopUser} from '../../api/StatisticApi';
import Badge from './Badge';

interface TopUserCardProps {
  user: ITopUser;
  rank: number;
}

const TopUserCard: React.FC<TopUserCardProps> = ({user, rank}) => {
  const getRankColor = () => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return Colors.gray300;
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.rankContainer}>
        <View style={[styles.rankBadge, {backgroundColor: getRankColor()}]}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Image source={{uri: user.imageUrl}} style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.locationName && (
            <Text style={styles.location}>{user.locationName}</Text>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.totalPosts}</Text>
          <Text style={styles.statLabel}>Bài viết</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.totalAssistedPeople}</Text>
          <Text style={styles.statLabel}>Người giúp</Text>
        </View>
      </View>

      <View style={styles.badgesContainer}>
        {getAssistedBadge(user.totalAssistedPeople) && (
          <Badge
            title={getAssistedBadge(user.totalAssistedPeople)}
            type="assisted"
            count={user.totalAssistedPeople}
          />
        )}
        {getPostsBadge(user.totalPosts) && (
          <Badge
            title={getPostsBadge(user.totalPosts)}
            type="posts"
            count={user.totalPosts}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(12),
    zIndex: 1,
  },
  rankBadge: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: scale(12),
    fontFamily: getFontFamily('bold'),
    color: Colors.white,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(12),
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: scale(16),
    fontFamily: getFontFamily('semibold'),
    color: Colors.black,
    marginBottom: moderateScale(4),
  },
  location: {
    fontSize: scale(12),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: moderateScale(12),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: scale(18),
    fontFamily: getFontFamily('bold'),
    color: Colors.greenPrimary,
    marginBottom: moderateScale(2),
  },
  statLabel: {
    fontSize: scale(12),
    fontFamily: getFontFamily('regular'),
    color: Colors.grayText,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default TopUserCard;
