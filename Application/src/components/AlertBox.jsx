import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const AlertBox = ({callFunction, title, description, mute, success}) => {
  function handleClick() {
    console.log('Button clicked');
    callFunction(false);
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <FontAwesome
          style={[styles.icon, {color: success ? '#28A745' : '#FA8055'}]}
          name={success ? 'check-circle' : 'exclamation-triangle'}
          size={40}
        />

        {/* Cross Button - Show only if mute is NOT passed */}
        {!mute && (
          <Entypo
            onPress={handleClick}
            style={styles.crossButton}
            name="cross"
          />
        )}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Okay Button - Show only if mute is NOT passed */}
        {!mute && (
          <TouchableOpacity
            style={[
              styles.okayButton,
              {backgroundColor: success ? '#28A745' : '#FA8055'},
            ]}
            onPress={handleClick}>
            <Text style={styles.okayText}>Okay</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AlertBox;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    top: '40%',
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  icon: {
    color: '#FA8055',
  },
  crossButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    fontSize: 30,
    color: 'black',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: 13,
  },
  okayButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  okayText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    color: 'white',
    fontSize: 14,
  },
});
