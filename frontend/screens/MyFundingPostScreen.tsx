import {Button, IconButton} from 'react-native-paper';
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  clearMyFundingPosts,
  setMyFundingPosts,
} from '../redux/OrganizationPostReducer';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../global/Color';
import {OrganizationPost} from '../components/ui/OrganizationPost';
import {RootState} from '../redux/Store';
import {getOrganizationPostOfUser} from '../api/OrganizationPostApi';
import {useSharedValue} from 'react-native-reanimated';

export const MyFundingPostScreen = ({navigation}: any) => {
  const FundingPostData = useSelector(
    (state: RootState) => state.fundingPost.MyPosts,
  );
  const token = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();
  const shuffleBack = useSharedValue(false);
  const [currentCards, setCurrentCards] = useState(FundingPostData);

  useEffect(() => {
    shuffleBack.value = false;
  }, [shuffleBack]);

  useEffect(() => {
    setCurrentCards(FundingPostData);
  }, [FundingPostData]);

  const getFundingPost = async () => {
    try {
      const response: any = await getOrganizationPostOfUser(token.toString());
      if (response.status === 200) {
        const data = response.data;
        dispatch(clearMyFundingPosts());
        dispatch(setMyFundingPosts(data));
        setCurrentCards(response.data);
      } else {
        console.log(response);
        throw new Error(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: Colors.button,
          borderBottomWidth: 1,
          borderBlockColor: '#ccc',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Funding
        </Text>
        <IconButton
          icon="chevron-left"
          size={40}
          iconColor="white"
          style={{position: 'absolute', left: 10}}
          onPress={() => navigation.goBack()}
        />
      </View>
      {currentCards.map((item, index) => (
        <OrganizationPost
          item={item}
          key={index}
          index={index}
          shuffleBack={shuffleBack}
          navigation={navigation}
        />
      ))}
      <Button
        icon="reload"
        mode="contained"
        buttonColor={Colors.postTitle}
        style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}
        rippleColor={'#ffa5a5'}
        onPress={() => getFundingPost()}>
        Reload
      </Button>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateFundingPost')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: Colors.button,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, color: 'white'}}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
