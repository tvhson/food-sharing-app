/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {getFontFamily} from '../../utils/fonts';
import Colors from '../../global/Color';
import {Icon} from 'react-native-paper';
import ImageSwiper from './ImageSwiper';

const PostRenderItem2 = (props: any) => {
  const {item, setCommentPostId, setShowComment, navigation} = props;

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
  const screenWidth = Dimensions.get('window').width;
  const [liked, setLiked] = React.useState(false);

  const handleLiked = () => {
    setLiked(!liked);
  };

  const handleShowComment = () => {
    setShowComment(true);
    //setCommentPostId(item.id);
  };
  const handleGoToDetail = () => {
    navigation.navigate('PostDetail2');
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        width: screenWidth * 0.9,
        alignSelf: 'center',
        marginTop: 16,
        padding: 16,
        borderRadius: 30,
      }}>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={handleGoToDetail}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/MealLogo.png')}
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
              source={require('../../assets/images/ion_earth.png')}
              style={{width: 20, height: 20}}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: getFontFamily('regular'),
                color: Colors.grayText,
                marginLeft: 4,
              }}>
              2 hours ago
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.background,
            borderRadius: 20,
            width: 40,
            height: 40,
            alignSelf: 'center',
            position: 'absolute',
            right: 0,
          }}>
          <Icon
            source={'dots-horizontal'}
            size={30}
            color={Colors.grayPrimary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/foodIcon.png')}
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
              Banana
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/distance.png')}
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
              2 kms away
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/clock.png')}
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
              Expired in 2 days
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/part.png')}
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
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/scales.png')}
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
              5 kg
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            source={require('../../assets/images/pickUp.png')}
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
              Pick up at 5:00 PM
            </Text>
          </View>
        </View>
        <View
          style={{
            width: screenWidth * 0.85,
            height: screenWidth,
            borderRadius: 20,
            marginTop: 10,
            overflow: 'hidden',
            alignSelf: 'center',
            pointerEvents: 'box-none',
          }}>
          <ImageSwiper images={images} />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
          <TouchableOpacity onPress={handleLiked}>
            <Image
              source={
                liked
                  ? require('../../assets/images/liked.png')
                  : require('../../assets/images/like.png')
              }
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={handleShowComment}>
            <Image
              source={require('../../assets/images/comment.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Image
              source={require('../../assets/images/share.png')}
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

export default PostRenderItem2;

const styles = StyleSheet.create({});
