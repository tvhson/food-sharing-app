/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {getFontFamily} from '../utils/fonts';
import Colors from '../global/Color';
import {Icon} from 'react-native-paper';

const FoodPreferenceScreen = () => {
  const tags = [
    'Animal Products',
    'Vegetables',
    'Fruits',
    'Beverages',
    'Grains',
    'Dairy Products',
    'Spices',
    'Seafood',
    'Bakery Products',
    'Processed Foods',
    'Nuts',
    'Beans',
    'Vegetarian Products',
    'Fast Foods',
    'Snacks',
    'Frozen Foods',
  ];

  const vegetarianTags = [
    'Vegetables',
    'Fruits',
    'Beverages',
    'Grains',
    'Dairy Products',
    'Spices',
    'Bakery Products',
    'Processed Foods',
    'Nuts',
    'Beans',
    'Vegetarian Products',
    'Fast Foods',
    'Snacks',
    'Frozen Foods',
  ];
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const handleTagPress = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(item => item !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <View style={{flex: 1}}>
        <TouchableOpacity style={{marginTop: 20, marginLeft: 20}}>
          <Icon source={'arrow-left'} size={30} color={Colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 30,
            fontFamily: getFontFamily('black'),
            color: Colors.text,
            margin: 16,
            alignSelf: 'center',
          }}>
          Your Diet Preferences{' '}
          <Image
            source={require('../assets/images/yummy.png')}
            style={{width: 30, height: 30}}
          />
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: getFontFamily('regular'),
            color: Colors.grayText,
            marginHorizontal: 16,
          }}>
          Select the tags that you want to include in your diet.
        </Text>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              marginTop: 30,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                onPress={() => handleTagPress(tag)}
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: selectedTags.includes(tag)
                    ? Colors.greenLight2
                    : Colors.gray,
                  margin: 8,
                  paddingHorizontal: 16,
                  borderWidth: 1,
                  borderColor: selectedTags.includes(tag)
                    ? Colors.greenPrimary
                    : Colors.gray,
                }}>
                <Icon
                  source={selectedTags.includes(tag) ? 'check' : 'plus'}
                  size={24}
                  color={Colors.black}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: getFontFamily('regular'),
                    color: Colors.black,
                    marginLeft: 8,
                  }}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
              flex: 1,
            }}>
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: Colors.greenPrimary,
                  padding: 16,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                  marginRight: 20,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: getFontFamily('black'),
                    color: Colors.white,
                  }}>
                  Submit
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodPreferenceScreen;

const styles = StyleSheet.create({});
