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
import Loading from '../components/Loading';
import AlertBox from '../components/AlertBox';
import axios from 'axios';
import {BASE_URL} from '../API/API';
const NewPassword = ({route, navigation}) => {
  const {email} = route.params;
  const switchScreen = location => {
    navigation.navigate(location);
  };
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescriptiion] = useState('');
  const [loading, setLoading] = useState(false);
  const [mute, setMute] = useState();
  const [success, setSuccess] = useState();

  const toggleShowAlert = stateChange => {
    setShowAlert(stateChange);
  };

  const DataSubmission = async FormValues => {
    setLoading(true);
    if (FormValues.password == FormValues.repassword) {
      try {
        const dataResponse = await axios.post(
          `${BASE_URL}/changeForgetPassword`,
          {
            email: email,
            password: FormValues.password,
          },
        );
        if (dataResponse.status == 200) {
          console.log(dataResponse);
          setLoading(false);
          setTitle('Password Successfully Changed');
          setDescriptiion(
            'Password Successfully change and we are redirecting you to your profile ',
          );
          setSuccess(true);
          setMute(true);
          setShowAlert(true);
          setTimeout(() => {
            navigation.navigate('SignIn');
          }, 3000);
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
        }
      }
    } else {
      setLoading(false);
      setTitle('Password Mismatch Error!');
      setDescriptiion(
        'You have not entered the same password. Please try again.',
      );
      setShowAlert(true);
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
          Set a New Password{' '}
        </Text>
        <Text style={{color: 'grey'}}>
          Create a new password you haven’t used before
        </Text>

        <Formik
          initialValues={{password: '', repassword: ''}}
          onSubmit={values => {
            DataSubmission(values);
          }}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View style={styles.formContainer}>
              <TextInput
                style={[styles.input, {marginBottom: 0}]}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="New Password"
                secureTextEntry
              />
              <TextInput
                style={[styles.input, {marginBottom: 20}]}
                onChangeText={handleChange('repassword')}
                onBlur={handleBlur('repassword')}
                value={values.repassword}
                placeholder="Confirm New Password"
                secureTextEntry
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
                    borderRadius: 5,
                  }}>
                  Update Password
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
          mute={mute}
          success={success}
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

export default NewPassword;

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

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
});
