/* eslint-disable react-native/no-inline-styles */
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from '../../../global/Color';
import {Icon} from 'react-native-paper';
import {getFontFamily} from '../../../utils/fonts';
import {Controller, useFormContext} from 'react-hook-form';
import {Image} from 'react-native';
import {IReward} from '../../../api/LoyaltyApi';
import screenWidth from '../../../global/Constant';
import {EditRewardValidateSchema} from '../../../utils/schema/create-reward';
import {moderateScale, scale} from '../../../utils/scale';
import {CustomInput} from '../CustomInput/CustomInput';
import {CustomText} from '../CustomText';

interface IEditRewardItem {
  setUploadPhoto: (value: number) => void;
}

const EditRewardItem = (props: IEditRewardItem) => {
  const {setUploadPhoto} = props;

  const {
    control,
    formState: {errors},
    getValues,
  } = useFormContext<EditRewardValidateSchema>();

  console.log('getValues', getValues());

  return (
    <View
      style={{
        justifyContent: 'center',
        gap: scale(10),
        alignItems: 'center',
      }}>
      <Controller
        control={control}
        name={'imageUrl'}
        rules={{required: true}}
        render={({field: {onChange, value}}) => {
          return (
            <>
              <View
                style={{
                  width: screenWidth * 0.6,
                  height: scale(170),
                  borderRadius: scale(20),
                  overflow: 'hidden',
                  backgroundColor: Colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {value ? (
                  <View>
                    <Image
                      source={{uri: value}}
                      style={{width: scale(170), height: scale(170)}}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        onChange('');
                      }}
                      style={{
                        position: 'absolute',
                        top: scale(10),
                        right: scale(10),
                        backgroundColor: Colors.black,
                        padding: scale(5),
                        borderRadius: scale(20),
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
                        fontSize: moderateScale(16),
                        fontFamily: getFontFamily('bold'),
                      }}>
                      Thêm ảnh
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.imageUrl && (
                <CustomText
                  fontType="medium"
                  size={14}
                  textColor={Colors.red}
                  style={{
                    marginTop: scale(4),
                    paddingHorizontal: scale(10),
                  }}>
                  {errors.imageUrl?.message}
                </CustomText>
              )}
            </>
          );
        }}
      />
      <View style={{gap: scale(10)}}>
        <CustomInput
          controller={{control, name: 'rewardName'}}
          label="Tên quà"
          errorText={errors.rewardName?.message}
          labelColor={Colors.gray600}
        />
        <CustomInput
          controller={{control, name: 'pointsRequired'}}
          label="Số lượng Star Point"
          errorText={errors.pointsRequired?.message}
          keyboardType="numeric"
          labelColor={Colors.gray600}
        />

        <CustomInput
          controller={{control, name: 'stockQuantity'}}
          label="Số lượng quà"
          errorText={errors.stockQuantity?.message}
          keyboardType="numeric"
          labelColor={Colors.gray600}
        />
      </View>
    </View>
  );
};

export default EditRewardItem;
