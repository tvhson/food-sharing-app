/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Colors from '../global/Color';
import {SegmentedButtons} from 'react-native-paper';

const ListGroupScreen = () => {
  const [valueOfSegmentButton, setValueOfSegmentButton] = useState('Group');
  return (
    <View>
      <SegmentedButtons
        style={{margin: 20}}
        value={valueOfSegmentButton}
        onValueChange={setValueOfSegmentButton}
        buttons={[
          {
            value: 'Group',
            label: 'Hội nhóm',
            checkedColor: 'white',
            style: {
              backgroundColor:
                valueOfSegmentButton === 'Group'
                  ? Colors.button
                  : 'transparent',
            },
          },
          {
            value: 'MyGroup',
            label: 'Nhóm của tôi',
            checkedColor: 'white',
            style: {
              backgroundColor:
                valueOfSegmentButton === 'MyGroup'
                  ? Colors.button
                  : 'transparent',
            },
          },
        ]}
      />
      <Text>ListGroupScreen</Text>
    </View>
  );
};

export default ListGroupScreen;

const styles = StyleSheet.create({});
