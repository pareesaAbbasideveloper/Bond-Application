import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

const SupportSended = ({callFunction}) => {
  function handleClick() {
    callFunction(false);
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
        Email Sent{' '}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-light',
          fontSize: 13,
          textAlign: 'left',
        }}>
        We’ve received your email, and we will get back to you ASAP{' '}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#FA8055',
          width: '100%',
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 10,
        }}
        onPress={() => handleClick()}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-light',
            color: 'white',
            fontSize: 14,
          }}>
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SupportSended;

const styles = StyleSheet.create({});
