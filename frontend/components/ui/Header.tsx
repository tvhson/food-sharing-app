import {Avatar, Icon} from '@rneui/themed';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../global/Color';

const Header = (props: any) => {
  const imageUrl = props.imageUrl;
  return (
    <View style={styles.container}>
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
      <Text style={styles.title}>Happy Food</Text>
      <TouchableOpacity>
        <Icon name="filter" type="ionicon" size={24} color={'white'} />
      </TouchableOpacity>
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
