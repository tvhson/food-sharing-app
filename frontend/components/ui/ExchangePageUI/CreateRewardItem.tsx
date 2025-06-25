import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-paper';
import Colors from '../../../global/Color';
import screenWidth from '../../../global/Constant';
import {RewardList} from '../../../screens/ManageReward/CreateRewardScreen';
import {getFontFamily} from '../../../utils/fonts';
import {moderateScale, scale} from '../../../utils/scale';
import {CustomInput} from '../CustomInput/CustomInput';

const CreateRewardItem = (props: {
  item: any;
  index: number;
  remove: any;
  isDisable: boolean;
  setUploadPhoto: any;
}) => {
  const {item, index, remove, isDisable, setUploadPhoto} = props;

  const {
    control,
    formState: {errors},
  } = useFormContext<RewardList>();

  return (
    <View
      style={{
        backgroundColor: Colors.greenPrimary,
        padding: scale(30),
        paddingHorizontal: scale(10),
        alignItems: 'center',
        borderRadius: scale(10),
        justifyContent: 'center',
        gap: scale(10),
        flexDirection: 'row',
        marginVertical: scale(15),
      }}>
      <TouchableOpacity
        style={{position: 'absolute', top: scale(5), right: scale(5)}}
        disabled={isDisable}
        onPress={() => remove(index)}>
        <Icon source={'close'} size={24} color={Colors.white} />
      </TouchableOpacity>
      <Controller
        control={control}
        name={`rewards.${index}.imageUrl`}
        rules={{required: true}}
        render={({field: {onChange, value}, formState: {errors}}) => {
          const error = errors.rewards?.[index]?.imageUrl;
          return (
            <View
              style={{
                width: screenWidth / 3,
                height: screenWidth / 3,
                borderRadius: scale(20),
                overflow: 'hidden',
                backgroundColor: Colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: error ? Colors.red : Colors.gray500,
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
                      fontSize: moderateScale(16),
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
      <View style={{flex: 1, gap: scale(10)}}>
        <CustomInput
          controller={{
            name: `rewards.${index}.rewardName`,
            control: control,
          }}
          errorText={errors.rewards?.[index]?.rewardName?.message}
          label="Tên quà"
        />
        <CustomInput
          controller={{
            name: `rewards.${index}.pointsRequired`,
            control: control,
          }}
          errorText={errors.rewards?.[index]?.pointsRequired?.message}
          label="Số lượng Star Point"
          keyboardType="numeric"
        />
        <CustomInput
          controller={{
            name: `rewards.${index}.stockQuantity`,
            control: control,
          }}
          errorText={errors.rewards?.[index]?.stockQuantity?.message}
          label="Số lượng quà"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

export default CreateRewardItem;
