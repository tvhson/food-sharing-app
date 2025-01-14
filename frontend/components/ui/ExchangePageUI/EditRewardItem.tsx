/* eslint-disable react-native/no-inline-styles */
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../../../global/Color';
import {Icon} from 'react-native-paper';
import {getFontFamily} from '../../../utils/fonts';
import {Controller, useFormContext} from 'react-hook-form';
import {Image} from 'react-native';
import {IReward} from '../../../api/LoyaltyApi';

const EditRewardItem = (props: {setUploadPhoto: any}) => {
  const {setUploadPhoto} = props;

  const {control, getValues} = useFormContext<IReward>();

  console.log(getValues());

  return (
    <View
      style={{
        backgroundColor: Colors.greenPrimary,
        padding: 30,
        borderRadius: 20,
        justifyContent: 'center',
        gap: 10,
      }}>
      <Controller
        control={control}
        name={'imageUrl'}
        rules={{required: true}}
        render={({field: {onChange, value}}) => {
          return (
            <View
              style={{
                width: 250,
                height: 170,
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
                    style={{width: 170, height: 170}}
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
                    setUploadPhoto(1);
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
      <View style={{gap: 10}}>
        <Controller
          control={control}
          name={'rewardName'}
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
          name={'pointsRequired'}
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
          name={'stockQuantity'}
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
              }}
              placeholder="Số lượng quà"
              value={value ? value.toString() : '0'}
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

export default EditRewardItem;
