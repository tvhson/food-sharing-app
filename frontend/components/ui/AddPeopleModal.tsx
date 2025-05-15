import {Checkbox, Searchbar} from 'react-native-paper';
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

import Colors from '../../global/Color';
import ReactNativeModal from 'react-native-modal';
import {UserInfo} from '../../redux/UserReducer';
import {getFontFamily} from '../../utils/fonts';

const AddPeopleModal = ({
  isVisible,
  onClose,
  listPeople,
  selectedPeople,
  setSelectedPeople,
}: {
  isVisible: boolean;
  onClose: () => void;
  listPeople: Partial<UserInfo>[];
  selectedPeople: Partial<UserInfo>[];
  setSelectedPeople: (people: Partial<UserInfo>[]) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] =
    useState<Partial<UserInfo>[]>(selectedPeople);

  const handleSearch = (query: string) => {
    setFilteredList(
      listPeople.filter(person =>
        person.email?.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  const renderItem = ({item}: {item: Partial<UserInfo>}) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <Image
          source={{uri: item.imageUrl}}
          style={{width: 40, height: 40, borderRadius: 20}}
        />
        <Text
          style={{
            fontSize: 16,
            fontFamily: getFontFamily('regular'),
            color: Colors.black,
            marginLeft: 10,
            flex: 1,
          }}>
          {item.name}
        </Text>
        <Checkbox
          color={Colors.greenPrimary}
          status={selectedPeople.includes(item) ? 'checked' : 'unchecked'}
          onPress={() => {
            if (selectedPeople.includes(item)) {
              setSelectedPeople(
                selectedPeople.filter(person => person.id !== item.id),
              );
            } else {
              setSelectedPeople([...selectedPeople, item]);
            }
          }}
        />
      </View>
    );
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackButtonPress={() => {
        onClose();
        setSearchQuery('');
        setFilteredList(selectedPeople);
      }}
      onBackdropPress={() => {
        onClose();
        setSearchQuery('');
        setFilteredList(selectedPeople);
      }}
      style={{
        margin: 0,
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Thêm thành viên</Text>
        <Searchbar
          placeholder="Nhập email"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={() => {
            handleSearch(searchQuery);
          }}
          onClearIconPress={() => {
            setSearchQuery('');
            setFilteredList(selectedPeople);
          }}
        />

        <FlatList
          style={{width: '100%'}}
          data={filteredList}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontFamily: getFontFamily('regular'),
                color: Colors.black,
                marginTop: 20,
              }}>
              Không có thông tin
            </Text>
          }
          keyExtractor={item => item.id?.toString() || ''}
        />
      </View>
    </ReactNativeModal>
  );
};

export default AddPeopleModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '70%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: getFontFamily('bold'),
    color: Colors.black,
  },
});
