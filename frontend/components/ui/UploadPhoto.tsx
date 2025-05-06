import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Colors from '../../global/Color';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../../utils/fonts';

const {useNotifications} = createNotifications();

function UploadPhoto(props: any) {
  const {notify} = useNotifications();

  const toggleModal = () => {
    props.setVisible(!props.isVisible);
  };

  const takePhotoFromCamera = () => {
    toggleModal();
    ImagePicker.openCamera({
      cropping: true,
      cropperCircleOverlay: props.isCircle,
    })
      .then(image => {
        props.postImage(image);
        console.log(image);
        // props.setPhoto(image.path);
      })
      .catch(() => {
        notify('error', {
          params: {
            description: 'Lỗi không thể chụp ảnh',
            title: 'Lỗi',
            style: {multiline: 100},
          },
        });
      });
  };
  const choosePhotoFromLibrary = () => {
    toggleModal();
    console.log(props.isMultiple);
    if (props.isMultiple && props.isMultiple) {
      ImagePicker.openPicker({
        waitAnimationEnd: false,
        compressImageQuality: 1,
        multiple: true,
        maxFiles: 5,
        cropping: true,
        cropperCircleOverlay: props.isCircle,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
      })
        .then(images => {
          props.postImage(images);
          // console.log(images);
          // props.setPhoto(image.path);
        })
        .catch(() => {
          notify('error', {
            params: {
              description: 'Lỗi không thể chọn ảnh',
              title: 'Lỗi',
              style: {multiline: 100},
            },
          });
        });
    } else {
      ImagePicker.openPicker({
        waitAnimationEnd: false,
        compressImageQuality: 1,
        cropping: true,
        cropperCircleOverlay: props.isCircle,
      })
        .then(image => {
          props.postImage(image);
          // console.log(image);
          // props.setPhoto(image.path);
        })
        .catch(() => {
          notify('error', {
            params: {
              description: 'Lỗi không thể chọn ảnh',
              title: 'Lỗi',
              style: {multiline: 100},
            },
          });
        });
    }
  };

  return (
    <Modal
      onBackdropPress={() => props.setVisible(0)}
      onBackButtonPress={() => props.setVisible(0)}
      isVisible={Boolean(props.isVisible)}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.4}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.barIcon} />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.panelTitle}>{props.title}</Text>
          <Text style={styles.panelSubtitle}>{props.subtitle}</Text>
        </View>
        <View style={{height: 1.5, backgroundColor: Colors.gray}} />
        <View style={styles.viewButton}>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={takePhotoFromCamera}>
            <View
              style={{
                backgroundColor: Colors.grayLight,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <Image
                source={require('../../assets/images/take_photo.png')}
                style={{width: 24, height: 24}}
              />
            </View>
            <Text style={styles.panelButtonTitle}>Chụp ảnh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewButton}>
          <TouchableOpacity
            style={styles.panelButton}
            onPress={choosePhotoFromLibrary}>
            <View
              style={{
                backgroundColor: Colors.grayLight,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <Image
                source={require('../../assets/images/library_photo.png')}
                style={{width: 24, height: 24}}
              />
            </View>
            <Text style={styles.panelButtonTitle}>Chọn ảnh từ thư viện</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default UploadPhoto;

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
    marginTop: 20,
    fontSize: 20,
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
  },
  panelSubtitle: {
    fontSize: 13,
    color: Colors.darkGray,
    marginBottom: 10,
    fontFamily: getFontFamily('regular'),
  },
  viewButton: {
    marginVertical: 7,
    borderRadius: 13,
    overflow: 'hidden',
    alignItems: 'center',
  },
  panelButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 30,
  },
  panelButtonTitle: {
    marginLeft: 20,
    fontSize: 16,
    fontFamily: getFontFamily('bold'),
    color: Colors.black,
  },
});
