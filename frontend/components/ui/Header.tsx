/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';

const Header = (props: any) => {
  const {title, navigation} = props;
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.floatBtn} onPress={handleBack}>
        <Icon source={'arrow-left'} size={25} color={Colors.text} />
      </TouchableOpacity>
      <Text style={styles.textTitle}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.white,
  },
  floatBtn: {
    position: 'absolute',
    left: 10,
    zIndex: 100,
  },
  textTitle: {
    fontSize: 20,
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    flex: 1,
  },
});
