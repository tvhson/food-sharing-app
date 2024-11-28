/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {RootState} from '../../redux/Store';
import {useSelector} from 'react-redux';

const ChooseTagBottomSheet = (props: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);

  const {isVisible, setVisible} = props;

  const handleSave = () => {};

  return (
    <Modal
      style={styles.modal}
      hideModalContentWhileAnimating={true}
      avoidKeyboard={true}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      isVisible={isVisible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.4}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      swipeDirection={['down', 'left', 'right']}
      onSwipeComplete={() => setVisible(false)}
      propagateSwipe={true}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={{position: 'absolute', right: 25, top: 25}}>
          <Text
            style={{
              color: Colors.greenPrimary,
              fontFamily: getFontFamily('regular'),
              fontSize: 20,
            }}>
            Lưu
          </Text>
        </TouchableOpacity>
        <View style={styles.barIcon} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Chọn loại thực phẩm</Text>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseTagBottomSheet;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 5,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: '#bbb',
    borderRadius: 3,
    alignSelf: 'center',
  },
  panelTitle: {
    marginTop: 10,
    fontSize: 20,
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
  },
});
