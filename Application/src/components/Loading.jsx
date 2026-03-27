import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Loadingcircle from '../assests/loading.gif';
const Loading = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '80%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
      }}>
      <Image
        source={Loadingcircle}
        style={{width: 40, height: 40}}></Image>
      <Text>Loading</Text>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});