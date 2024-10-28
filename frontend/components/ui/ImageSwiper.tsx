/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, FlatList, Image, Dimensions, StyleSheet} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ImageSwiper = ({images}: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewRef = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.imageContainer}>
            <Image source={{uri: item.uri}} style={styles.image} />
          </View>
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        ref={flatListRef}
      />
      <View style={styles.pagination}>
        {images.map((_: any, index: React.Key | null | undefined) => (
          <View
            key={index}
            style={[styles.dot, {opacity: index === currentIndex ? 1 : 0.3}]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: screenWidth * 0.85,
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#035ec5',
    margin: 5,
  },
});

export default ImageSwiper;
