import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const MissedContactPopUp = ({callFunction}) => {
  function handleClick() {
    console.log('me this time');
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
      <FontAwesome
        style={{color: '#FA8055'}}
        name="exclamation-triangle"
        size={40}></FontAwesome>
      <Entypo
        onPress={() => {
          handleClick();
        }}
        style={{position: 'relation', left: 140, fontSize: 30, bottom: 50}}
        name="cross"></Entypo>
      <Text
        style={{
          fontFamily: 'Poppins-Bold',
          fontSize: 16,
          color: 'black',
          marginBottom: 10,
          marginTop: -25,
        }}>
        Oops, You Missed Some Contacts!
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-light',
          fontSize: 13,
          textAlign: 'left',
        }}>
        Reconnect now or extend the deadline to keep your logs. Don’t let your
        fire go out!
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
          Okay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MissedContactPopUp;

const styles = StyleSheet.create({});
