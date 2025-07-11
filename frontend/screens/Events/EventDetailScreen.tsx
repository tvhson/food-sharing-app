import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useEventById, IGetEventResponse} from '../../api/EventsApi';
import Header from '../../components/ui/Header';
import ImageSwiper from '../../components/ui/ImageSwiper';
import Colors from '../../global/Color';
import screenWidth from '../../global/Constant';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {scale} from '../../utils/scale';
import {formatDateToShow, formatTimeToShow} from '../../utils/helper';
import {CustomText} from '../../components/ui/CustomText';

const EventDetailScreen = ({route, navigation}: any) => {
  const eventId = route.params?.eventId;
  const token = useSelector((state: RootState) => state.token.key);
  const [refreshing, setRefreshing] = useState(false);
  const locationStart = useSelector((state: RootState) => state.location);

  const {
    data: event,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useEventById(token, eventId);

  const handleDirection = () => {
    if (!event?.latitude || !event?.longitude) {
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${locationStart.latitude},${locationStart.longitude}&destination=${event?.latitude},${event?.longitude}`;
    Linking.openURL(url);
  };

  if (isLoading || !event) {
    return (
      <View style={styles.container}>
        <Header title="Chi tiết sự kiện" navigation={navigation} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Chi tiết sự kiện" navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
        contentContainerStyle={{padding: scale(16)}}>
        <View style={{alignItems: 'center'}}>
          <ImageSwiper
            images={event?.imageUrl ? [event.imageUrl] : []}
            style={{
              width: screenWidth * 0.85,
              height: screenWidth,
              borderRadius: 20,
            }}
          />
        </View>
        <Text style={styles.title}>{event?.title}</Text>
        <View style={styles.infoRow}>
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{event?.author?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Image
            source={require('../../assets/images/location_color.png')}
            style={styles.icon}
          />
          <TouchableOpacity onPress={handleDirection}>
            <Text style={[styles.infoText, {marginRight: scale(30)}]}>
              {event?.locationName}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Image
            source={require('../../assets/images/clock.png')}
            style={styles.icon}
          />
          <CustomText style={styles.infoText}>
            {event?.startDate && event?.endDate ? (
              <>
                {`Từ ${formatDateToShow(
                  event?.startDate,
                )} đến ${formatDateToShow(event?.endDate)}\n`}
                {event?.startTime && event?.endTime
                  ? `${formatTimeToShow(event?.startTime)} → ${formatTimeToShow(
                      event?.endTime,
                    )}`
                  : ''}
              </>
            ) : event?.endDate ? (
              <>
                {`Kết thúc vào ${formatDateToShow(event?.endDate)}\n`}
                {event?.startTime && event?.endTime
                  ? `${formatTimeToShow(event?.startTime)} → ${formatTimeToShow(
                      event?.endTime,
                    )}`
                  : ''}
              </>
            ) : event?.startTime && event?.endTime ? (
              `${formatTimeToShow(event?.startTime)} → ${formatTimeToShow(
                event?.endTime,
              )}`
            ) : (
              ''
            )}
          </CustomText>
        </View>
        {event?.repeatDays && event?.repeatDays.length > 0 && (
          <View style={styles.infoRow}>
            <Image
              source={require('../../assets/images/tag.png')}
              style={styles.icon}
            />
            <Text style={styles.infoText}>
              Lặp lại: {formatRepeatDays(event?.repeatDays)}
            </Text>
          </View>
        )}
        {event?.description && (
          <View style={{marginTop: scale(16)}}>
            <Text style={styles.sectionHeader}>Mô tả</Text>
            <Text style={styles.description}>{event?.description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

function formatRepeatDays(days: number[]) {
  const labels = ['error', 'error', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  return days.map(d => labels[d] || d).join(', ');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: scale(40),
    fontSize: scale(16),
    color: Colors.gray600,
  },
  title: {
    fontSize: scale(24),
    fontFamily: getFontFamily('bold'),
    color: Colors.text,
    marginTop: scale(16),
    marginBottom: scale(8),
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(8),
  },
  icon: {
    width: scale(25),
    height: scale(25),
    marginRight: scale(12),
  },
  infoText: {
    fontSize: scale(16),
    fontFamily: getFontFamily('regular'),
    marginRight: scale(10),
    color: Colors.text,
  },
  sectionHeader: {
    fontSize: scale(18),
    fontFamily: getFontFamily('bold'),
    color: Colors.text,
    marginBottom: scale(4),
  },
  description: {
    fontSize: scale(16),
    fontFamily: getFontFamily('regular'),
    color: Colors.text,
    marginTop: scale(4),
  },
});

export default EventDetailScreen;
