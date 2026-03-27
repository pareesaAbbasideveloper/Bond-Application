import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import loadAndDecodeToken from './LoadAndDecodeToken';

const AddContact = ({callFunction, navigation}) => {
  function handleClick() {
    callFunction(false);
  }
  
  function handleImportFromContacts() {
    // Navigate to the AddFromContact screen
    navigation.navigate('AddContactFromPhone'); // Adjust to the exact name of your screen
    callFunction(false);
  }

  function handleAddNewContact() {
    // Navigate to the AddFromContact screen
    navigation.navigate('AddContact'); // Adjust to the exact name of your screen
    callFunction(false);
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        top: '40%',
        marginHorizontal: 10,
        padding: 20,
        flex: 1,
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
      }}>
      <Material
        style={{color: '#FA8055'}}
        name="message-text-clock"
        size={40}></Material>
      <TouchableOpacity onPress={() => handleClick()}>
        <Entypo
          style={{position: 'relation', left: 140, fontSize: 30, bottom: 50}}
          name="cross"
          onPress={() => handleClick()}></Entypo>
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: 'Poppins-Bold',
          fontSize: 16,
          color: 'black',
          marginBottom: 10,
          marginTop: -25,
        }}>
        Add a New Contact
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-light',
          fontSize: 13,
          textAlign: 'left',
        }}>
        Choose how you'd like to add a new contact to your list
      </Text>
      {/* <TouchableOpacity
        style={{
          backgroundColor: '#FA8055',
          width: '100%',
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 10,
        }}
        onPress={handleImportFromContacts}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-light',
            color: 'white',
            fontSize: 14,
          }}>
          Import from Contacts
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          width: '100%',
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 10,
          borderColor: '#FA8055',
          borderWidth: 1,
        }}
        onPress={handleAddNewContact}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-light',
            color: '#FA8055',
            fontSize: 14,
          }}>
          Add Manually
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddContact;

const styles = StyleSheet.create({});
