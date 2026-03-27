import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axios} from 'axios';
import {BASE_URL} from '../API/API';
// import Loading from '../components/Loading';
function DecisionMaking({navigation}) {

  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      // Fetch profile data first
      const profileResponse = await fetch(`${BASE_URL}/api/v1/viewProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        profileDataWork = await profileResponse.json();
        if(profileDataWork.data.Verified  === true){
            navigation.navigate("Main");
        }else{
            navigation.navigate("GetCodeVerifyUser");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchData();
  },[])

  return (
    <ScrollView>
      <View>
        <Text>
            This is me
        </Text>
      </View>
      {/* <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal> */}
    </ScrollView>
  );
}

export default DecisionMaking;


const styles = StyleSheet.create({
  
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    },
    
  });
  