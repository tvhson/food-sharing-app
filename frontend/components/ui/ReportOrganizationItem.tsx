import {Image} from '@rneui/themed';
import React from 'react';
import {Linking, Text, TouchableWithoutFeedback, View} from 'react-native';
import {IGetGroupResponse} from '../../api/GroupApi';
import {Route} from '../../constants/route';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {moderateScale, scale} from '../../utils/scale';

interface IReportOrganizationItem {
  item: IGetGroupResponse;
  navigation: any;
}

const ReportOrganizationItem = ({
  item,
  navigation,
}: IReportOrganizationItem) => {
  const handleOnPress = () => {
    navigation.navigate(Route.OrganizationPostDetail2, {item});
  };

  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <View
        style={{
          padding: scale(10),
          marginVertical: scale(4),
          backgroundColor: 'white',
          borderRadius: scale(8),
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Image
          source={{
            uri: item.imageUrl
              ? item.imageUrl
              : 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={{
            width: scale(150),
            height: scale(150),
            borderRadius: scale(8),
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginLeft: scale(8),
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: moderateScale(22),
                fontFamily: getFontFamily('bold'),
                color: Colors.postTitle,
              }}>
              {item.name}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  fontSize: moderateScale(16),
                  color: Colors.grayText,
                }}>
                <Text
                  style={{fontFamily: getFontFamily('bold'), color: 'black'}}>
                  {'\u2022'} Mô tả:{' '}
                </Text>
                {item.description}
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  color: Colors.grayText,
                }}>
                {new Date(item.createdDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default ReportOrganizationItem;
