import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  BackHandler,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../components/Loading';
import AlertBox from '../components/AlertBox';
import axios from 'axios';
import {BASE_URL} from '../API/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CELL_COUNT = 5;
const GetCodeVerifyUser = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        console.log('Back button pressed on this screen');
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [])
  );

  const switchScreen = location => {
    navigation.navigate(location);
  };
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescriptiion] = useState('');
  const [loading, setLoading] = useState(false);
  const toggleShowAlert = stateChange => {
    setShowAlert(stateChange);
  };

  const DataSubmission = async formValue => {
    console.log(formValue);
    const token = await AsyncStorage.getItem('token');

    setLoading(true);
    try {
      const dataResponse = await axios.post(
        `${BASE_URL}/api/v1/verifyToken`,
        {token: formValue.code},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );
      if (dataResponse.status == 200) {
        setLoading(false);
        switchScreen('Main');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response) {
        if (error.response.status === 400) {
          setTitle(error.response.data.status);
          setDescriptiion(error.response.data.msg);
          setShowAlert(true);
        }
        if (error.response.status === 404) {
          setTitle(error.response.data.status);
          setDescriptiion(error.response.data.msg);
          setShowAlert(true);
        }
      }
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      try {
        await AsyncStorage.removeItem('token');
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

  const sendCode = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/SendRepeatToken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );
      if (response.status == 200) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error.response.data.error);
      setLoading(false);
      setTitle(error.response.data.error.code);
      setDescriptiion(error.response.data.error.message);
      setShowAlert(true);
    }
  };

  return (
    <ScrollView style={styles.main}>
      <LinearGradient
        colors={['#fbb39a', '#fcfafa', '#fcfafa', '#fcfafa', '#fcfafa']}
        style={{paddingHorizontal: 30}}>
          <TouchableOpacity
                     onPress={() => {
                      // Reset the navigation stack and navigate to the Login screen
                     logout()
                    }}
                    style={{
                      position: 'absolute',
                      top: 40,
                      left: 30,
                      backgroundColor: '#F2F2F2',
                      borderRadius: 10,
                      padding: 8,
                      flexDirection:"row",
                      alignItems:"center"
                    }}>
                    <Icon
                      name="power"
                      size={25}
                      color="#FA8055" // Apply the color directly
                    />
                    <Text>LOGOUT </Text>
                  </TouchableOpacity>
        <Text style={[styles.loginTitle, {marginTop: 140, marginBottom: 10}]}>
          Check Your Email{' '}
        </Text>
        <Text style={{color: 'grey'}}>
          We’ve sent a code to example@gmail.com. Please enter the 5-digit code
          below{' '}
        </Text>

        <Formik
          initialValues={{code: ''}} // No need for separate 'value' state
          onSubmit={values => {
            DataSubmission(values); // Submits Formik values directly
          }}>
          {({handleChange, handleBlur, handleSubmit, values}) => {
            const ref = useBlurOnFulfill({
              value: values.code,
              cellCount: CELL_COUNT,
            });
            const [props, getCellOnLayoutHandler] = useClearByFocusCell({
              value: values.code,
              setValue: handleChange('code'),
            });
            return (
              <View style={styles.formContainer}>
                <CodeField
                  ref={ref}
                  {...props}
                  // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                  value={values.code} // Use Formik's value
                  onChangeText={handleChange('code')} // Update Formik's value
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete={Platform.select({
                    android: 'sms-otp',
                    default: 'one-time-code',
                  })}
                  testID="my-code-input"
                  renderCell={({index, symbol, isFocused}) => (
                    <Text
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  )}
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
            );
          }}
        </Formik>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 12,
            fontFamily: 'Poppins',
          }}>
          Don’t get a code?{' '}
            <Text onPress={sendCode} style={{color: 'orange'}}>Resend email</Text>
        </Text>
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

export default GetCodeVerifyUser;

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
    fontFamily: 'Poppins-Bold',

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
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#00000030',
    textAlign: 'center',
    borderRadius: 5,
  },
  focusCell: {
    borderColor: '#FA8055',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
});
