import React from 'react';
import {Image} from '@rneui/themed';
import {Text} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';

const DialogRating = (props: {
  visible: boolean;
  setVisible: (value: boolean) => void;
}) => {
  const {visible, setVisible} = props;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Thông báo</Dialog.Title>
        <Dialog.Content>
          <Text>Bạn có muốn xác nhận việc nhận thức ăn này không?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Hủy</Button>
          <Button onPress={() => setVisible(false)}>Xác nhận</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogRating;
