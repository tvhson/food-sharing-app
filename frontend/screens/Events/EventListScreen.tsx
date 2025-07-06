import React, {useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {IGetEventResponse, useEvents} from '../../api/EventsApi';
import {RootState} from '../../redux/Store';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {scale} from '../../utils/scale';
import {Icon} from '@rneui/themed';
import {Route} from '../../constants/route';
import {formatDateToShow, formatTimeToShow} from '../../utils/helper';

const DISTANCES = [5, 10, 20, 50];

const EventListScreen = ({navigation}: any) => {
  const token = useSelector((state: RootState) => state.token.key);
  // For demo, use static location. Replace with user's location if available.
  const latitude = 10.762622; // Example: HCM
  const longitude = 106.660172;
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  const params = useMemo(() => {
    if (selectedDistance) {
      return {latitude, longitude, distance: selectedDistance};
    }
    return {latitude, longitude};
  }, [latitude, longitude, selectedDistance]);

  const {data, isLoading, isError, refetch, isFetching} = useEvents(
    token,
    params,
  );

  console.log('data', data);

  // Sectioned data for Ongoing/Upcoming
  const sections = useMemo(() => {
    if (!data) return [];
    return [
      {title: 'Sự kiện đang diễn ra', data: data.ongoing},
      {title: 'Sự kiện sắp diễn ra', data: data.upcoming},
    ];
  }, [data]);

  // All events (for filter mode)
  const allEvents = data?.all || [];

  const renderEventItem = ({
    item,
    index,
  }: {
    item: IGetEventResponse;
    index: number;
  }) => {
    const isOngoing = item.status === 'ONGOING';
    const icon = isOngoing ? (
      <Icon
        name="megaphone"
        type="ionicon"
        color={Colors.yellow}
        size={36}
        style={{marginRight: scale(12)}}
      />
    ) : (
      <Icon
        name="calendar"
        type="ionicon"
        color={Colors.bluePrimary}
        size={36}
        style={{marginRight: scale(12)}}
      />
    );
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(Route.EventDetailScreen, {eventId: item.id})
        }
        style={[
          styles.eventCard,
          isOngoing && !selectedDistance ? styles.ongoingCard : {},
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {icon}
          <View style={{flex: 1}}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventLocation}>{item.locationName}</Text>
            <Text style={styles.eventTime}>
              {isOngoing && !selectedDistance
                ? `Thời gian kết thúc: ${formatTimeToShow(item.endTime)}`
                : `${formatDateToShow(item.startDate)} • ${formatTimeToShow(
                    item.startTime,
                  )}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionSeparator = () => <View style={{height: scale(24)}} />;
  const renderItemSeparator = () => <View style={{height: scale(16)}} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sự kiện</Text>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={{
            paddingHorizontal: scale(16),
          }}>
          {DISTANCES.map(dist => (
            <View key={dist}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedDistance === dist && styles.filterButtonActive,
                ]}
                onPress={() =>
                  setSelectedDistance(selectedDistance === dist ? null : dist)
                }>
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedDistance === dist && styles.filterButtonTextActive,
                  ]}>
                  {dist} km
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : isError ? (
        <Text style={styles.errorText}>Lỗi khi tải sự kiện.</Text>
      ) : selectedDistance ? (
        <FlatList
          data={allEvents}
          keyExtractor={item => String(item.id)}
          renderItem={renderEventItem}
          contentContainerStyle={{padding: scale(16)}}
          ItemSeparatorComponent={renderItemSeparator}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={styles.loadingText}>Không có sự kiện nào.</Text>
          }
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => String(item.id)}
          renderItem={renderEventItem}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={{padding: scale(16)}}
          SectionSeparatorComponent={renderSectionSeparator}
          ItemSeparatorComponent={renderItemSeparator}
          refreshing={isFetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={styles.loadingText}>Không có sự kiện nào.</Text>
          }
        />
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate(Route.CreateEventScreen)}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: Colors.button,
          borderRadius: 100,
          padding: 16,
        }}>
        <Icon name="add" color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default EventListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: scale(24),
    fontFamily: getFontFamily('bold'),
    textAlign: 'center',
    marginTop: scale(24),
    marginBottom: scale(8),
  },
  filterBar: {
    marginTop: scale(8),
  },
  filterButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
    backgroundColor: Colors.gray100,
    marginRight: scale(8),
    justifyContent: 'center',
    minHeight: scale(40),
  },
  filterButtonActive: {
    backgroundColor: Colors.greenPrimary,
  },
  filterButtonText: {
    fontSize: scale(16),
    color: Colors.gray700,
    fontFamily: getFontFamily('medium'),
    lineHeight: scale(24),
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    fontSize: scale(20),
    fontFamily: getFontFamily('bold'),
    marginBottom: scale(8),
    marginTop: scale(16),
    color: Colors.black,
  },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: scale(16),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ongoingCard: {
    backgroundColor: '#FFF7E6',
  },
  eventTitle: {
    fontSize: scale(18),
    fontFamily: getFontFamily('bold'),
    color: Colors.black,
  },
  eventLocation: {
    fontSize: scale(15),
    fontFamily: getFontFamily('regular'),
    color: Colors.gray700,
    marginTop: scale(2),
  },
  eventTime: {
    fontSize: scale(14),
    fontFamily: getFontFamily('regular'),
    color: Colors.gray600,
    marginTop: scale(2),
  },
  loadingText: {
    textAlign: 'center',
    marginTop: scale(40),
    fontSize: scale(16),
    color: Colors.gray600,
  },
  errorText: {
    textAlign: 'center',
    marginTop: scale(40),
    fontSize: scale(16),
    color: Colors.red,
  },
});
