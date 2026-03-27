import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntIcons from 'react-native-vector-icons/EvilIcons';
import paavani from '../assests/paavani.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../API/API';
import Loading from '../components/Loading';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AlertBox from '../components/AlertBox';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

import axios from 'axios';
const Profile = ({navigation}) => {
  console.log(navigation.getState()); // Log before resetting
  navigation.reset({
    index: 0,
    routes: [{ name: 'SignIn' }],
  });
  console.log(navigation.getState()); // Log after resetting

  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescriptiion] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [forcedReload, setForceReload] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [success, setSuccess] = useState();
  const toggleShowAlert = stateChange => {
    setShowAlert(stateChange);
  };
  const ForceReloadFunction = () => {
    console.log('Triggering force reload');
    setForceReload(prev => !prev); // Toggle between true and false
  };
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };

    fetchToken();
  }, []);

  const fetchProfileData = useCallback(async () => {
    if (!token) return;
    console.log(token);

    try {
      const response = await fetch(`${BASE_URL}/api/v1/viewProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('this is response ', response);

      if (response.ok) {
        const data = await response.json();
        setData(data);
        setLoading(false);
        console.log(data);
      } else {
        console.error('Failed to fetch profile data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, [token]);

  const changeImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo', // To restrict to images only
        selectionLimit: 1, // Only one image can be selected
      });
      setLoading(true);

      if (result.didCancel) {
        console.log('User cancelled image picker');
        setLoading(false);
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        setLoading(false);
      } else {
        const imageUri = result.assets[0].uri;
        const imageType = result.assets[0].type;
        const imageName = result.assets[0].fileName;

        console.log('Selected image URI:', imageUri);

        // Prepare FormData to send image
        const formData = new FormData();
        formData.append('profilePic', {
          uri: imageUri,
          name: imageName, // You can customize the file name
          type: imageType, // Adjust based on image type (e.g., 'image/png' for PNG images)
        });
        // Send image to backend using fetch API
        const response = await fetch(`${BASE_URL}/api/v1/editProfile`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        console.log('Response from server:', responseData.data.profilePic);
        ForceReloadFunction();
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/changePassword`,
        {
          oldPassword: oldPassword, // Adjust the key according to your API
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );

      console.log(response.data.message);
      setTitle('Successfully Completed The Action.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setDescriptiion(response.data.message);
      setSuccess(true);
      setLoading(false);
      setShowAlert(true);
    } catch (error) {
      console.log(error.response.data.message);
      console.log(error.response.data);
      setTitle('There is an error while performing the action.');
      setDescriptiion(error.response.data.message);
      setLoading(false);
      setSuccess();
      setShowAlert(true);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, [token, forcedReload]);

  const logout = async () => {
    setLoading(true);

    try {
      await GoogleSignin.signOut();
      try {
        await AsyncStorage.removeItem('token');
        setToken(null); // Set token state to null
        // Navigate to the Login screen
        setLoading(false);
        console.log('a');
        navigation.replace("SignIn")
      } catch (error) {
        setLoading(false);
        console.error('Logout error: ', error);
      }
      // Perform additional cleanup and logout operations.
    } catch (error) {
      setLoading(false);

      console.log('Google Sign-Out Error: ', error);
    }
  };

  if (loading) {
    return (
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    );
  } else {
    const profileImage = data?.data?.profilePic
      ? {uri: `${data.data.profilePic}?t=${Date.now()}`} // Add timestamp to avoid caching
      : paavani;
    return (
      <ScrollView style={{paddingHorizontal: 10, marginTop: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Ionicons
                size={20}
                name="arrow-back"
                style={{color: '#FA8055'}}></Ionicons>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 20,
            }}>
            <Ionicons
              size={30}
              name="power"
              style={{color: '#FA8055'}}
              onPress={() => {
                // Reset the navigation stack and navigate to the Login screen
               logout()
              }} // Call logout function when power icon is pressed
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <View>
          <Image
            source={profileImage}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              marginHorizontal: 'auto',
            }}></Image>
          <TouchableOpacity
            onPress={() => {
              changeImage();
            }}>
            <Text
              style={{
                backgroundColor: '#FA8055',
                marginHorizontal: 'auto',
                marginTop: 20,
                padding: 10,
                color: 'white',
              }}>
              Change Image
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              marginHorizontal: 'auto',
              marginTop: 10,
              color: 'black',
            }}>
            {data.data.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              marginHorizontal: 'auto',
              color: '#6D6D6D',
            }}>
            {data.data.email}
          </Text>
        </View>
        {/* <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins',
            color: '#222222',
            marginBottom: 5,
            marginTop: 30,
          }}>
          Birthdate{' '}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',

            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e3e3d7',
          }}
          onPress={() => setOpen(true)}>
          <AntIcons
            style={styles.icon}
            color={'#e3e3d7'}
            name="calendar"
            size={20}
          />
          <Text style={{fontSize: 14, marginLeft: 5}}>August 27, 1990</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>Email</Text>
          <TextInput
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}
            placeholder="example@gmail.com"></TextInput>
        </View>

        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Phone Number
          </Text>
          <TextInput
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}
            placeholder="+1 (222) 555-4543"></TextInput>
        </View> */}
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Old Password
          </Text>
          <TextInput
            value={oldPassword} // Set the value of TextInput to the state variable
            onChangeText={newText => setOldPassword(newText)} // Update the state when text changes
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}></TextInput>
        </View>
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            New Password
          </Text>
          <TextInput
            value={newPassword} // Set the value of TextInput to the state variable
            onChangeText={newText => setNewPassword(newText)} // Update the state when text changes
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}></TextInput>
        </View>
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Confirm Password
          </Text>
          <TextInput
            value={confirmPassword} // Set the value of TextInput to the state variable
            onChangeText={newText => setConfirmPassword(newText)} // Update the state when text changes
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => {
            changePassword();
          }}
          style={{
            flexDirection: 'column',
            width: '100%',
            marginTop: 20,
            marginHorizontal: 'auto',
          }}>
          <Text
            style={{
              marginHorizontal: 'auto',
              backgroundColor: '#FA8055',
              padding: 10,
              color: 'white',
              borderRadius: 5,
              width: '100%',
              textAlign: 'center',
              fontSize: 15,
              marginBottom: 10,
            }}>
            Save Changes
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={showAlert}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <AlertBox
            callFunction={toggleShowAlert}
            title={title}
            description={description}
            success={success}
          />
        </Modal>
      </ScrollView>
    );
  }
};

export default Profile;

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
    fontSize: 18,
    color: '#FA8055',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
});
