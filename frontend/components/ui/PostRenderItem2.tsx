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
import Swiper from 'react-native-swiper';

const PostRenderItem2 = () => {
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
      <View style={{flexDirection: 'row'}}>
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
      </View>
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
          }}>
          <Swiper
            width={screenWidth * 0.85}
            height={screenWidth}
            containerStyle={{
              borderRadius: 20,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.background,
            }}>
            {images.map((item, index) => (
              <View key={index} style={{flex: 1}}>
                <Image
                  source={{uri: item.uri}}
                  style={{
                    width: screenWidth * 0.85,
                    height: screenWidth,
                  }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </Swiper>
        </View>

        {/* <Text
            style={{
              fontSize: 16,
              fontFamily: getFontFamily('regular'),
              color: Colors.text,
              marginTop: 10,
            }}>
            Hey pals, guess what? 🎉 I've just wrapped up crafting these
            mind-blowing 3D wallpapers, drenched in the coolest of the cool
            colors! 🌈💎
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: getFontFamily('regular'),
              color: Colors.text,
              marginTop: 10,
            }}>
            Tag: #Food #Vegeterian
          </Text> */}
      </View>
    </View>
  );
};

export default PostRenderItem2;

const styles = StyleSheet.create({});
