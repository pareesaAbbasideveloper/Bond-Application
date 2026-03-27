import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../API/API';
BASE_URL;
const LevelUpCongrats = ({id, callFunction, DoneFunction}) => {
  function handleClick() {
    callFunction();
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
        Congrats You Have Completed Your 10 Item To Burn
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-light',
          fontSize: 13,
          textAlign: 'left',
        }}>
        Please burn the collected item to increase level before going forward as
        without it you will not gain more item to burn
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#FA8055',
          width: '100%',
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 10,
        }}
        onPress={() => {
          handleClick();
          
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-light',
            color: 'white',
            fontSize: 14,
          }}>
          GOT IT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LevelUpCongrats;

const styles = StyleSheet.create({});
