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
          rewardDescription: '',
          imageUrl: '',
          pointsRequired: 0,
          stockQuantity: 0,
        },
      ],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control: methods.control,
    name: 'rewards',
  });

  const onSubmit = async (data: RewardList) => {
    const response: any = await createRewards(data, accessToken);
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

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source={'arrow-left'} size={30} color={Colors.white} />
          </TouchableOpacity>
          <Text
            style={{
              color: Colors.white,
              fontSize: 20,
              fontFamily: getFontFamily('semibold'),
            }}>
            Tạo quà
          </Text>
        </View>
      </View>
    );
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
      {renderHeader()}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingTop: 10,
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
              rewardDescription: '',
              stockQuantity: 0,
              pointsRequired: 0,
              imageUrl: '',
            })
          }
          style={{
            alignItems: 'center',
            backgroundColor: Colors.greenPrimary,
            marginTop: 20,
            marginBottom: 200,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Icon source={'plus'} size={30} color={Colors.white} />
        </TouchableOpacity>
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          padding: 20,
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
            padding: 10,
            borderRadius: 10,
            paddingHorizontal: 50,
          }}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 16,
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
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.greenPrimary,
  },
});
