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
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import React, {useState} from 'react';
import {Formik} from 'formik';
import axios from 'axios';
import Logo from '../assests/Logo.png';
import googleLogo from '../assests/GoogleLogo.png';
import facebookLogo from '../assests/FacebookLogo.png';
import {BASE_URL} from '../API/API';
import * as Yup from 'yup';
import Loading from '../components/Loading';


// import AsyncStorage from '@react-native-async-storage/async-storage';
const SignUp = ({navigation}) => {
  const [error, setError] = useState(false);
const [loading,setLoading] = useState(false);
  const switchScreen = location => {
    navigation.navigate(location);
  };

// Yup validation schema
const validationSchema = Yup.object().shape({
  fullname: Yup.string().required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password should be at least 6 characters')
    .required('Password is required'),
});

  // const baseUrl = import.meta.env.VITE_REACT_APP_URL; // Getting the dynamic URL
  const CreateAccount = async data => {
    setLoading(true)
    console.log(data);
    console.log(BASE_URL);

    try {
      const dataResponse = await axios.post(`${BASE_URL}/signUp`, {
        name: data.fullname,
        email: data.email,
        password: data.password,
      });
      console.log(dataResponse);
      if (dataResponse.data !== null) {
        await AsyncStorage.setItem('token', dataResponse.data.token);
        console.log(dataResponse.data);
        switchScreen('GetCodeVerifyUser');
      } else {
        console.log('a');
        setError(true);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      setError(true); // Set error to true if an exception occurs
      setLoading(false)
    }
  };

  return (
    <ScrollView style={styles.main}>
      <LinearGradient
        colors={['#fbb39a', '#fcfafa', '#fcfafa', '#fcfafa', '#fcfafa']}
        style={{paddingHorizontal: 30}}>
        <Image style={styles.logoImage} source={Logo} />
        <Text style={styles.loginTitle}>Sign Up</Text>
        <Text style={{color: 'grey'}}>Create an account to continue!</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Cannot sign Up some error has occured!
            </Text>
          </View>
        )}
        <Formik
      initialValues={{ fullname: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={values => {
        setError(false); // Reset error before submitting
        CreateAccount(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <TextInput
            style={styles.input}
            onChangeText={handleChange('fullname')}
            onBlur={handleBlur('fullname')}
            value={values.fullname}
            placeholder="Full Name"
          />
          {touched.fullname && errors.fullname && (
            <Text style={{color:"red"}}>{errors.fullname}</Text>
          )}

          {/* Email Input */}
          <TextInput
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {touched.email && errors.email && (
            <Text style={{color:"red"}}>{errors.email}</Text>
          )}

          {/* Password Input */}
          <TextInput
            style={[styles.input]}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            placeholder="Password"
            secureTextEntry
          />
          {touched.password && errors.password && (
            <Text style={{color:"red"}}>{errors.password}</Text>
          )}

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={{ backgroundColor: '#fa845b', borderRadius: 10 ,marginTop: 20}}
          >
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 18,
                marginVertical: 14,
                
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
        
        
        <View>
          <Pressable onPress={() => switchScreen('SignIn')}>
            <Text style={styles.signUpText}>
              Already have an account? Log In
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

export default SignUp;

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
    width: '100%',
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
  },
  signUpText: {
    marginHorizontal: 'auto',
    fontSize: 14,
    marginTop: 40,
    fontWeight: '400',
    fontFamily: 'Abel-Regular',
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
});
