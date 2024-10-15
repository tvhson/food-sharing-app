/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {getFontFamily} from '../utils/fonts';
import Colors from '../global/Color';
import {Icon} from 'react-native-paper';

const FoodPreferenceScreen = () => {
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

  const handleSave = () => {
    console.log(selectedTags);
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
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
          Sở thích ăn uống{' '}
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
            textAlign: 'center',
          }}>
          Chọn các loại thực phẩm bạn thích ăn
        </Text>
        <View
          style={{
            marginTop: 20,
            flex: 1,
          }}>
          <View
            style={{
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
        </View>

        <TouchableOpacity onPress={handleSave}>
          <View
            style={{
              backgroundColor: Colors.greenPrimary,
              padding: 16,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: 20,
              right: 20,
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: getFontFamily('black'),
                color: Colors.white,
              }}>
              Lưu
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FoodPreferenceScreen;

const styles = StyleSheet.create({});
