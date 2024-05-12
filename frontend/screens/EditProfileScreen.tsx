/* eslint-disable react-native/no-inline-styles */
import {Icon} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Modal from 'react-native-modal';
import MAP_API_KEY from '../components/data/SecretData';
import {updateUser} from '../api/AccountsApi';
import {createNotifications} from 'react-native-notificated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {useNotifications} = createNotifications();
function EditProfileScreen(props: any) {
  const {notify} = useNotifications();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());

  const toggleModal = () => {
    props.setVisible(!props.isVisible);
  };
  const saveProfile = () => {
    console.log(name, location, description, phone, birthDate);
    console.log(props.token);
    updateUser(
      {name, location, description, phone, birthDate, email},
      props.token,
    )
      .then((response: any) => {
        console.log(response.data);
        if (response.status === 200) {
          props.setVisible(false);
          notify('success', {
            params: {
              description: 'Update profile successful.',
              title: 'Success',
            },
          });
          AsyncStorage.setItem('infoUser', JSON.stringify(response.data));
        } else {
          notify('error', {
            params: {description: 'Update profile failed.', title: 'Error'},
          });
        }
      })
      .catch((error: any) => {
        notify('error', {
          params: {
            description: error.message,
            title: 'Error',
            style: {multiline: 100},
          },
        });
      });
  };
  useEffect(() => {
    if (props.infoUser) {
      setName(props.infoUser.name);
      setDescription(props.infoUser.description);
      setPhone(props.infoUser.phone);
      setEmail(props.infoUser.email);
      if (props.infoUser.birthDate !== null) {
        setBirthDate(new Date(props.infoUser.birthDate));
      }
      if (props.infoUser.location !== null) {
        setLocation(props.infoUser.location);
      }
    }
  }, [
    props.infoUser,
    props.infoUser?.birthDate,
    props.infoUser?.description,
    props.infoUser?.location,
    props.infoUser?.name,
    props.infoUser?.phoneNumber,
  ]);

  return (
    <Modal
      onBackdropPress={() => props.setVisible(false)}
      onBackButtonPress={() => props.setVisible(false)}
      isVisible={props.isVisible}
      style={{margin: 0}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
        <View style={styles.modalContent}>
          <View style={{height: 70}} />
          <View style={{marginLeft: 10}}>
            <Text>* Indicates required</Text>
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text style={{marginTop: 30, color: 'black', fontSize: 16}}>
              Full name*
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                color: 'black',
                fontSize: 16,
              }}
              placeholder="Enter your full name"
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>

          <View style={{marginHorizontal: 10}}>
            <Text style={{marginTop: 30, color: 'black', fontSize: 16}}>
              Description
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                color: 'black',
                fontSize: 16,
              }}
              placeholder="Enter your description"
              value={description}
              onChangeText={text => setDescription(text)}
            />
          </View>

          <View style={{marginHorizontal: 10}}>
            <Text style={{marginTop: 30, color: 'black', fontSize: 16}}>
              Phone number*
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                color: 'black',
                fontSize: 16,
              }}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={text => setPhone(text)}
            />
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text style={{marginTop: 30, color: 'black', fontSize: 16}}>
              Birthday
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <DatePicker
                date={birthDate}
                onDateChange={setBirthDate}
                mode="date"
                locale="eng"
              />
            </View>
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text style={{marginTop: 30, color: 'black', fontSize: 16}}>
              Location
            </Text>
            <GooglePlacesAutocomplete
              placeholder="Enter your country/region"
              onPress={(data, details = null) => {
                console.log(data, details);
              }}
              query={{
                key: MAP_API_KEY,
                language: 'vi',
              }}
              styles={{
                container: {borderBottomWidth: 1, borderBottomColor: 'black'},
                textInput: {
                  fontSize: 16,
                  color: 'black',
                },
              }}
            />
          </View>

          <View style={{height: 100}} />
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={saveProfile}>
          <View
            style={{
              borderRadius: 30,
              backgroundColor: '#1664b1',
              paddingHorizontal: 150,
              paddingVertical: 6,
              elevation: 5,
            }}>
            <Text style={styles.bottomText}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.topView}>
        <View style={{margin: 20, flexDirection: 'row'}}>
          <TouchableOpacity onPress={toggleModal} style={{marginTop: 3}}>
            <Icon type="antdesign" name="close" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit profile</Text>
        </View>
      </View>
    </Modal>
  );
}
export default EditProfileScreen;
const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    color: 'black',
    marginLeft: 30,
    fontWeight: 'bold',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  bottomText: {
    color: 'white',
    fontSize: 18,
  },
  topView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
});
