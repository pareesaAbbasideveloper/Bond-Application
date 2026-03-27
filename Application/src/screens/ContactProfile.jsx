import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AntIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';
import ContactImage from '../assests/contactImage.png';
import facebook from '../assests/facebooksmall.png';
import instagram from '../assests/instasmall.png';
import genericIcon from '../assests/genericIcon.png';
import {deleteContact} from 'react-native-contacts';
import {BASE_URL} from '../API/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactDone from '../components/ContactDone';
import Loading from '../components/Loading';

const ContactProfile = ({navigation, route}) => {
  const [showContact, setShowContact] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleDoneState, setToggleDoneState] = useState(false);

  const toggleDone = () => {
    setLoading(true);
    // Toggle the done state
    setToggleDoneState(prevState => !prevState);
  };
  const {data} = route.params; // Access the passed data here
  console.log('this is the data provided', data);
  const toggleContactDone = async (stateChange, id) => {
    setShowContact(stateChange);
    if (id) {
      setSelectedContactId(id); // Store the selected contact's ID
    }
  };
  const switchScreen = (location, value) => {
    navigation.navigate(location, {data: value});
  };
  if (data.lastContacted.length > 0) {
    var dateOnly =
      data.lastContacted[data.lastContacted.length - 1].split('T')[0];
  } else {
    var dateOnly = 'Not Available';
  }

  if (data.dateOfBirth) {
    var birthday = data.dateOfBirth.split('T')[0];
  } else {
    var birthday = 'Not Available';
  }
  console.log(birthday);

  const handleDelete = async () => {
    // Make sure to pass inputId as a parameter
    console.log(data._id);
    const token = await AsyncStorage.getItem('token'); // Replace with your key
    console.log(token);
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/v1/deletecontact`, // API endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
          data: {inputId: data._id}, // Send inputId in the request body
        },
      );
      console.log(response.data.status);

      if (response.data.status == 'success') {
        switchScreen('Contact'); // Navigate to the Main screen
      } else {
        console.log('Response data is null');
        setError(true); // Set error to true if response data is null
      }
    } catch (error) {
      console.log(error);
      setError(true); // Set error to true if an exception occurs
    }
  };

  return (
    <ScrollView style={{paddingHorizontal: 10, marginTop: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => switchScreen('Contact')}>
            <Ionicons
              size={20}
              name="arrow-back"
              style={{color: '#FA8055'}}></Ionicons>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => switchScreen('EditContact', data)}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntIcons
            size={30}
            name="pencil"
            style={{color: '#FA8055'}}></AntIcons>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Poppins',
              marginVertical: 'auto',
              color: '#FA8055',
            }}>
            Edit{' '}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Image
          source={data.profilePic ? {uri: data.profilePic} : ContactImage}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            marginHorizontal: 'auto',
          }}></Image>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
            marginHorizontal: 'auto',
            marginTop: 10,
            color: 'black',
          }}>
          {data.name}
        </Text>
        <View style={{flexDirection: 'row', marginHorizontal: 'auto'}}>
          <View
            style={{
              backgroundColor: 'white',
              marginRight: 10,
              padding: 10,
              borderRadius: 100,
            }}>
            <FontIcon
              style={{color: '#FA8055'}}
              size={15}
              name="phone-volume"></FontIcon>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              marginRight: 10,
              padding: 10,
              borderRadius: 100,
            }}>
            <FontIcon
              style={{color: '#FA8055'}}
              size={15}
              name="message"></FontIcon>
          </View>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 'auto',
            marginTop: 10,
          }}
          onPress={() => switchScreen('ContactHistory', data)}>
          <FontIcon
            style={{color: '#FA8055', marginRight: 4}}
            size={15}
            name="message"></FontIcon>
          <Text style={{fontSize: 14, fontFamily: 'Poppins'}}>
            Last in Touch: {dateOnly}{' '}
          </Text>
          <AntIcons
            style={{color: '#FA8055'}}
            size={14}
            name="clock"></AntIcons>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#FA8055',
            marginHorizontal: 'auto',
            padding: 10,
            marginTop: 15,
            borderRadius: 10,
            marginBottom: 30,
          }}
          onPress={() => toggleContactDone(true, data._id)}>
          <Text
            styte={{
              color: 'white',
            }}>
            Got In Touch Today
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <FontIcon
            style={{color: '#FA8055'}}
            size={15}
            name="calendar-days"></FontIcon>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              marginVertical: 'auto',
              marginLeft: 5,
            }}>
            Birthdate
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 15,
              marginLeft: 15,
            }}>
            {birthday}
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
          <Ionicons
            style={{color: '#FA8055', marginLeft: 0, marginRight: 2}}
            size={17}
            name="mail-outline"></Ionicons>
          <Text style={{fontFamily: 'Poppins-Medium', fontSize: 13}}>
            Email
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 15,
              marginLeft: 17,
            }}>
            {data.email}
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
          <FontIcon
            style={{color: '#FA8055', marginLeft: 2, marginRight: 3}}
            size={14}
            name="phone"></FontIcon>
          <Text style={{fontFamily: 'Poppins-Medium', fontSize: 13}}>
            Phone Number
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 15,
              marginLeft: 14,
            }}>
            0{data.contactNumber}
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
          <FontIcon
            style={{color: '#FA8055', marginLeft: 4, marginRight: 2}}
            size={14}
            name="people-line"></FontIcon>
          <Text style={{fontFamily: 'Poppins-Medium', fontSize: 13}}>
            Group
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 15,
              marginLeft: 24,
            }}>
            {data.category}
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
          <FontIcon
            style={{color: '#FA8055', marginLeft: 4, marginRight: 2}}
            size={14}
            name="repeat"></FontIcon>
          <Text style={{fontFamily: 'Poppins-Medium', fontSize: 13}}>
            Frequency
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 15,
              marginLeft: 22,
            }}>
            {data.recurring.recurringTime === 0
              ? 'Everyday'
              : data.recurring.recurringTime === 0.5
              ? 'Every 15 Days'
              : data.recurring.recurringTime === 10
              ? `Every ${data.recurring.customDays} Days`
              : `Every ${data.recurring.recurringTime} Month`}
          </Text>
        </View>

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
          <FontIcon
            style={{color: '#FA8055', marginLeft: 4, marginRight: 2}}
            size={14}
            name="globe"></FontIcon>
          <Text style={{fontFamily: 'Poppins-Medium', fontSize: 13}}>
            Social Media Links
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 20}}>
          {data.socialMedia.map((link, index) => {
            let icon;

            // Check the link to determine which icon to show
            if (link.includes('facebook.com')) {
              icon = facebook;
            } else if (link.includes('instagram.com')) {
              icon = instagram;
            } else {
              icon = genericIcon; // Default icon if it's not Facebook or Instagram
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  Linking.openURL(link);
                }}>
                <Text>{link}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            marginHorizontal: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
          }}>
          <FontIcon
            style={{
              color: '#FA8055',
              marginLeft: 4,
              marginRight: 2,
              marginRight: 6,
            }}
            size={24}
            name="bucket"></FontIcon>

          <Text
            style={{
              color: '#EA4335',
              fontSize: 16,
              marginTop: 15,
              marginBottom: 10,
            }}>
            Delete Contact
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={showContact}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <ContactDone
            id={selectedContactId}
            callFunction={toggleContactDone}
            DoneFunction={toggleDone}
            style={styles.popup}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ContactProfile;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
