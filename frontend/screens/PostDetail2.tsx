/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import Header from '../components/ui/Header';
import {Icon} from 'react-native-paper';
import Colors from '../global/Color';
import {getFontFamily} from '../utils/fonts';
import ImageSwiper from '../components/ui/ImageSwiper';
import screenWidth from '../global/Constant';
import CommentItem from '../components/ui/CommentItem';

const images = [
  {
    uri: 'https://i.pinimg.com/736x/2b/8d/b3/2b8db3475614637b47fde73b0723fa34.jpg',
    title: 'Hello Swiper',
    caption: 'Hello Swiper',
  },
  {
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaEj3BtwAHp34BuEm6r7OKJJQc6OuQuDAGXg&s',
    title: 'Beautiful',
    caption: 'Beautiful',
  },
  {
    uri: 'https://5.imimg.com/data5/WM/OX/MY-33847593/doremon-cartoon-wallpaper-500x500.jpg',
    title: 'And simple',
    caption: 'And simple',
  },
];

const CommentData = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: require('../assets/images/user.png'),
    },
    content: 'Bình luận 1',
    time: '1 giờ trước',
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'Nguyễn Văn B',
      avatar: require('../assets/images/user.png'),
    },
    content: 'Bình luận 2',
    time: '2 giờ trước',
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: require('../assets/images/user.png'),
    },
    content: 'Bình luận 3',
    time: '3 giờ trước',
  },
];

const PostDetail2 = ({route, navigation}: any) => {
  const [liked, setLiked] = React.useState(false);
  const commentInputRef = useRef<TextInput>(null);
  const item = route.params.item;
  const locationStart = {
    latitude: route.params.location.latitude,
    longitude: route.params.location.longitude,
  };
  const locationEnd = {
    latitude: route.params.item.latitude,
    longitude: route.params.item.longitude,
  };
  const createdDate = route.params.createdDate;
  const distance = route.params.distance;
  const expiredString = route.params.expiredString;

  const handleLiked = () => {
    setLiked(!liked);
  };

  const handleShowComment = () => {
    //focust input comment
    commentInputRef.current?.focus();
  };

  const handleTagPress = (tag: string) => {
    console.log(`Tag ${tag} clicked`);
  };

  const handleDirection = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${locationStart.latitude},${locationStart.longitude}&destination=${locationEnd.latitude},${locationEnd.longitude}`;
    Linking.openURL(url);
  };

  const handleCreateComment = () => {};

  const tags = [
    'Sản phẩm động vật',
    'Rau củ',
    'Trái cây',
    'Đồ uống',
    'Ngũ cốc',
    'Sản phẩm từ sữa',
    'Gia vị',
    'Hải sản',
    'Sản phẩm từ lò nướng',
    'Thực phẩm chế biến',
    'Các loại hạt',
    'Đậu',
    'Sản phẩm chay',
    'Thức ăn nhanh',
    'Đồ ăn vặt',
    'Thực phẩm đông lạnh',
  ];

  const renderTags = () => {
    return tags.map((tag, index) => (
      <TouchableOpacity
        key={index}
        style={styles.tagButton}
        onPress={() => handleTagPress(tag)}>
        <Text style={styles.tagText}>#{tag}</Text>
      </TouchableOpacity>
    ));
  };

  const renderHeader = () => {
    return (
      <View style={{padding: 16}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/MealLogo.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <View style={{alignSelf: 'center', marginLeft: 16}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: getFontFamily('semibold'),
                color: Colors.text,
              }}>
              Nguyen Khoi
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../assets/images/ion_earth.png')}
                style={{width: 20, height: 20}}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.grayText,
                  marginLeft: 4,
                }}>
                {createdDate}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,

              height: 40,
              alignSelf: 'center',
              position: 'absolute',
              right: 0,
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={handleDirection}>
              <Icon source={'chat-processing'} size={30} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDirection}
              style={{marginLeft: 10}}>
              <Icon source={'directions'} size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/foodIcon.png')}
              style={{width: 25, height: 25}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.text,
                  marginLeft: 16,
                }}>
                {item.title}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/distance.png')}
              style={{width: 25, height: 25}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.text,
                  marginLeft: 16,
                }}>
                Cách bạn{' '}
                {distance < 0.1 ? `${distance * 1000}m` : `${distance}km`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/clock.png')}
              style={{width: 25, height: 25}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.text,
                  marginLeft: 16,
                }}>
                {expiredString === 'Hết hạn'
                  ? 'Hết hạn'
                  : `Hết hạn sau ${expiredString}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/part.png')}
              style={{width: 25, height: 25}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.text,
                  marginLeft: 16,
                }}>
                2 portions left
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/scales.png')}
              style={{width: 25, height: 25}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.text,
                  marginLeft: 16,
                }}>
                {item.weight} kg
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/pickUp.png')}
              style={{width: 25, height: 25}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('regular'),
                  color: Colors.text,
                  marginLeft: 16,
                }}>
                Lấy từ ngày{' '}
                {new Date(item.pickUpStartDate).toLocaleDateString()} đến ngày{' '}
                {new Date(item.pickUpEndDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 5,
            }}>
            <Image
              source={require('../assets/images/tag.png')}
              style={{width: 25, height: 25}}
            />
            <View style={styles.tagsContainer}>{renderTags()}</View>
          </View>
          <View
            style={{
              width: screenWidth * 0.85,
              height: screenWidth,
              borderRadius: 20,
              marginTop: 10,
              overflow: 'hidden',
              alignSelf: 'center',
            }}>
            <ImageSwiper images={images} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <TouchableOpacity onPress={handleLiked}>
              <Image
                source={
                  liked
                    ? require('../assets/images/liked.png')
                    : require('../assets/images/like.png')
                }
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={handleShowComment}>
              <Image
                source={require('../assets/images/comment.png')}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft: 10}}>
              <Image
                source={require('../assets/images/share.png')}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 10,
                fontFamily: getFontFamily('regular'),
                color: Colors.black,
                fontSize: 14,
              }}>
              {liked ? 'Bạn và 10 người khác' : '10 người'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="PostDetail2" navigation={navigation} />
      <FlatList
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<View style={{height: 70}} />}
        data={CommentData}
        renderItem={({item}) => <CommentItem comment={item} />}
        keyExtractor={item => item.id.toString()}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
          backgroundColor: Colors.white,
        }}>
        <TextInput
          ref={commentInputRef}
          multiline
          placeholder="Viết bình luận"
          style={{
            backgroundColor: Colors.background,
            borderRadius: 20,
            padding: 10,
            flex: 1,
          }}
        />
        <TouchableOpacity onPress={handleCreateComment}>
          <Image
            source={require('../assets/images/send.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostDetail2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    paddingHorizontal: 10,
  },
  tagText: {
    color: '#007bff',
    fontFamily: getFontFamily('regular'),
    fontSize: 16,
  },
});
