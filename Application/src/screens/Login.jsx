import {
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  Button,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import {TouchableOpacity} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import axios from 'axios';
import {API_KEY} from '@env';
import Logo from '../assests/Logo.png';
import googleLogo from '../assests/GoogleLogo.png';
import facebookLogo from '../assests/FacebookLogo.png';
import {BASE_URL} from '../API/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import * as Yup from 'yup';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleLogout } from 'react-google-login';


GoogleSignin.configure({
	webClientId: "351710942916-el06f0a8kq1o0kbrf3d6jsvt6728l35m.apps.googleusercontent.com",
	// androidClientId: "351710942916-6gdrrb1b3lc8u43nmogkoddel6eul0tr.apps.googleusercontent.com",
	iosClientId: "",
	scopes: ['profile', 'email'],
});


const GoogleLogin = async () => {
	await GoogleSignin.hasPlayServices();
	const userInfo = await GoogleSignin.signIn();
	return userInfo;
};


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter the complete Email Address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});



const Login = ({navigation}) => {


  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const switchScreen = location => {
    navigation.navigate(location);
  };


  const handleGoogleLogin = async () => {

		setLoading(true);
		try {
			const response = await GoogleLogin();
			const { idToken, user } = response;
      console.log(response.data.user.email);
      try {
        const dataResponse = await axios.post(`${BASE_URL}/login`, {
          email: response.data.user.email,
          password: "abc",
          google:true
        });
        console.log(dataResponse);
        if (dataResponse.data !== null) {
          await AsyncStorage.setItem('token', dataResponse.data.token);
          console.log(dataResponse.data.data);
          setLoading(false);
          switchScreen('Main');
        } else {
          console.log('a');
          setLoading(false);
          setError(true);
        }
      } catch (error) {
        try {
          await GoogleSignin.signOut();
          setError(true)
          setLoading(false)
        } catch (error) {
          console.log('Google Sign-Out Error: ', error);
        }
      }
    
		} catch (apiError) {
			setError(
				apiError?.response?.data?.error?.message || 'Something went wrong'
			);
      setLoading
		} finally {
			setLoading(false);
		}
	};
  
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setLoading(false);

        navigation.navigate('Main'); // Redirect to the Main screen if token is found
      } else {
        setLoading(false); // Token check complete, hide loading screen
      }
    };
    checkToken();
  }, [navigation]);
  // const baseUrl = import.meta.env.VITE_REACT_APP_URL; // Getting the dynamic URL
  const LoginAccount = async data => {
    setLoading(true);
    console.log(data);
    console.log(BASE_URL);

    try {
      const dataResponse = await axios.post(`${BASE_URL}/login`, {
        email: data.email,
        password: data.password,
      });
      console.log(dataResponse);
      if (dataResponse.data !== null) {
        await AsyncStorage.setItem('token', dataResponse.data.token);
        console.log(dataResponse.data);
        setLoading(false);
        navigation.navigate('Main');
      } else {
        console.log('a');
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.log(error);
      setError(true); // Set error to true if an exception occurs
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.main}>
      <LinearGradient
        colors={['#fbb39a', '#fcfafa', '#fcfafa', '#fcfafa', '#fcfafa']}
        style={{paddingHorizontal: 30}}>
        <Image style={styles.logoImage} source={Logo} />
        <Text style={styles.loginTitle}>Log in to your Account</Text>
        <Text style={{color: 'grey'}}>
          Enter your email and password to log in
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>credentials didn't match</Text>
          </View>
        )}
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={validationSchema}
          onSubmit={values => {
            // Reset error before submitting
            setError(false);
            LoginAccount(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Email Input */}
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={{color: 'red', marginTop: 5}}>{errors.email}</Text>
              )}

              {/* Password Input */}
              <TextInput
                style={[styles.input]}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="**********"
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={{color: 'red', marginTop: 5}}>
                  {errors.password}
                </Text>
              )}

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => {
                  switchScreen('ForgetPassword');
                }}>
                <Text
                  style={{
                    color: '#fa845b',
                    fontWeight: '600',
                    marginLeft: 'auto',
                    fontSize: 16,
                    marginBottom: 20,
                    marginTop: 20,
                  }}>
                  Forgot Password ?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={{backgroundColor: '#fa845b', borderRadius: 10}}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 18,
                    marginVertical: 14,
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 'auto',
          }}>
         

        </View>
        
        <View>
          <Pressable onPress={() => switchScreen('SignUp')}>
            <Text style={styles.signUpText}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Login;

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
    color: 'black',
  },
  orText: {
    marginHorizontal: 'auto',
    fontSize: 20,
    fontWeight: '300',
    color: 'black',
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
