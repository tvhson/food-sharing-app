/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Animated,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IGroup, IGroupPost} from '../../global/type';
import React, {useState} from 'react';
import {moderateScale, scale, verticalScale} from '../../utils/scale';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Icon} from 'react-native-paper';
import {getFontFamily} from '../../utils/fonts';
import {screenHeight} from '../../global/Constant';
import {useNavigation} from '@react-navigation/native';

const groupInfo: IGroup = {
  id: 1,
  name: 'Group 1',
  description: 'Description 1',
  image: 'https://tvhson.s3.amazonaws.com/1746500437226_image.jpeg',
};

const groupPosts: IGroupPost[] = [
  {
    id: 1,
    description: 'Description 1',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    description: 'Description 2',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    description: 'Description 3',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    description: 'Description 4',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 5,
    description: 'Description 5',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 1,
    description: 'Description 1',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    description: 'Description 2',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    description: 'Description 3',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    description: 'Description 4',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 5,
    description: 'Description 5',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 1,
    description: 'Description 1',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    description: 'Description 2',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    description: 'Description 3',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    description: 'Description 4',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 5,
    description: 'Description 5',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 1,
    description: 'Description 1',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    description: 'Description 2',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    description: 'Description 3',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    description: 'Description 4',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 5,
    description: 'Description 5',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 1,
    description: 'Description 1',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    description: 'Description 2',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    description: 'Description 3',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    description: 'Description 4',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 5,
    description: 'Description 5',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 1,
    description: 'Description 1',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 2,
    description: 'Description 2',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 3,
    description: 'Description 3',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 4,
    description: 'Description 4',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 5,
    description: 'Description 5',
    image: '',
    createdAt: '',
    updatedAt: '',
  },
];

const IMAGE_HEIGHT = screenHeight * 0.25;

const GroupHomeScreen = ({route}: {route: any}) => {
  const navigation = useNavigation();
  //   const {group}: {group: IGroup} = route.params;
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > IMAGE_HEIGHT - 60);
  };

  const renderStickyHeader = () => (
    <View style={styles.stickyHeader}>
      <Text style={styles.title}>{groupInfo.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showStickyHeader && renderStickyHeader()}
      <TouchableOpacity
        style={styles.backButtonHeader}
        onPress={() => navigation.goBack()}>
        <Icon source="arrow-left" size={20} color="black" />
      </TouchableOpacity>
      <FlatList
        data={groupPosts}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image source={{uri: groupInfo.image}} style={styles.image} />
            <Text style={styles.title}>{groupInfo.name}</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.postItem}>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default GroupHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    padding: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
