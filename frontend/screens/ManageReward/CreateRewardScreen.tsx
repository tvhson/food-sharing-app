import {FormProvider, useFieldArray, useForm} from 'react-hook-form';
import {createRewards, IReward} from '../../api/LoyaltyApi';
/* eslint-disable react-native/no-inline-styles */
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {useNotifications} from 'react-native-notificated';
import {Icon} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {uploadPhoto} from '../../api/UploadPhotoApi';
import CreateRewardItem from '../../components/ui/ExchangePageUI/CreateRewardItem';
import UploadPhoto from '../../components/ui/UploadPhoto';
import Colors from '../../global/Color';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {useLoading} from '../../utils/LoadingContext';
import {
  createRewardValidate,
  CreateRewardValidateSchema,
} from '../../utils/schema/create-reward';
import Header from '../../components/ui/Header';
import {scale} from '../../utils/scale';

export type RewardList = {
  rewards: IReward[];
};

const CreateRewardScreen = ({navigation}: any) => {
  const {notify} = useNotifications();
  const {showLoading, hideLoading} = useLoading();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const [isUploadVisible, setIsUploadVisible] = React.useState(0);
  const methods = useForm<CreateRewardValidateSchema>({
    resolver: zodResolver(createRewardValidate()),
    defaultValues: {
      rewards: [
        {
          rewardName: '',
          imageUrl: '',
          pointsRequired: '',
          stockQuantity: '',
        },
      ],
    },
    mode: 'onChange',
  });

  const {fields, append, remove} = useFieldArray({
    control: methods.control,
    name: 'rewards',
  });

  const onSubmit = async (data: CreateRewardValidateSchema) => {
    const response: any = await createRewards(
      {
        rewards: data.rewards.map(item => ({
          ...item,
          pointsRequired: Number(item.pointsRequired),
          stockQuantity: Number(item.stockQuantity),
        })),
      },
      accessToken,
    );
    if (response.status === 200) {
      notify('success', {
        params: {description: 'Tạo quà thành công', title: 'Thành công'},
      });
      navigation.goBack();
    } else {
      notify('error', {
        params: {description: 'Tạo quà không thành công', title: 'Lỗi'},
      });
    }
  };

  const onError = () => {
    notify('error', {
      params: {description: 'Vui lòng điền đầy đủ thông tin', title: 'Lỗi'},
    });
  };

  const postImage = async (image: any) => {
    const dataForm = new FormData();
    dataForm.append('file', {
      uri: image.path,
      type: image.mime || 'image/jpeg',
      name: image.filename || 'image.jpg',
    });
    const response: any = await uploadPhoto(dataForm, accessToken);
    if (response.status === 200) {
      methods.setValue(
        `rewards.${isUploadVisible - 1}.imageUrl`,
        response.data[0],
        {
          shouldValidate: true,
        },
      );
    } else {
      notify('error', {
        params: {
          description: 'Lỗi không thể tải ảnh lên',
          title: 'Lỗi',
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <UploadPhoto
        isVisible={isUploadVisible}
        setVisible={setIsUploadVisible}
        height={300}
        width={350}
        isCircle={false}
        postImage={postImage}
        isMultiple={false}
      />
      <Header title="Tạo quà" navigation={navigation} />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: scale(10),
          paddingTop: scale(10),
        }}>
        <FormProvider {...methods}>
          {fields.map((item, index) => (
            <CreateRewardItem
              key={item.id || index}
              item={item}
              index={index}
              remove={remove}
              isDisable={fields.length === 1}
              setUploadPhoto={setIsUploadVisible}
            />
          ))}
        </FormProvider>

        <TouchableOpacity
          onPress={() =>
            append({
              rewardName: '',
              stockQuantity: '',
              pointsRequired: '',
              imageUrl: '',
            })
          }
          style={{
            alignItems: 'center',
            backgroundColor: Colors.greenPrimary,
            marginTop: scale(20),
            marginBottom: scale(200),
            borderRadius: scale(25),
            width: scale(50),
            height: scale(50),
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Icon source={'plus'} size={scale(30)} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          padding: scale(20),
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
          width: '100%',
          elevation: 20,
        }}>
        <TouchableOpacity
          onPress={async () => {
            showLoading();
            await methods.handleSubmit(onSubmit, onError)();
            hideLoading();
          }}
          style={{
            backgroundColor: Colors.greenPrimary,
            padding: scale(10),
            borderRadius: scale(10),
            paddingHorizontal: scale(50),
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: scale(16),
              fontFamily: getFontFamily('semibold'),
            }}>
            Lưu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateRewardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
