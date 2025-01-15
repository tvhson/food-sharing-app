/* eslint-disable react-native/no-inline-styles */
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../../../global/Color';
import {Icon} from 'react-native-paper';
import {getFontFamily} from '../../../utils/fonts';
import {Controller, useFieldArray, useFormContext} from 'react-hook-form';
import {RewardList} from '../../../screens/ManageReward/CreateRewardScreen';
import {Image} from 'react-native';
import screenWidth from '../../../global/Constant';

const CreateRewardItem = (props: {
  item: any;
  index: number;
  remove: any;
  isDisable: boolean;
  setUploadPhoto: any;
}) => {
  const {item, index, remove, isDisable, setUploadPhoto} = props;

  const {control} = useFormContext<RewardList>();

  return (
    <View
      style={{
        backgroundColor: Colors.greenPrimary,
        padding: 30,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderRadius: 20,
        justifyContent: 'center',
        gap: 10,
        flexDirection: 'row',
        marginVertical: 15,
      }}>
      <TouchableOpacity
        style={{position: 'absolute', top: 5, right: 5}}
        disabled={isDisable}
        onPress={() => remove(index)}>
        <Icon source={'close'} size={30} color={Colors.white} />
      </TouchableOpacity>
      <Controller
        control={control}
        name={`rewards.${index}.imageUrl`}
        rules={{required: true}}
        render={({field: {onChange, value}}) => {
          return (
            <View
              style={{
                width: screenWidth / 3,
                height: screenWidth / 3,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {value ? (
                <View>
                  <Image
                    source={{uri: value}}
                    style={{width: screenWidth / 3, height: screenWidth / 3}}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      onChange('');
                    }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: Colors.black,
                      padding: 5,
                      borderRadius: 20,
                    }}>
                    <Icon source={'close'} size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => {
                    setUploadPhoto(index + 1);
                  }}>
                  <Icon
                    source={'camera'}
                    size={50}
                    color={Colors.greenPrimary}
                  />
                  <Text
                    style={{
                      color: Colors.greenPrimary,
                      fontSize: 16,
                      fontFamily: getFontFamily('bold'),
                    }}>
                    Thêm ảnh
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
      <View style={{flex: 1, gap: 10}}>
        <Controller
          control={control}
          name={`rewards.${index}.rewardName`}
          rules={{required: true}}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                paddingHorizontal: 10,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
                color: Colors.black,
                height: 40,
              }}
              placeholder="Tên quà"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name={`rewards.${index}.pointsRequired`}
          rules={{required: true}}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                paddingHorizontal: 10,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
                color: Colors.black,
                height: 40,
              }}
              placeholder="Số lượng Star Point"
              value={value ? value.toString() : ''}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />
        <Controller
          control={control}
          name={`rewards.${index}.stockQuantity`}
          rules={{required: true}}
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              style={{
                backgroundColor: Colors.white,
                borderRadius: 10,
                paddingHorizontal: 10,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
                color: Colors.black,
                height: 40,
              }}
              placeholder="Số lượng quà"
              value={value ? value.toString() : ''}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />
      </View>
    </View>
  );
};

export default CreateRewardItem;
