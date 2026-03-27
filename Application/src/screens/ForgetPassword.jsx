import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import React, {useState} from 'react';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {BASE_URL} from '../API/API';
import AlertBox from '../components/AlertBox';
import Loading from '../components/Loading';

const ForgetPassword = ({navigation}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescriptiion] = useState('');
  const [loading, setLoading] = useState(false);
  const toggleShowAlert = stateChange => {
    setShowAlert(stateChange);
  };
  const [error, setError] = useState(false);
  const SignIn = async values => {
    setLoading(true);
    try {
      const dataResponse = await axios.post(`${BASE_URL}/forgetPasswordSend`, {
        email: values.email,
      });
      if (dataResponse.status == 200) {
        console.log(dataResponse);
        setLoading(false);
        navigation.navigate('GetCode', {
          email: values.email, // Pass the email as a prop
        });
      }
    } catch (error) {
      if (error.status == 404) {
        setLoading(false);
        setTitle('ERROR !');
        setDescriptiion(error.response.data.message);
        setShowAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView style={styles.main}>
      <LinearGradient
        colors={['#fbb39a', '#fcfafa', '#fcfafa', '#fcfafa', '#fcfafa']}
        style={{paddingHorizontal: 30}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Navigate back
          style={{
            position: 'absolute',
            top: 40,
            left: 30,
            backgroundColor: '#F2F2F2',
            borderRadius: 40,
            padding: 8,
          }}>
          <Icon
            name="arrow-back-ios-new"
            size={25}
            color="#FA8055" // Apply the color directly
          />
        </TouchableOpacity>

        <Text style={[styles.loginTitle, {marginTop: 140, marginBottom: 10}]}>
          Forgot Password?
        </Text>
        <Text style={{color: 'grey'}}>
          Enter your email to receive a code and reset your password{' '}
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>credentials didn't match</Text>
          </View>
        )}
        <Formik
          initialValues={{email: ''}}
          onSubmit={values => {
            setError(false); // Reset error before submitting
            SignIn(values);
          }}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
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
                  Get Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </LinearGradient>
      <Modal
        transparent={true}
        visible={showAlert}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <AlertBox
          callFunction={toggleShowAlert}
          title={title}
          description={description}
        />
      </Modal>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fcfafa',
  },
  logoImage: {
    width: '24%',
    height: 70,
    marginHorizontal: 'auto',
    marginTop: '15%',
    marginBottom: '20%',
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: '700',

    color: 'black',
    fontFamily: 'Abel-Regular',
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
    marginTop: 20,
    marginBottom: 0,
    paddingLeft: 10,
    backgroundColor: 'white',
    borderColor: 'grey',
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
});
