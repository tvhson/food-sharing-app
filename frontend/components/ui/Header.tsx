/* eslint-disable react-native/no-inline-styles */
import {Avatar, Icon} from '@rneui/themed';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../global/Color';
import {IconButton, Menu} from 'react-native-paper';

const Header = (props: any) => {
  const imageUrl = props.imageUrl;
  const isMyPost = props.isMyPost || false;
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      {isMyPost === false ? (
        <Avatar
          size={32}
          rounded
          source={{
            uri: imageUrl
              ? imageUrl
              : 'https://randomuser.me/api/portraits/men/36.jpg',
          }}
          onPress={() => {
            props.navigation.navigate('Profile');
          }}
        />
      ) : (
        <View style={{justifyContent: 'center'}}>
          <IconButton
            icon={'chevron-left'}
            size={40}
            iconColor="white"
            onPress={() => {
              props.navigation.goBack();
            }}
          />
        </View>
      )}
      <Text style={styles.title}>Happy Food</Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            <Icon name="filter" type="ionicon" size={24} color={'white'} />
          </TouchableOpacity>
        }>
        <Menu.Item
          onPress={() => {
            props.setSortingMethod('date');
            setVisible(false);
          }}
          title="Sort by date"
          leadingIcon={'sort-calendar-ascending'}
        />
        <Menu.Item
          onPress={() => {
            props.setSortingMethod('distance');
            setVisible(false);
          }}
          title="Sort by distance"
          leadingIcon={'map-marker-distance'}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.button,
    padding: 10,
    borderBottomWidth: 1,
    height: 60,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Header;
