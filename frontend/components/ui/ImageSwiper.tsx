/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-paper';
import {getFontFamily} from '../../utils/fonts';
import {Icon} from '@rneui/themed';
import Colors from '../../global/Color';

const screenWidth = Dimensions.get('window').width;

const ImageSwiper = (props: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const onViewRef = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const removeImage = () => {
    const newImages = props.images.filter(
      (_: any, index: number) => index !== currentIndex,
    );
    const newIndex =
      currentIndex === props.images.length - 1 && currentIndex > 0
        ? currentIndex - 1
        : currentIndex;
    setCurrentIndex(newIndex);
    props.setImageUpload(newImages);
    if (newImages.length > 0) {
      flatListRef.current?.scrollToIndex({index: newIndex, animated: true});
    }
  };

  return (
    <View style={[styles.container, props.style]}>
      <FlatList
        data={props.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={[styles.imageContainer, props.style]}>
            <Image source={{uri: item.uri || item.path}} style={styles.image} />
          </View>
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        ref={flatListRef}
      />
      {props.images && props.images.length > 1 && (
        <View style={styles.pagination}>
          {props.images.map((_: any, index: React.Key | null | undefined) => (
            <View
              key={index}
              style={[styles.dot, {opacity: index === currentIndex ? 1 : 0.3}]}
            />
          ))}
        </View>
      )}

      {props.isCreatePost && (
        <TouchableOpacity
          onPress={() => {
            props.setIsUploadVisible(!props.isUploadVisible);
          }}
          style={{
            position: 'absolute',
            bottom: 30,
            flexDirection: 'row',
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: 'gray',
            opacity: 0.7,
            alignItems: 'center',
            padding: 10,
          }}>
          <Icon name="camera" type="ionicon" size={20} color={Colors.white} />
          <Text
            style={{
              color: 'white',
              marginLeft: 10,
              fontFamily: getFontFamily('bold'),
            }}>
            Thêm ảnh
          </Text>
        </TouchableOpacity>
      )}
      {props.isCreatePost && (
        <TouchableOpacity
          onPress={removeImage}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'gray',
            opacity: 0.7,
            zIndex: 1,
          }}>
          <Icon name="close" type="ionicon" size={20} color="white" />
        </TouchableOpacity>
      )}
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
