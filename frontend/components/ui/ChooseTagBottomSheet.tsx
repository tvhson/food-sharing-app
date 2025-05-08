/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Colors from '../../global/Color';
import {FoodType} from '../../screens/CreatePostScreen';
import Modal from 'react-native-modal';
import React from 'react';
import {getFontFamily} from '../../utils/fonts';

const ChooseTagBottomSheet = (props: any) => {
  const {isVisible, setVisible, setType, selectedType, isHome} = props;

  const types = !isHome
    ? Object.values(FoodType).filter(type => type !== FoodType.ALL)
    : Object.values(FoodType);

  const handleSelect = (type: FoodType) => {
    setType(type);
    setVisible(false);
  };

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
        <View style={styles.barIcon} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>Chọn loại thực phẩm</Text>
        </View>

        <View style={styles.optionContainer}>
          {types.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selectedType === item && styles.selectedOption,
              ]}
              onPress={() => handleSelect(item)}>
              <Text
                style={{
                  fontSize: 16,
                  color:
                    selectedType === item ? Colors.greenPrimary : Colors.black,
                  fontFamily: getFontFamily('medium'),
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default ChooseTagBottomSheet;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 100,
    paddingBottom: 20,
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
  optionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#f0f8f5',
  },
});
