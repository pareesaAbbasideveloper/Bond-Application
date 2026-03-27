import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useState} from 'react';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SupportImage from '../assests/support.png';
import BottomBar from '../components/BottomBar.jsx';
import SupportSended from '../components/SupportSended.jsx';
import {BASE_URL} from '../API/API.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loading from '../components/Loading';

import ContactRedirector from '../components/ContactRedirector.jsx';
const Support = ({navigation}) => {
  const [contactRedirector, setContactRedirector] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showSupportSended, setShowSupportSended] = useState(false);
  const [error, setError] = useState('');

  const toggleSupportSended = stateChange => {
    setShowSupportSended(stateChange);
    console.log('me');
  };

  const toggleContactRedirector = async stateChange => {
    setContactRedirector(stateChange);
  };
  const SubmittingData = async formValue => {
    setLoading(true)

    setError(''); // Reset error before submission
    try {
      await postData(formValue);
      setShowSupportSended(true); // Show success modal after successful submission
      setLoading(false)
    } catch (err) {
      setError('Failed to submit. Please try again.'); // Handle error if needed
      setLoading(false)

    }
  };

  const postData = async value => {
    const token = await AsyncStorage.getItem('token'); // Replace with your key
    console.log('this is the value of mesage', value.problem);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/support`,
        {
          message: value.problem, // Send the problem from form input
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );
      console.log('Response data:', response.data);
      
    } catch (error) {
      console.error('Error posting data:', error);
      throw error; // Rethrow to catch in SubmittingData
    }
  };
  return (
    <>
      <ScrollView style={styles.main}>
        <Image
          style={{
            borderWidth: 1,
            marginTop: 100,
            marginBottom: 20,
            marginHorizontal: 'auto',
          }}
          source={SupportImage}></Image>
        <Text style={[styles.loginTitle, {textAlign: 'center'}]}>
          Got any questions?
        </Text>
        <Text style={{color: 'grey', fontSize: 13}}>
          Feel free to contact us if you have any problems with the application
          or any suggestion{' '}
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>credentials didn't match</Text>
          </View>
        )}
        <Text style={{marginTop: 10, fontFamily: 'Poppins-Medium'}}>
          Your Comments or Questions
        </Text>
        <Formik
          initialValues={{problem: ''}} // Correct initial value for problem
          onSubmit={SubmittingData}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('problem')}
                onBlur={handleBlur('problem')}
                value={values.problem}
                placeholder="Problem"
                autoCapitalize="none"
                multiline={true} // Enable multi-line input
                textAlignVertical="top" // Ensure placeholder and text align at the top
              />

              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: '#fa845b',
                  borderRadius: 10,
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 18,
                    marginVertical: 10,
                    borderRadius: 10,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showSupportSended}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <SupportSended
            callFunction={toggleSupportSended}
            style={styles.popup}
          />
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={contactRedirector}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <ContactRedirector
            callFunction={toggleContactRedirector}
            style={styles.popup}
          />
        </View>
      </Modal>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
      <BottomBar
        navigation={navigation}
        onContactRedirect={toggleContactRedirector}
      />
    </>
  );
};

export default Support;

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fcfafa',
    paddingHorizontal: 30,
  },
  logoImage: {
    width: '24%',
    height: 70,
    marginHorizontal: 'auto',
    marginTop: '15%',
    marginBottom: '20%',
  },
  loginTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 19,
    color: 'black',
  },
  errorContainer: {
    backgroundColor: 'red',
    width: '60%',
    marginHorizontal: 'auto',
    borderRadius: 5,
    marginTop: 10,
  },
  errorText: {
    marginHorizontal: 'auto',
    color: 'white',
    paddingVertical: 10,
    fontFamily: 'Abel-Regular',
    fontSize: 15,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 0,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderColor: 'grey',
    height: 150,
  },
  orText: {
    marginHorizontal: 'auto',
    fontSize: 20,
    fontWeight: '300',
  },
  signUpText: {
    marginHorizontal: 'auto',
    fontSize: 14,
    marginTop: 40,
    fontWeight: '400',
    textDecorationLine: 'underline',
    fontFamily: 'Abel-Regular',
  },
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
