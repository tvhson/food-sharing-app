/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  RefreshControl,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import PostData from '../../data/PostData';
import {FlatList} from 'react-native-gesture-handler';
import screenWidth from '../../../global/Constant';

const ListPost = () => {
  const mockData = PostData;
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    console.log('refresh');
  };

  return (
    <View>
      <FlatList
        data={mockData}
        keyExtractor={item => item.id}
        numColumns={3} // This makes 3 items per row
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => (
          <View
            style={{
              flex: 1,
              padding: 2,
              width: screenWidth / 3,
              height: screenWidth / 3,
            }}>
            <TouchableOpacity>
              <Image
                source={{uri: item.imageUrl}}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default React.memo(ListPost);
