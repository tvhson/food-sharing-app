import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {moderateScale, scale} from '../../utils/scale';

import Colors from '../../global/Color';
import {Icon} from '@rneui/themed';
import Modal from 'react-native-modal';
import {getFontFamily} from '../../utils/fonts';
import screenWidth from '../../global/Constant';
import {timeAgo} from '../../utils/helper';

const ImageDetailModal = (props: {
  isVisible: number | boolean;
  setVisible: (visible: number | boolean) => void;
  item: any;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {item, user} = props.item || {};

  const onViewRef = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});
  const createdDate = timeAgo(item?.createdDate || new Date());

  return (
    <Modal
      isVisible={Boolean(props.isVisible)}
      onBackdropPress={() => props.setVisible(0)}
      onBackButtonPress={() => props.setVisible(0)}
      animationIn="fadeIn"
      animationOut="fadeOut"
      propagateSwipe={true}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <FlatList
          data={item?.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.imageContainer}>
              <Image source={{uri: item.path || item}} style={styles.image} />
            </View>
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
        {/* Back Button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 200,
            padding: 10,
            elevation: 5,
          }}
          onPress={() => props.setVisible(0)}>
          <Icon name="arrow-back" type="ionicon" color="white" size={20} />
        </TouchableOpacity>

        {/* Pagination Dots */}
        {item?.images?.length > 1 && (
          <View style={styles.pagination}>
            {item?.images.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {opacity: index === currentIndex ? 1 : 0.3},
                ]}
              />
            ))}
          </View>
        )}
        {/* Info Overlay */}
        <View style={styles.overlay}>
          <View style={styles.headerRow}>
            <Text
              style={{
                color: Colors.white,
                fontSize: moderateScale(20),
                fontFamily: getFontFamily('bold'),
              }}>
              {user?.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
              gap: 10,
            }}>
            <Image
              source={require('../../assets/images/ion_earth.png')}
              style={{width: scale(24), height: scale(24)}}
            />
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: Colors.white,
              }}>
              {createdDate}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
              gap: 10,
            }}>
            <Image
              source={require('../../assets/images/bowl-food.png')}
              style={{width: scale(24), height: scale(24)}}
            />
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: Colors.white,
              }}>
              {item?.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
              gap: 10,
            }}>
            <Icon
              name="location-outline"
              type="ionicon"
              size={24}
              color="white"
            />
            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: getFontFamily('regular'),
                color: Colors.white,
              }}>
              {' '}
              Cách bạn{' '}
              {item?.distance < 0.1
                ? `${(item?.distance * 1000).toFixed(2)}m`
                : `${item?.distance.toFixed(2)}km`}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageDetailModal;
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'black',
    overflow: 'hidden',
    justifyContent: 'center',
    flex: 1,
  },
  imageContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    margin: 4,
  },
});
